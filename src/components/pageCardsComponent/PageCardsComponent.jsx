import { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function PageCardsComponent({ title, lastEdited }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log("Edit", title);
    handleMenuClose();
  };

  return (
    <div className="border shadow-lg rounded-md p-4 relative">
      <img src="/placeholder.jpg" alt={title} className="w-full h-40 object-cover rounded-md" />
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <IconButton aria-label="settings" onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
      </div>
      <p className="text-sm text-gray-500">Last edited: {lastEdited}</p>
      <button className="bg-customRed text-white p-2 w-full mt-2 rounded-md">Publish</button>
      
      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
      </Menu>
    </div>
  );
}
