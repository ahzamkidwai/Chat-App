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

    // Update UserProfile
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Update User model from updated profile fields
    const updatedUserFields = {};
    const pd = updatedProfile.personal_details || {};
    const ci = updatedProfile.contact_information || {};

    if (pd.firstName) updatedUserFields.firstName = pd.firstName;
    if (pd.middleName) updatedUserFields.middleName = pd.middleName;
    if (pd.lastName) updatedUserFields.lastName = pd.lastName;
    if (ci.email) updatedUserFields.email = ci.email;
    if (ci.phone) updatedUserFields.phoneNumber = ci.phone;

    updatedUserFields.fullName = [
      pd.firstName || user.firstName,
      pd.middleName || user.middleName || "",
      pd.lastName || user.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    console.log("Updating User with fields:", updatedUserFields);

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName: updatedProfile.personal_details.firstName,
          middleName: updatedProfile.personal_details.middleName,
          lastName: updatedProfile.personal_details.lastName,
          fullName: updatedProfile.fullName,
        },
      },
      { new: true }
    );

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

export const getUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Checking status for user ID:", userId);
    const isOnline = global.onlineUsers.has(userId);
    console.log("Is user online?", isOnline);
    console.log("Online users map:", global.onlineUsers);
    if (isOnline) {
      return res.status(200).json({ status: "online" });
    }

    const user = await User.findById(userId).select("lastSeen");
    console.log("User last seen:", user);
    res.status(200).json({
      status: "offline",
      lastSeen: user?.lastSeen || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
