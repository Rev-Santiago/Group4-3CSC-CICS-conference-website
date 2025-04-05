import { useState } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";

export default function AdminAddEvent() {
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
    zoomLink: "", // added zoom link state
  });

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

      if (!res.ok) throw new Error("Failed to add event");

      alert("✅ Event added successfully!");
      setEventData({
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
    } catch (err) {
      console.error(err);
      alert("❌ Error adding event.");
    }
  };

  return (
    <Grid container spacing={3} className="mt-3">
      {/* Event Details */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
          Event Details:
        </Typography>
        <TextField
          fullWidth
          size="small"
          label="Title"
          name="title"
          variant="outlined"
          value={eventData.title}
          onChange={handleChange}
        />
      </Grid>

      {/* Date and Time */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          label="Date"
          type="date"
          name="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={eventData.date}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          label="Start Time"
          type="time"
          name="startTime"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={eventData.startTime}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          label="End Time"
          type="time"
          name="endTime"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={eventData.endTime}
          onChange={handleChange}
        />
      </Grid>

      {/* Venue */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          size="small"
          label="Venue"
          name="venue"
          select
          variant="outlined"
          value={eventData.venue}
          onChange={handleChange}
        >
          <MenuItem value="Cafeteria">Cafeteria</MenuItem>
          <MenuItem value="Auditorium">Auditorium</MenuItem>
        </TextField>
      </Grid>

      {/* Zoom Link */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          size="small"
          label="Zoom Link"
          name="zoomLink"
          variant="outlined"
          value={eventData.zoomLink}
          onChange={handleChange}
        />
      </Grid>

      {/* Speakers */}
      <Grid item xs={12}>
        <Typography variant="subtitle1">Speaker(s):</Typography>
      </Grid>
      <Grid item xs={12} className="flex items-center gap-2">
        <TextField
          fullWidth
          size="small"
          label="Keynote Speaker"
          name="keynoteSpeaker"
          variant="outlined"
          value={eventData.keynoteSpeaker}
          onChange={handleChange}
        />
        <IconButton color="black">
          <Add />
        </IconButton>
      </Grid>

      {/* Keynote and Invited Images */}
      <Grid item xs={12} className="flex items-center gap-2">
        <Button variant="outlined" component="label">
          Upload Keynote Image
          <input
            type="file"
            name="keynoteImage"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {eventData.keynoteImage && (
          <Typography variant="body2">{eventData.keynoteImage.name}</Typography>
        )}
      </Grid>

      <Grid item xs={12} className="flex items-center gap-2">
        <TextField
          fullWidth
          size="small"
          label="Invited Speaker"
          name="invitedSpeaker"
          variant="outlined"
          value={eventData.invitedSpeaker}
          onChange={handleChange}
        />
        <IconButton color="black">
          <Add />
        </IconButton>
      </Grid>
      <Grid item xs={12} className="flex items-center gap-2">
        <Button variant="outlined" component="label">
          Upload Invited Image
          <input
            type="file"
            name="invitedImage"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {eventData.invitedImage && (
          <Typography variant="body2">{eventData.invitedImage.name}</Typography>
        )}
      </Grid>

      {/* Theme and Category */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          size="small"
          label="Theme"
          name="theme"
          variant="outlined"
          value={eventData.theme}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          size="small"
          label="Category"
          name="category"
          select
          variant="outlined"
          value={eventData.category}
          onChange={handleChange}
        >
          <MenuItem value="Conference">Conference</MenuItem>
          <MenuItem value="Workshop">Workshop</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Event
        </Button>
      </Grid>
    </Grid>
  );
}
