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

  const generateScreenshotUrl = (title) => {
    return `/screenshots/${title
      .toLowerCase()
      .replace(/ & /g, "-")
      .replace(/\s+/g, "-")}.png`;
  };

  const fallbackUrl = generateScreenshotUrl(title);
  const imageUrl = screenshotUrl || fallbackUrl;

  return (
    <div className="flex justify-center">
      <div className="border shadow-lg rounded-md p-4 relative bg-white w-full sm:w-[300px] md:w-[320px] lg:w-[350px]">
        {/* Screenshot or Spinner */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-40 object-cover rounded-md cursor-pointer"
          onClick={() => setOpen(true)}
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = e.target.parentNode.querySelector(".spinner");
            if (fallback) fallback.style.display = "flex";
          }}
        />
        <div
          className="w-full h-40 flex justify-center items-center spinner"
          style={{ display: "none" }}
        >
          <CircularProgress />
        </div>

        {/* Title + Options */}
        <div className="flex justify-between items-center mt-2">
          <h2
            className="text-lg font-semibold hover:underline cursor-pointer"
            onClick={() => setOpen(true)}
          >
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

        {/* Modal Preview */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" scroll="paper">
          <DialogTitle className="text-center font-semibold">{title}</DialogTitle>
          <DialogContent dividers className="flex justify-center items-center ">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-200 object-cover"
            />
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