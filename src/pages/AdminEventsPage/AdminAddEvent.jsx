import { useState } from "react";
import { Grid, TextField, MenuItem, Typography, Divider, IconButton, Button } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function AdminAddEvent({ onSubmit }) {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    keynoteSpeaker: "",
    invitedSpeaker: "",
    theme: "",
    category: "",
    keynoteImage: null,
    invitedImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEventData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = () => {
    onSubmit(eventData);
  };

  return (
    <Grid container spacing={3} className="mt-3">
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>Event Details:</Typography>
        <TextField fullWidth size="small" label="Title" name="title" variant="outlined" value={eventData.title} onChange={handleChange}  />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth size="small" label="Date" type="date" name="date" variant="outlined" InputLabelProps={{ shrink: true }} value={eventData.date} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth size="small" label="Time" type="time" name="time" variant="outlined" InputLabelProps={{ shrink: true }} value={eventData.time} onChange={handleChange} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth size="small" label="Venue" name="venue" select variant="outlined" value={eventData.venue} onChange={handleChange}>
          <MenuItem value="Cafeteria">Cafeteria</MenuItem>
          <MenuItem value="Auditorium">Auditorium</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{my: 0}} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" >Speaker(s):</Typography>
      </Grid>
      <Grid item xs={12} className="flex items-center gap-2">
        <TextField fullWidth size="small" label="Keynote Speaker" name="keynoteSpeaker" variant="outlined" value={eventData.keynoteSpeaker} onChange={handleChange} />
        <IconButton color="black">
          <Add />
        </IconButton>
      </Grid>
      <Grid item xs={12} className="flex items-center gap-2">
        <TextField fullWidth size="small" label="Upload Image" type="file" name="keynoteImage" variant="outlined" InputLabelProps={{ shrink: true }} onChange={handleFileChange} />
      </Grid>
      <Grid item xs={12} className="flex items-center gap-2">
        <TextField fullWidth size="small" label="Invited Speaker" name="invitedSpeaker" variant="outlined" value={eventData.invitedSpeaker} onChange={handleChange} />
        <IconButton color="black">
          <Add />
        </IconButton>
      </Grid>
      <Grid item xs={12} className="flex items-center gap-2">
        <TextField fullWidth size="small" label="Upload Image" type="file" name="invitedImage" variant="outlined" InputLabelProps={{ shrink: true }} onChange={handleFileChange} />
      </Grid>
      <Grid item xs={12}>
        <Divider className="my-4" />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth size="small" label="Theme" name="theme" variant="outlined" value={eventData.theme} onChange={handleChange} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth size="small" label="Categories" name="category" select variant="outlined" value={eventData.category} onChange={handleChange}>
          <MenuItem value="Conference">Conference</MenuItem>
          <MenuItem value="Workshop">Workshop</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  );
}
