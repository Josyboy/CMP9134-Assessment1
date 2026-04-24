import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    forename: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["COMMANDER", "VIEWER"],
      default: "VIEWER",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
