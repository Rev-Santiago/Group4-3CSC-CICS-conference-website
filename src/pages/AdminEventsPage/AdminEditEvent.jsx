import { useEffect, useState } from "react";
import axios from "axios";
import {
    Grid, TextField, MenuItem, Typography, 
    IconButton, Select, Button, Box, Autocomplete,
    Snackbar, Alert
} from "@mui/material";
import { Add } from "@mui/icons-material";

export default function AdminEditEvent() {
    const accountType = localStorage.getItem("accountType");
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [eventData, setEventData] = useState({
        title: "", date: "", startTime: "", endTime: "",
        venue: "", keynoteSpeaker: "", invitedSpeaker: "",
        theme: "", category: "", keynoteImage: null,
        invitedImage: null, zoomLink: ""
    });
    const [isPublished, setIsPublished] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
    
    // Fetch events and drafts
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const headers = { Authorization: `Bearer ${token}` };
    
            // Make parallel requests to both endpoints
            const [eventsRes, draftsRes] = await Promise.all([
                axios.get("http://localhost:5000/api/events", { headers }),
                axios.get("http://localhost:5000/api/drafts", { headers })
            ]);
    
            const published = eventsRes.data.events || [];
            const drafts = draftsRes.data.drafts || [];
    
            // Mark each event with its status
            const eventsWithStatus = published.map(e => ({ ...e, status: "Published" }));
            const draftsWithStatus = drafts.map(d => ({ ...d, status: "Draft" }));
    
            // Combine both arrays
            const combined = [...eventsWithStatus, ...draftsWithStatus];
            setEvents(combined);
            console.log("Combined events:", combined);
        } catch (err) {
            console.error("Error fetching events:", err);
            setNotification({
                open: true,
                message: `Error fetching events: ${err.message}`,
                severity: "error"
            });
        }
    };
    
    useEffect(() => {
        fetchEvents();
    }, []);

    const defaultCategories = ["Workshop", "Seminar", "Keynote"];
    const [customCategories, setCustomCategories] = useState([]);
    const categoryOptions = [...new Set([...defaultCategories, ...customCategories])];

    const defaultVenues = ["Cafeteria", "Auditorium"];
    const [customVenues, setCustomVenues] = useState([]);
    const venueOptions = [...new Set([...defaultVenues, ...customVenues])];

    const handleCategoryChange = (e, newValue) => {
        if (newValue && !defaultCategories.includes(newValue) && !customCategories.includes(newValue)) {
            setCustomCategories([...customCategories, newValue]);
        }
        setEventData({ ...eventData, category: newValue });
    };

    const handleVenueChange = (e, newValue) => {
        if (newValue && !defaultVenues.includes(newValue) && !customVenues.includes(newValue)) {
            setCustomVenues([...customVenues, newValue]);
        }
        setEventData({ ...eventData, venue: newValue });
    };

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setEventData(prev => ({ ...prev, [name]: files[0] }));
    };

    const convertTo24Hour = (time) => {
        if (!time) return "";
        const [h, mPart] = time.split(":");
        if (!mPart) return "";
        
        let hour = parseInt(h, 10);
        const [min, period] = mPart.split(" ");
        if (!period) return time; // Already in 24h format
        
        if (period === "PM" && hour < 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        return `${String(hour).padStart(2, "0")}:${min}`;
    };

    const handleEventSelection = (e) => {
        const id = e.target.value;
        setSelectedEventId(id);

        // Find the selected event
        const selected = events.find(event => event.id === parseInt(id) || event.id === id);
        
        if (selected) {
            console.log("Selected event:", selected);
            let startTime = "", endTime = "";
            
            // Parse time slot if available
            if (selected.time_slot && selected.time_slot.includes(" - ")) {
                const [start, end] = selected.time_slot.split(" - ");
                startTime = convertTo24Hour(start);
                endTime = convertTo24Hour(end);
            }

            // Parse speaker data
            let keynoteSpeaker = "", invitedSpeaker = "";
            if (selected.speaker) {
                const speakers = selected.speaker.split(",");
                keynoteSpeaker = speakers[0]?.trim() || "";
                invitedSpeaker = speakers[1]?.trim() || "";
            }

            setEventData({
                title: selected.program || "",
                date: selected.event_date ? selected.event_date.split("T")[0] : "",
                startTime,
                endTime,
                venue: selected.venue || "",
                keynoteSpeaker,
                invitedSpeaker,
                theme: selected.theme || "",
                category: selected.category || "",
                keynoteImage: null, // Cannot restore file objects
                invitedImage: null, // Cannot restore file objects
                zoomLink: selected.online_room_link || ""
            });
            
            setIsPublished(selected.status === "Published");
        }
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    // Save/update as draft
    const handleSave = async () => {
        try {
            const formData = new FormData();
            Object.entries(eventData).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const url = selectedEventId ? 
                `http://localhost:5000/api/drafts/${selectedEventId}` : 
                "http://localhost:5000/api/drafts";
                
            const method = selectedEventId ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method,
                body: formData,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save draft");

            setNotification({
                open: true,
                message: "📝 Draft saved successfully!",
                severity: "success"
            });
            
            // Refresh event list
            fetchEvents();
            
        } catch (err) {
            console.error("Error saving draft:", err);
            setNotification({
                open: true,
                message: `❌ Error: ${err.message}`,
                severity: "error"
            });
        }
    };

    // Publish final event
    const handlePublish = async () => {
        try {
            const formData = new FormData();
            Object.entries(eventData).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const url = isPublished && selectedEventId ? 
                `http://localhost:5000/api/events/${selectedEventId}` : 
                "http://localhost:5000/api/events";
                
            const method = isPublished && selectedEventId ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method,
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
            
            // Refresh event list
            fetchEvents();
            
        } catch (err) {
            console.error("Error publishing event:", err);
            setNotification({
                open: true,
                message: `❌ Error: ${err.message}`,
                severity: "error"
            });
        }
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <Box className="p-4">
            <Grid container spacing={3} className="mt-3">
                <Grid item xs={12}>
                    <Typography variant="subtitle1">Select an Existing Event</Typography>
                    
                    {/* Published Events Dropdown */}
                    <Typography variant="subtitle2">Published Events</Typography>
                    <Select
                        fullWidth size="small" value={selectedEventId}
                        onChange={handleEventSelection} displayEmpty sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>Select a published event</MenuItem>
                        {events.filter(event => event.status === "Published").length > 0 ? (
                            events.filter(event => event.status === "Published").map((event) => (
                                <MenuItem key={event.id} value={event.id}>
                                    {event.program || "Unnamed Event"} (Published)
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No published events found</MenuItem>
                        )}
                    </Select>

                    {/* Draft Events Dropdown */}
                    <Typography variant="subtitle2" sx={{ mt: 3 }}>Draft Events</Typography>
                    <Select
                        fullWidth size="small" value={selectedEventId}
                        onChange={handleEventSelection} displayEmpty sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>Select a draft event</MenuItem>
                        {events.filter(event => event.status === "Draft").length > 0 ? (
                            events.filter(event => event.status === "Draft").map((event) => (
                                <MenuItem key={event.id} value={event.id}>
                                    {event.program || "Unnamed Event"} (Draft)
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No draft events found</MenuItem>
                        )}
                    </Select>
                </Grid>

                <Grid item xs={12}>
                    <Grid item xs={12}><Typography variant="subtitle1">Event Details:</Typography></Grid>
                    <TextField fullWidth size="small" label="Title" name="title" variant="outlined" value={eventData.title} onChange={handleChange} sx={{ mt: 2 }} />
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
                            <TextField
                                {...params}
                                label="Venue"
                                size="small"
                                fullWidth
                            />
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
                    <TextField fullWidth size="small" label="Keynote Speaker" name="keynoteSpeaker" variant="outlined" value={eventData.keynoteSpeaker} onChange={handleChange} />
                    <IconButton><Add /></IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" component="label">
                        Upload Keynote Image
                        <input type="file" name="keynoteImage" hidden onChange={handleFileChange} />
                    </Button>
                    {eventData.keynoteImage && <Typography variant="body2">{eventData.keynoteImage.name}</Typography>}
                </Grid>

                <Grid item xs={12} className="flex items-center gap-2">
                    <TextField fullWidth size="small" label="Invited Speaker" name="invitedSpeaker" variant="outlined" value={eventData.invitedSpeaker} onChange={handleChange} />
                    <IconButton><Add /></IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" component="label">
                        Upload Invited Image
                        <input type="file" name="invitedImage" hidden onChange={handleFileChange} />
                    </Button>
                    {eventData.invitedImage && <Typography variant="body2">{eventData.invitedImage.name}</Typography>}
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1">Event Classification:</Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Theme" name="theme" variant="outlined" value={eventData.theme} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        freeSolo
                        options={categoryOptions}
                        value={eventData.category}
                        onChange={handleCategoryChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Category"
                                size="small"
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                {/* Save/Publish Buttons */}
                <Grid item xs={12} className="flex justify-end gap-2">
                    <Button variant="contained" color="warning" onClick={handleSave}>Save as Draft</Button>
                    {accountType === "super_admin" && (
                        <Button variant="contained" color="error" onClick={handlePublish}>Publish Event</Button>
                    )}
                </Grid>
            </Grid>

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