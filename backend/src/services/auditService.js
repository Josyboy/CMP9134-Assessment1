import AuditEntry from "../models/AuditEntry.js";

export const recordAudit = async ({
  req,
  action,
  payload = {},
  robotStateBefore = null,
  robotStateAfter = null,
  success,
  errorMessage = null,
}) => {
  try {
    await AuditEntry.create({
      userId: req.currentUser?.userId || null,
      userEmail: req.currentUser?.email || null,
      userForename: req.currentUser?.forename || null,
      userRole: req.currentUser?.role || null,
      action,
      payload,
      robotStateBefore,
      robotStateAfter,
      success,
      errorMessage,
    });
  } catch (error) {
    console.error("Audit logging failed:", error.message);
  }
};
