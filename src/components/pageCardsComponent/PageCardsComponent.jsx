import { useState, useEffect } from "react";
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Reset loading state when screenshot URL changes
  useEffect(() => {
    if (screenshotUrl) {
      setImageLoading(true);
      setImageError(false);
      
      // Preload the image
      const img = new Image();
      img.onload = () => {
        console.log(`Image for ${title} loaded successfully!`);
        setImageLoading(false);
      };
      img.onerror = () => {
        console.error(`Image for ${title} failed to load`);
        setImageError(true);
        setImageLoading(false);
      };
      img.src = screenshotUrl;
    } else {
      // No screenshot URL provided
      setImageLoading(false);
      setImageError(true);
    }
  }, [screenshotUrl, title]);

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
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 1));
  };
  
  return (
    <div className="flex justify-center">
      <div className="border shadow-lg rounded-md p-6 relative bg-white w-full sm:w-[300px] md:w-[320px] lg:w-[350px]">
        {/* Image container with fixed height */}
        <div 
          className="w-full h-60 relative rounded-md overflow-hidden bg-gray-100 cursor-pointer"
          onClick={() => !imageError && setOpen(true)}
        >
          {/* Loading indicator */}
          {imageLoading && (
            <div className="absolute inset-0 flex justify-center items-center">
              <CircularProgress size={40} />
            </div>
          )}
          
          {/* Display fallback if there's an error or no screenshot */}
          {(imageError || !screenshotUrl) && !imageLoading && (
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 mt-2">No preview available</p>
            </div>
          )}
          
          {/* The actual image - using background-image for better performance */}
          {screenshotUrl && !imageLoading && !imageError && (
            <div 
              className="w-full h-full" 
              style={{ 
                backgroundImage: `url(${screenshotUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top'
              }}
            />
          )}
        </div>

        {/* Title */}
        <div className="flex justify-between items-center mt-2">
          <h2
            className="text-lg font-semibold hover:underline cursor-pointer"
            onClick={() => !imageError && setOpen(true)}
          >
            {title}
          </h2>
        </div>
        
        {/* Preview button */}
        <button 
          className={`${imageError ? 'bg-gray-400' : 'bg-customRed'} text-white p-2 w-full mt-2 rounded-md`} 
          onClick={() => !imageError && setOpen(true)}
          disabled={imageError}
        >
          {imageError ? 'Preview Unavailable' : 'Preview Page'}
        </button>

        {/* Preview Modal */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="md"
          scroll="paper"
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

          <DialogContent dividers>
            {screenshotUrl && (
              <div className="relative overflow-auto max-h-[70vh]">  
                <img
                  src={screenshotUrl}
                  alt={title}
                  className="w-full object-contain"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transition: "transform 0.3s ease",
                    transformOrigin: "top center",
                  }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Menu */}
        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
        </Menu>
      </div>
    </div>
  );
}