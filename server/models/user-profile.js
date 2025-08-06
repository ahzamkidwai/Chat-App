import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profilePhotoUrl: { type: String },
    personal_details: {
      firstName: { type: String, required: true },
      middleName: { type: String },
      lastName: { type: String, required: true },
      dob: { type: String },
    },
    contact_information: {
      email: { type: String, required: true },
      phone: { type: String },
      city: { type: String },
      country: { type: String },
    },
    professional_details: {
      occupation: { type: String },
      website: { type: String },
    },
    additional_information: {
      statusMessage: { type: String },
      bio: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserProfile", userProfileSchema);
