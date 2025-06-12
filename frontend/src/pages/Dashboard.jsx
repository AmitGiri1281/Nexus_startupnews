import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Session expired. Please login again.");
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-indigo-700 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          ) : (
            <span className="text-xl font-bold">AP</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-full hover:bg-indigo-600"
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        <nav className="mt-6">
          <NavItem
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
            text="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            text="Analytics"
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            text="Users"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            sidebarOpen={sidebarOpen}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {activeTab}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-1 rounded-full hover:bg-gray-200">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  {userData?.name?.charAt(0) || "U"}
                </div>
                {sidebarOpen && (
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-700">{userData?.name || "User"}</p>
                    <p className="text-xs text-gray-500">{userData?.email || "user@example.com"}</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {sidebarOpen && <span className="ml-1">Logout</span>}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {activeTab === "overview" && <OverviewTab userData={userData} />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "users" && <UsersTab />}
        </main>
      </div>
    </div>
  );
};

// Sub-components
const NavItem = ({ icon, text, active, onClick, sidebarOpen }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 ${
      active ? "bg-indigo-800" : "hover:bg-indigo-600"
    } transition-colors duration-200`}
  >
    <span className="flex-shrink-0">{icon}</span>
    {sidebarOpen && <span className="ml-3">{text}</span>}
  </button>
);

const OverviewTab = ({ userData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900">Welcome back, {userData?.name || "User"}!</h3>
      <p className="mt-2 text-gray-600">You have 5 new notifications and 3 pending tasks.</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      <ul className="mt-4 space-y-3">
        <li className="flex items-start">
          <span className="h-2 w-2 mt-2 rounded-full bg-blue-500"></span>
          <p className="ml-3 text-sm text-gray-600">Logged in at {new Date().toLocaleTimeString()}</p>
        </li>
      </ul>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
      <div className="mt-4 flex space-x-3">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Create New
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
          View Reports
        </button>
      </div>
    </div>
  </div>
);

const AnalyticsTab = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-medium text-gray-900">Analytics Dashboard</h3>
    <div className="mt-4 h-64 bg-gray-100 rounded flex items-center justify-center">
      <p className="text-gray-500">Analytics charts will appear here</p>
    </div>
  </div>
);

const UsersTab = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-medium text-gray-900">User Management</h3>
    <div className="mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
            <td className="px-6 py-4 whitespace-nowrap">john@example.com</td>
            <td className="px-6 py-4 whitespace-nowrap">Admin</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default Dashboard;