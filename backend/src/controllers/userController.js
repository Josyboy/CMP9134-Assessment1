import User from "../models/User.js";
import { recordAudit } from "../services/auditService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    await recordAudit({
      req,
      action: "GET_USERS",
      payload: {},
      success: true,
    });

    return res.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["COMMANDER", "VIEWER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be COMMANDER or VIEWER",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await recordAudit({
      req,
      action: "ROLE_UPDATE",
      payload: { targetUserId: id, newRole: role },
      success: true,
    });

    return res.json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};
