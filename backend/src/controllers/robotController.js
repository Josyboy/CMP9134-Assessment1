import robotService from "../services/robotService.js";
import { recordAudit } from "../services/auditService.js";

export const getRobotStatus = async (req, res) => {
  try {
    const status = await robotService.fetchStatus();

    await recordAudit({
      req,
      action: "STATUS",
      robotStateAfter: status,
      success: true,
    });

    return res.json({
      success: true,
      message: "Robot status fetched",
      data: status,
    });
  } catch (error) {
    await recordAudit({
      req,
      action: "STATUS",
      success: false,
      errorMessage: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to fetch robot status",
      error: error.message,
    });
  }
};

export const moveRobot = async (req, res) => {
  try {
    const { x, y } = req.body;

    if (x === undefined || y === undefined) {
      return res.status(400).json({
        success: false,
        message: "x and y are required",
      });
    }

    const before = await robotService.fetchStatus();
    const moveResult = await robotService.moveTo(x, y);
    const after = await robotService.fetchStatus();

    await recordAudit({
      req,
      action: "MOVE",
      payload: { x, y },
      robotStateBefore: before,
      robotStateAfter: after,
      success: true,
    });

    return res.json({
      success: true,
      message: "Robot move successful",
      data: moveResult,
    });
  } catch (error) {
    await recordAudit({
      req,
      action: "MOVE",
      payload: req.body,
      success: false,
      errorMessage: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Move failed",
      error: error.message,
    });
  }
};

export const resetRobot = async (req, res) => {
  try {
    const before = await robotService.fetchStatus();
    const result = await robotService.resetPosition();
    const after = await robotService.fetchStatus();

    await recordAudit({
      req,
      action: "RESET",
      robotStateBefore: before,
      robotStateAfter: after,
      success: true,
    });

    return res.json({
      success: true,
      message: "Robot reset successful",
      data: result,
    });
  } catch (error) {
    await recordAudit({
      req,
      action: "RESET",
      success: false,
      errorMessage: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Reset failed",
      error: error.message,
    });
  }
};

export const getRobotMap = async (req, res) => {
  try {
    const map = await robotService.fetchMap();

    await recordAudit({
      req,
      action: "MAP",
      success: true,
    });

    return res.json({
      success: true,
      message: "Map fetched successfully",
      data: map,
    });
  } catch (error) {
    await recordAudit({
      req,
      action: "MAP",
      success: false,
      errorMessage: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to fetch map",
      error: error.message,
    });
  }
};

export const getRobotSensors = async (req, res) => {
  try {
    const sensors = await robotService.fetchSensors();

    await recordAudit({
      req,
      action: "SENSOR",
      success: true,
    });

    return res.json({
      success: true,
      message: "Sensor data fetched successfully",
      data: sensors,
    });
  } catch (error) {
    await recordAudit({
      req,
      action: "SENSOR",
      success: false,
      errorMessage: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sensor data",
      error: error.message,
    });
  }
};
