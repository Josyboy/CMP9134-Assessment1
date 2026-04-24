import React, { useEffect, useState } from "react";
import apiService from "../services/api";
import { type AuditEntry, type AuditLog } from "../types/index";
import { Clock, CheckCircle, XCircle, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import { formatDate } from "../components/Utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageHelmet from "../components/PageHelmet";

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<AuditLog["pagination"] | null>(
    null,
  );
  const [limit, setLimit] = useState("10");

  const itemPerPageData = [
    { name: "10 rows", id: "10" },
    { name: "15 rows", id: "15" },
    { name: "20 rows", id: "20" },
    { name: "50 rows", id: "50" },
    { name: "100 rows", id: "100" },
  ];

  const fetchLogs = async () => {
    try {
      const data = (await apiService.getAuditLogs(
        page,
        parseInt(limit),
      )) as AuditLog;
      setLogs(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "User", "Action", "Success"],
      ...logs.map((log) => [
        formatDate(log.createdAt || ""),
        log.userForename,
        log.action,
        log.success ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchLogs();
  }, [page, limit]);

  return (
    <>
      <PageHelmet
        title="Audit Logs | Robot GCS"
        description="View mission audit logs and robot command history."
      />
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Mission Audit Log</h3>
            <button
              onClick={exportLogs}
              className="flex items-center gap-2 px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    S/N
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      No audit logs available
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr
                      key={index}
                      className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-600">{index + 1}</td>

                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(log.createdAt || "")}
                        </div>
                      </td>
                      <td className="px-4 py-2 font-semibold">
                        {log.userForename}
                      </td>
                      <td className="px-4 py-2 font-semibold">
                        {log.action.replace("_", " ")}
                      </td>
                      <td className="px-4 py-2 font-semibold">
                        {log.userRole}
                      </td>
                      <td className="px-4 py-2">
                        {log.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 w-full">
            <div className="flex items-center gap-3">
              <button
                disabled={!pagination?.hasPrevPage}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                <ChevronLeft />
              </button>

              <span className="text-sm text-slate-600">
                Page {pagination?.currentPage || 1} of{" "}
                {pagination?.totalPages || 1}
              </span>

              <button
                disabled={!pagination?.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                <ChevronRight />
              </button>
            </div>

            <div className="">
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 outline-none cursor-pointer">
                {itemPerPageData.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AuditLogs;
