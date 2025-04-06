import { useState } from "react";
import { Menu, MenuItem, IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function PageCardComponent({ title, lastEdited, screenshotUrl }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false); 

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
    <div className="flex justify-center">
      <div className="border shadow-lg rounded-md p-4 relative bg-white w-full sm:w-[300px] md:w-[320px] lg:w-[350px]">
        <img
          src={screenshotUrl}  
          alt={title}
          className="w-full h-40 object-cover rounded-md cursor-pointer"
          onClick={() => setOpen(true)}
        />
        <div className="flex justify-between items-center mt-2">
          <h2 className="text-lg font-semibold hover:underline cursor-pointer" onClick={() => setOpen(true)}>
            {title}
          </h2>

          <IconButton aria-label="settings" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </div>
        <p className="text-sm text-gray-500">Last edited: {lastEdited}</p>
        <button className="bg-customRed text-white p-2 w-full mt-2 rounded-md">
          Publish
        </button>

        {/* 🔹 Scrollable Image Preview Modal */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" scroll="paper">
          <DialogTitle className="text-center font-semibold">{title}</DialogTitle>
          <DialogContent dividers className="flex justify-center items-center max-h-[80vh]">
            <img src={screenshotUrl} alt={title} className="max-w-full h-auto rounded-md" />
          </DialogContent>
        </Dialog>

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
        </Menu>
      </div>
    </div>
  );
}
