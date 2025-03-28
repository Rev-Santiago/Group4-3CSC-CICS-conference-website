import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniDrawer from "../../components/miniDrawer/MiniDrawer";
import PageCardComponent from "../../components/pageCardsComponent/PageCardsComponent";

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdminData() {
      const token = localStorage.getItem("authToken"); 
      if (!token) {
        navigate("/login"); 
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/admin-dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }, 
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        setAdminData(data);
      } catch (error) {
        console.error("Access denied:", error);
        navigate("/login"); 
      }
    }

    fetchAdminData();
  }, [navigate]);

  const handleSeeMore = () => {
    console.log("See more clicked");
  };

  return (
    <div className="bg-gray-200 rounded-3xl min-h-screen flex flex-col items-center px-4">
      <h1 className="text-4xl font-bold text-center mt-10 mb-5 border-b-2 border-black pb-2">
        Page Preview
      </h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
        {["Home", "Call For Papers", "Contacts", "Partners", "Committee", "Event History"].map((title, index) => (
          <PageCardComponent key={index} title={title} lastEdited="1:05 PM" />
        ))}
      </div>
    </div>
  );
}

