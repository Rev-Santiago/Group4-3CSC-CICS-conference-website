import { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CircularProgress from "@mui/material/CircularProgress";

export default function PageCardComponent({ title, lastEdited, screenshotUrl }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // Add state for zoom level

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

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3)); // Limit the zoom to 3x
  };
  
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 1)); // Limit the zoom to 1x (no zoom out further)
  };
  
  return (
    <div className="flex justify-center">
      <div className="border shadow-lg rounded-md p-6 relative bg-white w-full sm:w-[300px] md:w-[320px] lg:w-[350px]">
        {/* Show CircularProgress if screenshotUrl is null */}
        {screenshotUrl ? (
          <img
            src={screenshotUrl}
            alt={title}
            className="w-full h-60 object-cover rounded-md cursor-pointer"
            onClick={() => setOpen(true)}
          />
        ) : (
          <div className="w-full h-40 flex justify-center items-center">
            <CircularProgress />
          </div>
        )}

        {/* Title + Options */}
        <div className="flex justify-between items-center mt-2">
          <h2
            className="text-lg font-semibold hover:underline cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {title}
          </h2>

          {/* 
          <IconButton aria-label="settings" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton> */}
        </div>
        {/* <p className="text-sm text-gray-500">Last edited: {lastEdited}</p> */}
        <button className="bg-customRed text-white p-2 w-full mt-2 rounded-md" onClick={() => setOpen(true)}>
          Preview Page
        </button>

        {/* 🔹 Scrollable Image Preview Modal */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="md"
          scroll="paper"
          sx={{ maxHeight: "700px", overflowY: "auto" }}
        >
          <DialogTitle className="text-center font-semibold">{title}</DialogTitle>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={handleZoomOut}
              className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700"
            >
              -
            </button>
            <button
              onClick={handleZoomIn}
              className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700"
            >
              +
            </button>
          </div>

          <DialogContent dividers className="flex justify-center items-center" sx={{ overflow: "visible" }}>
            <div className="relative w-full h-full overflow-auto">  
              <img
                src={screenshotUrl}
                alt={title}
                className="object-contain w-full h-full"
                style={{
                  transform: `scale(${zoomLevel})`, 
                  transition: "transform 0.3s ease", 
                  transformOrigin: "center center",  
                }}
              />
            </div>
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