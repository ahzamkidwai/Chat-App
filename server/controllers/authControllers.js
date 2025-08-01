import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "82ce3d775715dc35d63ddc68ae687a341eb7de3d63cac6e2c7e4aac8beb1124beeac3fce5fb6fd6c41037e33cfa95dac7746062fd8190c4d5f5a0c02dc0b2fba";
console.log("JWT SECRET : ", JWT_SECRET);
export const registerUser = async (req, res) => {
  try {
    const { phoneNumber, firstName, middleName, lastName, email, password } =
      req.body;

    if (
      !phoneNumber?.trim() ||
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password?.trim()
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fullName =
      middleName && middleName.trim().length > 0
        ? `${firstName.trim()} ${middleName.trim()} ${lastName.trim()}`
        : `${firstName.trim()} ${lastName.trim()}`;

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    console.log(`OTP for ${phoneNumber}: ${otp}`);

    await User.findOneAndUpdate(
      { phoneNumber },
      {
        phoneNumber: phoneNumber.trim(),
        firstName: firstName.trim(),
        middleName: middleName?.trim() || "",
        lastName: lastName.trim(),
        fullName,
        email: email.trim(),
        password: hashedPassword,
        otp,
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: "OTP sent successfully. Please verify to complete registration.",
      phoneNumber,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber?.trim() || !otp) {
      return res
        .status(400)
        .json({ message: "Phone number and OTP are required" });
    }

    const user = await User.findOne({ phoneNumber: phoneNumber.trim() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .status(200)
      .json({ message: "User verified successfully", token, user });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updateData = {};
    const {
      phoneNumber,
      firstName,
      middleName,
      lastName,
      email,
      profilePhoto,
    } = req.body;

    if (phoneNumber?.trim()) updateData.phoneNumber = phoneNumber.trim();
    if (firstName?.trim()) updateData.firstName = firstName.trim();
    if (middleName !== undefined)
      updateData.middleName = middleName?.trim() || "";
    if (lastName?.trim()) updateData.lastName = lastName.trim();
    if (email?.trim()) updateData.email = email.trim();
    if (profilePhoto?.trim()) updateData.profilePhoto = profilePhoto.trim();

    // Reconstruct fullName only if name fields are being updated
    if (
      updateData.firstName ||
      updateData.lastName ||
      updateData.middleName !== undefined
    ) {
      const fName = updateData.firstName ?? undefined;
      const mName = updateData.middleName ?? undefined;
      const lName = updateData.lastName ?? undefined;

      if (fName && lName) {
        updateData.fullName = mName
          ? `${fName} ${mName} ${lName}`
          : `${fName} ${lName}`;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { loginId, password } = req.body;
    console.log("Login attempt with:", { loginId, password });

    if (!loginId?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number/email and password are required",
      });
    }

    const isEmail = loginId.includes("@");
    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginId.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!isEmail && !/^\d{10,15}$/.test(loginId.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number (10-15 digits)",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: isEmail ? loginId.trim().toLowerCase() : undefined },
        { phoneNumber: !isEmail ? loginId.trim() : undefined },
      ],
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check your credentials or register.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Account not verified. Please verify your account first.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password.trim(),
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is not defined in the environment variables."
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
      process.env.JWT_SECRET, // ensure JWT_SECRET is defined in your env
      { expiresIn: "7d" }
    );

    const userResponse = {
      _id: user._id,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      profilePhoto: user.profilePhoto,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // ✅ Set HTTP-only secure cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse, // ❌ Do not send token in JSON for added security
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
