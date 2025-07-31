import User from "../models/user-model.js";
import UserProfile from "../models/user-profile.js";

export const searchUserByPhoneNumber = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone || typeof phone !== "string") {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const trimmedPhone = phone.trim();

    if (!/^\d+$/.test(trimmedPhone)) {
      return res
        .status(400)
        .json({ message: "Phone number must contain only digits" });
    }

    if (trimmedPhone.length > 10) {
      return res
        .status(400)
        .json({ message: "Phone number cannot exceed 10 digits" });
    }

    // Use regex for partial match from start (e.g., '^123')
    const phoneRegex = new RegExp("^" + trimmedPhone);

    const users = await User.find({ phoneNumber: { $regex: phoneRegex } });

    if (users.length === 0) {
      return res.status(404).json({ message: "No matching users found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Search user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfileDetails = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("User ID in getUserProfileDetails:", userId);

    if (!userId) {
      console.log("User ID not found in request");
      return res
        .status(400)
        .json({ message: "User ID not found (User ID not found in request) " });
    }

    // Find if profile already exists
    let profile = await UserProfile.findOne({ userId });

    // If not, create from user
    if (!profile) {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create new profile with details from User
      profile = new UserProfile({
        userId: user._id,
        personal_details: {
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
        },
        contact_information: {
          email: user.email,
          phone: user.phoneNumber,
        },
      });

      await profile.save();
    }

    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error getting/creating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updates = req.body;
    console.log("Updates received for profile:", updates);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Single User not found" });
    }
    console.log("User found for profile update:", user);

    const userFieldsToUpdate = {};
    if (updates.personal_details?.firstName)
      userFieldsToUpdate.firstName = updates.personal_details.firstName;
    if (updates.personal_details?.middleName)
      userFieldsToUpdate.middleName = updates.personal_details.middleName;
    if (updates.personal_details?.lastName)
      userFieldsToUpdate.lastName = updates.personal_details.lastName;
    if (updates.contact_information?.email)
      userFieldsToUpdate.email = updates.contact_information.email;
    if (updates.contact_information?.phone)
      userFieldsToUpdate.phoneNumber = updates.contact_information.phone;

    if (Object.keys(userFieldsToUpdate).length > 0) {
      userFieldsToUpdate.fullName = [
        updates.personal_details?.firstName || user.firstName,
        updates.personal_details?.middleName || user.middleName || "",
        updates.personal_details?.lastName || user.lastName,
      ]
        .filter(Boolean)
        .join(" ");
      await User.findByIdAndUpdate(
        userId,
        { $set: userFieldsToUpdate },
        { new: true }
      );
    }

    // Find and update the user's profile
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
