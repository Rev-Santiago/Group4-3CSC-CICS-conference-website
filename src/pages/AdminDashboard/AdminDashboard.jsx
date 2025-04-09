import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniDrawer from "../../components/miniDrawer/MiniDrawer";
import PageCardComponent from "../../components/pageCardsComponent/PageCardsComponent";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [screenshots, setScreenshots] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdminData() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/admin-dashboard`, {
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

  // Fetch screenshots from backend
  useEffect(() => {
    async function fetchScreenshots() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/screenshots`);
        if (!response.ok) throw new Error("Failed to fetch screenshots");

        const data = await response.json();
        console.log("Screenshots data:", data);
        setScreenshots(data);
      } catch (error) {
        console.error("Error fetching screenshots:", error);
      }
    }

    fetchScreenshots();
  }, []);

  const pages = ["Home", "Call For Papers", "Contacts", "Partners", "Committee", "Event History", "Registration & Fees", "Publication", "Schedule", "Venue", "Keynote Speakers", "Invited Speakers"];

  return (
    <div className="rounded-3xl min-h-screen flex flex-col items-center px-4 ">
      <h1 className="text-4xl font-bold text-center mt-10  ">
        Page Preview
      </h1>
      <div className="w-[90%] border-black  border-b  mb-5 pb-2" />


      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5 mb-8">
        {pages.map((title, index) => (
          <PageCardComponent
            key={index}
            title={title}
            lastEdited="1:05 PM"
            screenshotUrl={screenshots[title] || "/loading-placeholder.jpg"} // ✅ Show a placeholder until loaded
          />
        ))}
      </div>
    </div>
  );
}
