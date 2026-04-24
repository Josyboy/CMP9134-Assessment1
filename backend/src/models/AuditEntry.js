import mongoose from "mongoose";

const auditEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userEmail: {
      type: String,
      default: null,
    },
    userForename: {
      type: String,
      default: null,
    },
    userRole: {
      type: String,
      default: null,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "MOVE",
        "RESET",
        "STATUS",
        "MAP",
        "SENSOR",
        "ROLE_UPDATE",
        "GET_USERS",
        "SIGN_UP",
        "SIGN_IN",
      ],
    },
    payload: {
      type: Object,
      default: {},
    },
    robotStateBefore: {
      type: Object,
      default: null,
    },
    robotStateAfter: {
      type: Object,
      default: null,
    },
    success: {
      type: Boolean,
      required: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("AuditEntry", auditEntrySchema);
