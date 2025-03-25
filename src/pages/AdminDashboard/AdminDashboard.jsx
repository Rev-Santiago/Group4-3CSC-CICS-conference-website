import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniDrawer from "../../components/miniDrawer/MiniDrawer";
import PageCardComponent from "../../components/pageCardsComponent/PageCardsComponent";

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

  const handleSeeMore = () => {
    console.log("See more clicked");
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-5 border-b-2 border-black pb-2">Page Preview</h1>
      <div className="grid grid-cols-3 gap-4 pt-5">
        {["Home", "Call For Papers", "Contacts", "Partners", "Committee", "Event History"].map((title, index) => (
          <PageCardComponent key={index} title={title} lastEdited="1:05 PM" />
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <button onClick={handleSeeMore} className="bg-customRed text-white px-4 py-2 rounded-full flex items-center">
          See More <span className="ml-2">▼</span>
        </button>
      </div>
    </div>
  );
}
