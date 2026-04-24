import AuditEntry from "../models/AuditEntry.js";

export const getAuditEntries = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const totalEntries = await AuditEntry.countDocuments();

    const entries = await AuditEntry.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalEntries / limit);

    return res.json({
      success: true,
      message: "Audit entries fetched successfully",
      data: entries,
      pagination: {
        totalEntries,
        currentPage: page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit entries",
      error: error.message,
    });
  }
};
