import mongoose from "mongoose";
import UserProfile from "./user-profile.js";

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: { type: Number },
  otpExpiresAt: { type: Date },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  profilePhoto: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },

  lastSeen: { type: Date, default: Date.now },
});

// Post-save hook to create UserProfile automatically
userSchema.post("save", async function (doc, next) {
  try {
    // Check if profile already exists
    const existingProfile = await UserProfile.findOne({ userId: doc._id });
    if (!existingProfile) {
      await UserProfile.create({
        userId: doc._id,
        personal_details: {
          firstName: doc.firstName,
          middleName: doc.middleName,
          lastName: doc.lastName,
        },
        contact_information: {
          email: doc.email,
          phone: doc.phoneNumber,
        },
      });
      console.log("UserProfile created for user:", doc._id);
    }
  } catch (err) {
    console.error("Error creating UserProfile:", err);
  }
  next();
});

export default mongoose.model("User", userSchema);
