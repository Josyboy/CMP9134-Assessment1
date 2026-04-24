import { useEffect, useState } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import apiService from "../services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { User } from "../types";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const handleLogout = () => {
    apiService.logout();
    navigate("/login");
  };

  const navClass = (path: string) =>
    pathname === path
      ? "rounded-lg bg-blue-600 px-4 py-2 text-white"
      : "rounded-lg px-4 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">RGCS</h1>
              {/* <Bot className="text-red-400" /> */}
              <img
                src="/pngwing.com.png"
                alt="robot"
                className="h-[40px] w-[40px]"
              />

              <nav className="flex items-center gap-2 lg:ml-3">
                <Link to="/dashboard" className={navClass("/dashboard")}>
                  Dashboard
                </Link>
                <Link
                  to="/lidar_summary"
                  className={navClass("/lidar_summary")}>
                  LiDAR Summary
                </Link>
                {currentUser?.role === "COMMANDER" && (
                  <>
                    <Link to="/audit_logs" className={navClass("/audit_logs")}>
                      Audit Logs
                    </Link>
                    <Link to="/users" className={navClass("/users")}>
                      Users
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-slate-600" />
              <span className="text-sm">
                {currentUser?.forename} ({currentUser?.role})
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
