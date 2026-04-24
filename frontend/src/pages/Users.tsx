import { useEffect, useState } from "react";
import apiService from "../services/api";
import type { User } from "../types";
import Navbar from "../components/Navbar";
import { formatDate, formatTime } from "../components/Utils";
import { toast } from "react-toastify";
import api from "../services/api";
import PageHelmet from "../components/PageHelmet";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdateRole, setLoadingUpdateRole] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = (await apiService.getUsers()) as any;

      setUsers(data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, role: "COMMANDER" | "VIEWER") => {
    setLoadingUpdateRole(true);
    const toastId = toast.loading("Loading...", {
      type: "info",
      theme: "colored",
    });

    const result = await api.updateUserRole(id, role);
    try {
      if (result.success) {
        toast.update(toastId, {
          render: result.message || "User role updated successfully",
          type: "success",
          autoClose: 3000,
          isLoading: false,
        });
      } else {
        toast.update(toastId, {
          render: result.message || "Failed to update user role",
          type: "error",
          autoClose: 3000,
          isLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUpdateRole(false);
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <PageHelmet
        title="User | Robot GCS"
        description="Manage users and their permissions."
      />
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="text-lg font-semibold mb-4">Users</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    S/N
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Forename
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Date & Time Created
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      No users available
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={index}
                      className="border-t border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <td className="px-4 py-3 text-slate-600">{index + 1}</td>

                      <td className="px-4 py-2 font-semibold">
                        {user.forename}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(user.createdAt || "")} at{" "}
                        {formatTime(user.createdAt || "")}{" "}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          disabled={loadingUpdateRole}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              e.target.value as "COMMANDER" | "VIEWER",
                            )
                          }
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                          <option value="COMMANDER">Commander</option>
                          <option value="VIEWER">Viewer</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
};

export default Users;
