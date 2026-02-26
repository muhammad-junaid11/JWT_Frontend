import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/"); 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-blue-600">MyApp</h1>
            <button
              onClick={handleLogout}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>


      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Welcome back, {user?.username}!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              You are successfully logged into your secure dashboard.
            </p>
            
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border rounded-md hover:border-blue-300 transition-colors cursor-pointer bg-blue-50/30">
                <p className="font-semibold text-blue-700">View Profile</p>
              </div>
              <div className="p-4 border rounded-md hover:border-blue-300 transition-colors cursor-pointer bg-blue-50/30">
                <p className="font-semibold text-blue-700">Settings</p>
              </div>
              <div className="p-4 border rounded-md hover:border-blue-300 transition-colors cursor-pointer bg-blue-50/30">
                <p className="font-semibold text-blue-700">Notifications</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;