import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniDrawer from "../../components/miniDrawer/MiniDrawer";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
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

  const handleMenuOpen = (event, card) => {
    setAnchorEl(event.currentTarget);
    setSelectedCard(card);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCard(null);
  };

  const handleEdit = () => {
    console.log("Edit", selectedCard);
    handleMenuClose();
  };

  const handleSeeMore = () => {
    setCards([...cards, "Placeholder Card 1", "Placeholder Card 2"]);
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-5 border-b-2 border-black pb-2">Page Preview</h1>
      <div className="grid grid-cols-3 gap-4 pt-5">
        {["Home", "Call For Papers", "Contacts", "Partners", "Committee", "Event History"].map((title, index) => (
          <div key={index} className="border shadow-lg rounded-md p-4 relative">
            <img src="/placeholder.jpg" alt={title} className="w-full h-40 object-cover rounded-md" />
            <div className="flex justify-between items-center mt-2">
              <h2 className="text-lg font-semibold">{title}</h2>
              {/* Vertical Dots Button */}
              <IconButton
                aria-label="settings"
                onClick={(event) => handleMenuOpen(event, title)}
              >
                <MoreVertIcon />
              </IconButton>
            </div>
            <p className="text-sm text-gray-500">Last edited: 1:05 PM</p>
            <button className="bg-customRed text-white p-2 w-full mt-2 rounded-md">Publish</button>
            
            {/* Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
            </Menu>
          </div>
          
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