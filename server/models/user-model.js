import mongoose from "mongoose";

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
});

export default mongoose.model("User", userSchema);
