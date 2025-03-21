import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniDrawer from "../../components/miniDrawer/MiniDrawer";


export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdminData() {
      const token = localStorage.getItem("authToken"); // ✅ Get stored token
      if (!token) {
        navigate("/login"); // ✅ Redirect if no token
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/admin-dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }, // ✅ Include token in request
          credentials: "include", // Required for session authentication
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        setAdminData(data);
      } catch (error) {
        console.error("Access denied:", error);
        navigate("/login"); // Redirect to login if not authenticated
      }
    }

    fetchAdminData();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem("authToken"); // ✅ Remove token on logout
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  return (
    <div className="container mx-auto mt-10">
      {/* <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {adminData ? (
        <> */}
          <MiniDrawer onLogout={handleLogout} />
          {/* <p className="mt-4">Welcome, {adminData.user}!</p>
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 mt-4">
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )} */}
    </div>
  );
}
