// src/pages/AdminEventsPage/AdminAddEvent.jsx
import { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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
    Alert,
    Snackbar,
    Autocomplete,
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
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

    const [customCategories, setCustomCategories] = useState([]);
    const defaultCategories = ["Workshop", "Seminar", "Keynote"];
    const categoryOptions = [...new Set([...defaultCategories, ...customCategories])];

    const handleCategoryChange = (e, newValue) => {
        if (newValue && !defaultCategories.includes(newValue) && !customCategories.includes(newValue)) {
            setCustomCategories([...customCategories, newValue]);
        }
        setEventData({ ...eventData, category: newValue });
    };

    const [customVenues, setCustomVenues] = useState([]);
    const defaultVenues = ["Cafeteria", "Auditorium"];
    const venueOptions = [...new Set([...defaultVenues, ...customVenues])];

    const handleVenueChange = (e, newValue) => {
        if (newValue && !defaultVenues.includes(newValue) && !customVenues.includes(newValue)) {
            setCustomVenues([...customVenues, newValue]);
        }
        setEventData({ ...eventData, venue: newValue });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setEventData((prev) => ({ ...prev, [name]: files[0] }));
    };

    const resetForm = () => {
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
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const handleSaveDraft = async () => {
        const formData = new FormData();
        
        // Log values before appending them
        console.log("Event Data: ", eventData);
        
        Object.entries(eventData).forEach(([key, value]) => {
            if (value) {
                formData.append(key, value);
            }
        });
    
        // Check if the fields are properly appended
        console.log("Form Data keys: ", [...formData.keys()]);
    
        try {
            const res = await fetch(`${BACKEND_URL}/api/drafts`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
            });
    
            // Check if response is HTML (a sign of error page)
            if (res.headers.get("content-type")?.includes("text/html")) {
                throw new Error("Received HTML, which might be an error page.");
            }
    
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save draft");
    
            setNotification({
                open: true,
                message: "📝 Draft saved successfully!",
                severity: "success"
            });
        } catch (err) {
            console.error(err);
            setNotification({
                open: true,
                message: `❌ Error: ${err.message || "Failed to save draft"}`,
                severity: "error"
            });
        }
    };
    
    
    const handlePublish = async () => {
        const formData = new FormData();
        Object.entries(eventData).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
    
        try {
            const res = await fetch(`${BACKEND_URL}/api/events`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
            });
    
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to publish event");
    
            setNotification({
                open: true,
                message: "✅ Event published successfully!",
                severity: "success"
            });
    
            resetForm();
        } catch (err) {
            console.error(err);
            setNotification({
                open: true,
                message: `❌ Error: ${err.message || "Failed to publish event"}`,
                severity: "error"
            });
        }
    };

    const accountType = localStorage.getItem("accountType");
    const handleOpenDetails = () => setDetailsOpen(true);
    const handleCloseDetails = () => setDetailsOpen(false);
    const handleCloseNotification = () => setNotification(prev => ({ ...prev, open: false }));

    return (
        <Box className="p-4">
            <Grid item xs={12}>
                <Typography variant="subtitle1">Event Details:</Typography>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Title" name="title" value={eventData.title} onChange={handleChange} sx={{ mt: 2 }}/>
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
                    <Autocomplete
                        freeSolo
                        options={venueOptions}
                        value={eventData.venue}
                        onChange={handleVenueChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Venue" size="small" fullWidth />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Zoom Link" name="zoomLink" value={eventData.zoomLink} onChange={handleChange} />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1">Speaker(s):</Typography>
                </Grid>

                <Grid item xs={12} className="flex items-center gap-2">
                    <TextField fullWidth size="small" label="Keynote Speaker" name="keynoteSpeaker" value={eventData.keynoteSpeaker} onChange={handleChange} />
                    <IconButton color="black">
                        <Add />
                    </IconButton>
                </Grid>

                <Grid item xs={12}>
                    <Button variant="outlined" component="label">
                        Upload Keynote Image
                        <input type="file" name="keynoteImage" hidden onChange={handleFileChange} />
                    </Button>
                    {eventData.keynoteImage && <Typography>{eventData.keynoteImage.name}</Typography>}
                </Grid>

                <Grid item xs={12} className="flex items-center gap-2">
                    <TextField fullWidth size="small" label="Invited Speaker" name="invitedSpeaker" value={eventData.invitedSpeaker} onChange={handleChange} />
                    <IconButton color="black">
                        <Add />
                    </IconButton>
                </Grid>

                <Grid item xs={12}>
                    <Button variant="outlined" component="label">
                        Upload Invited Image
                        <input type="file" name="invitedImage" hidden onChange={handleFileChange} />
                    </Button>
                    {eventData.invitedImage && <Typography>{eventData.invitedImage.name}</Typography>}
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1">Event Classification:</Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Theme" name="theme" value={eventData.theme} onChange={handleChange} />
                </Grid>

                <Grid item xs={12}>
                    <Autocomplete
                        freeSolo
                        options={categoryOptions}
                        value={eventData.category}
                        onChange={handleCategoryChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Category" size="small" fullWidth />
                        )}
                    />
                </Grid>

                <Grid item xs={12} className="flex gap-2 mt-2 justify-center sm:justify-end">
                    <Button variant="outlined" onClick={handleOpenDetails}>See All Details</Button>
                    <Button variant="contained" color="warning" onClick={handleSaveDraft}>Save</Button>
                    {currentUser?.account_type === "super_admin" && (
                        <Button variant="contained" color="error" onClick={handlePublish}>Publish</Button>
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

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}