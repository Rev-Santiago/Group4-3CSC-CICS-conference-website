// src/pages/AdminAddEvent.jsx
import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { Add } from "@mui/icons-material";

export default function AdminAddEvent({ currentUser }) {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    keynoteSpeaker: "",
    invitedSpeaker: "",
    theme: "",
    category: "",
    keynoteImage: null,
    invitedImage: null,
    zoomLink: "",
  });
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEventData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to publish event");
      alert("✅ Event published successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("❌ Error publishing event.");
    }
  };

  const handleSaveDraft = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) throw new Error("Failed to save draft");
      alert("📝 Draft saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error saving draft.");
    }
  };

  const handleOpenDetails = () => setDetailsOpen(true);
  const handleCloseDetails = () => setDetailsOpen(false);
  
  return (
    <Box className="p-4">
      {/* Speakers */}
      <Grid item xs={12}>
        <Typography variant="subtitle1">Details:</Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth size="small" label="Title" name="title" value={eventData.title} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth size="small" label="Date" type="date" name="date" InputLabelProps={{ shrink: true }} value={eventData.date} onChange={handleChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField fullWidth size="small" label="Start Time" type="time" name="startTime" InputLabelProps={{ shrink: true }} value={eventData.startTime} onChange={handleChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField fullWidth size="small" label="End Time" type="time" name="endTime" InputLabelProps={{ shrink: true }} value={eventData.endTime} onChange={handleChange} />
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth size="small" label="Venue" name="venue" select value={eventData.venue} onChange={handleChange}>
            <MenuItem value="Cafeteria">Cafeteria</MenuItem>
            <MenuItem value="Auditorium">Auditorium</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth size="small" label="Zoom Link" name="zoomLink" value={eventData.zoomLink} onChange={handleChange} />
        </Grid>
        {/* Speakers */}
      <Grid item xs={12}>
        <Typography variant="subtitle1">Speaker(s):</Typography>
      </Grid>
        <Grid item xs={12}>
          <TextField fullWidth size="small" label="Keynote Speaker" name="keynoteSpeaker" value={eventData.keynoteSpeaker} onChange={handleChange} />
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" component="label">
            Upload Keynote Image
            <input type="file" name="keynoteImage" hidden onChange={handleFileChange} />
          </Button>
          {eventData.keynoteImage && <Typography>{eventData.keynoteImage.name}</Typography>}
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth size="small" label="Invited Speaker" name="invitedSpeaker" value={eventData.invitedSpeaker} onChange={handleChange} />
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" component="label">
            Upload Invited Image
            <input type="file" name="invitedImage" hidden onChange={handleFileChange} />
          </Button>
          {eventData.invitedImage && <Typography>{eventData.invitedImage.name}</Typography>}
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth size="small" label="Theme" name="theme" value={eventData.theme} onChange={handleChange} />
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth size="small" label="Category" name="category" select value={eventData.category} onChange={handleChange}>
            <MenuItem value="Conference">Conference</MenuItem>
            <MenuItem value="Workshop">Workshop</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} className="flex gap-2">
          <Button variant="outlined" onClick={handleOpenDetails}>See All Details</Button>
          <Button variant="contained" color="warning" onClick={handleSaveDraft}>Save</Button>
          {currentUser?.account_type === "super_admin" && (
            <Button variant="contained" color="error" onClick={handleSubmit}>Publish</Button>
          )}
        </Grid>
      </Grid>

      <Dialog open={detailsOpen} onClose={handleCloseDetails} fullWidth>
        <DialogTitle>Event Details Overview</DialogTitle>
        <DialogContent>
          {Object.entries(eventData).map(([key, val]) => (
            <Typography key={key} variant="body2"><strong>{key}:</strong> {val?.name || val}</Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
