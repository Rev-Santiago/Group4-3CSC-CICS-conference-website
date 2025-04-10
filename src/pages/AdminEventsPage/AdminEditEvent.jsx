import { useEffect, useState } from "react";
import axios from "axios";
import {
    Grid, TextField, MenuItem, Typography, Divider,
    IconButton, Select, Button, Box, Autocomplete,
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
        invitedImage: null
    });
    const [isPublished, setIsPublished] = useState(false);
    const [userType, setUserType] = useState(""); // This should come from the auth context or API
    
    // Fetch events and drafts
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;
            
            const headers = { Authorization: `Bearer ${token}` };
            
            const [eventsRes, draftsRes] = await Promise.all([
                axios.get("/api/events", { headers }),
                axios.get("/api/drafts", { headers })
            ]);

            // Check if the response data contains the expected arrays
            const events = Array.isArray(eventsRes.data?.events) ? eventsRes.data.events : [];
            const drafts = Array.isArray(draftsRes.data?.drafts) ? draftsRes.data.drafts : [];

            console.log("Events Response:", events);  // Debug log
            console.log("Drafts Response:", drafts);  // Debug log

            const eventsWithStatus = events.map((e) => ({ ...e, status: "Published" }));
            const draftsWithStatus = drafts.map((d) => ({ ...d, status: "Draft" }));
            
            const combined = [...eventsWithStatus, ...draftsWithStatus];

            // Optional: Sort published first
            const sorted = combined.sort((a, b) => {
              if (a.status === "Published" && b.status !== "Published") return -1;
              if (b.status === "Published" && a.status !== "Published") return 1;
              return 0;
            });
            
            setEvents(sorted);

        } catch (err) {
            console.error("Error fetching events or drafts:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);
    
    const defaultCategories = ["Workshop", "Seminar", "Keynote"];
    const [customCategories, setCustomCategories] = useState([]);
    const categoryOptions = [...new Set([...defaultCategories, ...customCategories])];

    const handleCategoryChange = (e, newValue) => {
        if (newValue && !defaultCategories.includes(newValue) && !customCategories.includes(newValue)) {
            setCustomCategories([...customCategories, newValue]);
        }
        setEventData({ ...eventData, category: newValue });
    };

    const defaultVenues = ["Cafeteria", "Auditorium"];
    const [customVenues, setCustomVenues] = useState([]);
    const options = [...new Set([...defaultVenues, ...customVenues])];

    const handleVenueChange = (e, newValue) => {
        if (newValue && !defaultVenues.includes(newValue) && !customVenues.includes(newValue)) {
            setCustomVenues([...customVenues, newValue]);
        }
        setEventData({ ...eventData, venue: newValue });
    };

    useEffect(() => {
        console.log(events);  // Add this to verify that events are being fetched and set correctly.
    }, [events]);

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setEventData((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleEventSelection = (e) => {
        const id = e.target.value;
        setSelectedEventId(id);

        // Find the selected event based on the id
        const selected = events.find(event => event.id === id);

        if (selected) {
            const [start, end] = (selected.time_slot || "").split(" - ");

            // Populate fields based on the selected event (whether draft or published)
            setEventData({
                title: selected.program || "",
                date: selected.event_date ? selected.event_date.split("T")[0] : "",
                startTime: start ? convertTo24Hour(start) : "",
                endTime: end ? convertTo24Hour(end) : "",
                venue: selected.venue || "",
                keynoteSpeaker: selected.speaker?.split(",")[0]?.trim() || "",
                invitedSpeaker: selected.speaker?.split(",")[1]?.trim() || "",
                theme: selected.theme || "",
                category: selected.category || "",
                keynoteImage: selected.photo_url || null,
                invitedImage: null
            });
            
            setIsPublished(selected.status === "Published");
        }
    };

    // Save/update as draft
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;
            
            const headers = { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            };

            const formData = new FormData();
            formData.append("title", eventData.title);
            formData.append("date", eventData.date);
            formData.append("startTime", eventData.startTime);
            formData.append("endTime", eventData.endTime);
            formData.append("venue", eventData.venue);
            formData.append("keynoteSpeaker", eventData.keynoteSpeaker);
            formData.append("invitedSpeaker", eventData.invitedSpeaker);
            formData.append("theme", eventData.theme);
            formData.append("category", eventData.category);
            
            if (eventData.keynoteImage instanceof File) {
                formData.append("keynoteImage", eventData.keynoteImage);
            }
            
            if (eventData.invitedImage instanceof File) {
                formData.append("invitedImage", eventData.invitedImage);
            }

            let response;
            // If editing an existing draft
            if (selectedEventId && !isPublished) {
                response = await axios.put(`/api/drafts/${selectedEventId}`, formData, { headers });
            } else {
                // Creating a new draft
                response = await axios.post("/api/drafts", formData, { headers });
            }
            
            alert("Event saved as draft.");
            fetchEvents(); // Refresh the events list
        } catch (err) {
            console.error("Error saving draft:", err.response?.data || err.message);
            alert("Failed to save draft.");
        }
    };

    // Publish final event
    const handlePublish = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;
            
            const headers = { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            };

            const formData = new FormData();
            formData.append("title", eventData.title);
            formData.append("date", eventData.date);
            formData.append("startTime", eventData.startTime);
            formData.append("endTime", eventData.endTime);
            formData.append("venue", eventData.venue);
            formData.append("keynoteSpeaker", eventData.keynoteSpeaker);
            formData.append("invitedSpeaker", eventData.invitedSpeaker);
            formData.append("theme", eventData.theme);
            formData.append("category", eventData.category);
            
            if (eventData.keynoteImage instanceof File) {
                formData.append("keynoteImage", eventData.keynoteImage);
            }
            
            if (eventData.invitedImage instanceof File) {
                formData.append("invitedImage", eventData.invitedImage);
            }

            let response;
            // If editing an existing published event
            if (selectedEventId && isPublished) {
                response = await axios.put(`/api/events/${selectedEventId}`, formData, { headers });
            } else {
                // Creating a new published event
                response = await axios.post("/api/events", formData, { headers });
            }
            
            alert("Event published successfully!");
            fetchEvents(); // Refresh the events list
        } catch (err) {
            console.error("Error publishing event:", err.response?.data || err.message);
            alert("Failed to publish event.");
        }
    };

    // Helper to convert AM/PM time string to 24h format
    const convertTo24Hour = (time) => {
        if (!time) return "";
        const [h, mPart] = time.split(":");
        let hour = parseInt(h, 10);
        const [min, period] = mPart.split(" ");
        if (period === "PM" && hour < 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        return `${String(hour).padStart(2, "0")}:${min}`;
    };

    return (
        <Box className="p-4">
            <Grid container spacing={3} className="mt-3">
                <Grid item xs={12}>
                    <Typography variant="subtitle1">Select an Existing Event</Typography>
                    <Select
                        fullWidth size="small" value={selectedEventId}
                        onChange={handleEventSelection} displayEmpty sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>Select an event</MenuItem>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <MenuItem key={event.id} value={event.id}>
                                    {event.program} ({event.status})
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No events found</MenuItem>
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
                        options={options} // from [...new Set([...defaultVenues, ...customVenues])]
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
                    <Typography variant="subtitle1">Speaker(s):</Typography>
                </Grid>

                <Grid item xs={12} className="flex items-center gap-2">
                    <TextField fullWidth size="small" label="Keynote Speaker" name="keynoteSpeaker" variant="outlined" value={eventData.keynoteSpeaker} onChange={handleChange} />
                    <IconButton><Add /></IconButton>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Upload Keynote Image" type="file" name="keynoteImage" onChange={handleFileChange} InputLabelProps={{ shrink: true }} />
                    {eventData.keynoteImage && typeof eventData.keynoteImage === 'string' && (
                        <Typography variant="body2">Current image: {eventData.keynoteImage}</Typography>
                    )}
                    {eventData.keynoteImage instanceof File && (
                        <Typography variant="body2">New image: {eventData.keynoteImage.name}</Typography>
                    )}
                </Grid>

                <Grid item xs={12} className="flex items-center gap-2">
                    <TextField fullWidth size="small" label="Invited Speaker" name="invitedSpeaker" variant="outlined" value={eventData.invitedSpeaker} onChange={handleChange} />
                    <IconButton><Add /></IconButton>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Upload Invited Image" type="file" name="invitedImage" onChange={handleFileChange} InputLabelProps={{ shrink: true }} />
                    {eventData.invitedImage && typeof eventData.invitedImage === 'string' && (
                        <Typography variant="body2">Current image: {eventData.invitedImage}</Typography>
                    )}
                    {eventData.invitedImage instanceof File && (
                        <Typography variant="body2">New image: {eventData.invitedImage.name}</Typography>
                    )}
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
                        options={categoryOptions} // from [...new Set([...defaultCategories, ...customCategories])]
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
                {accountType === "super_admin" && (
                    <Grid item xs={12} className="flex gap-2 mt-2 justify-center sm:justify-end">
                        <Button onClick={handleSave} variant="outlined" color="primary">Save Draft</Button>
                        <Button onClick={handlePublish} variant="contained" sx={{ backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#B7152F" }, }}>Publish</Button>
                        {selectedEventId && (
                            <Typography sx={{ ml: 3, mt: 1 }} variant="body2" color={isPublished ? "green" : "orange"}>
                                Status: {isPublished ? "Published" : "Draft"}
                            </Typography>
                        )}
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}