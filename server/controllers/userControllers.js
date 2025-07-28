import User from "../models/user-model.js";
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
