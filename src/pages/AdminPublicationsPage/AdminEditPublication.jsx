import { useEffect, useState } from "react";
import axios from "axios";
import {
    Grid, TextField, MenuItem, Typography, Divider,
    IconButton, Select, Button, Box, Autocomplete,
} from "@mui/material";

export default function AdminEditPublication() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [eventData, setEventData] = useState({
        title: "", date: "", startTime: "", endTime: "",
        venue: "", keynoteSpeaker: "", invitedSpeaker: "",
        theme: "", category: "", keynoteImage: null,
        invitedImage: null
    });
    const [isPublished, setIsPublished] = useState(false);

    // Fetch events and drafts
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Get token from local storage or session
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const [eventsRes, draftsRes] = await Promise.all([
                    axios.get("/api/events", { headers }),
                    axios.get("/api/drafts", { headers })
                ]);

                // Mark status for drafts and events
                const eventsWithStatus = eventsRes.data.events.map(e => ({ ...e, status: "Published" }));
                const draftsWithStatus = draftsRes.data.drafts.map(d => ({ ...d, status: "Draft" }));

                setEvents([...eventsWithStatus, ...draftsWithStatus]);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        fetchEvents();
    }, []);
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

            // Check if the selected event is a draft or published event
            if (selected.status === "Draft") {
                const draftSelected = events.find(draft => draft.id === id && draft.status === "Draft");

                if (draftSelected) {
                    setEventData({
                        title: draftSelected.program || "",
                        date: draftSelected.event_date ? draftSelected.event_date.split("T")[0] : "", // Format the date to YYYY-MM-DD
                        startTime: start ? convertTo24Hour(start) : "",
                        endTime: end ? convertTo24Hour(end) : "",
                        venue: draftSelected.venue || "",
                        keynoteSpeaker: draftSelected.speaker?.split(",")[0] || "",
                        invitedSpeaker: draftSelected.speaker?.split(",")[1] || "",
                        theme: draftSelected.theme || "",
                        category: draftSelected.category || "",
                        keynoteImage: draftSelected.keynoteImage ? draftSelected.keynoteImage : null,  // Optional: You can show a preview of the image here
                        invitedImage: draftSelected.invitedImage ? draftSelected.invitedImage : null  // Same here for the invitedImage
                    });
                }
            } else {
                setEventData({
                    title: selected.program || "",
                    date: selected.event_date ? selected.event_date.split("T")[0] : "", // Format the date to YYYY-MM-DD
                    startTime: start ? convertTo24Hour(start) : "",
                    endTime: end ? convertTo24Hour(end) : "",
                    venue: selected.venue || "",
                    keynoteSpeaker: selected.speaker?.split(",")[0] || "",
                    invitedSpeaker: selected.speaker?.split(",")[1] || "",
                    theme: selected.theme || "",
                    category: selected.category || "",
                    keynoteImage: selected.keynoteImage ? selected.keynoteImage : null,  // Optional: You can show a preview of the image here
                    invitedImage: selected.invitedImage ? selected.invitedImage : null  // Same here for the invitedImage
                });
            }
            setIsPublished(selected.status === "Published");
        }
    };

    // Save/update as draft
    const handleSave = async () => {
        try {
            const formData = new FormData();
            for (const key in eventData) {
                if (eventData[key]) formData.append(key, eventData[key]);
            }

            // Include the event ID if we're editing an existing event
            if (selectedEventId) formData.append("id", selectedEventId);
            await axios.post("/api/events/draft", formData);
            alert("Event saved as draft.");
        } catch (err) {
            console.error("Error saving draft:", err);
            alert("Failed to save.");
        }
    };

    // Publish final event
    const handlePublish = async () => {
        try {
            const formData = new FormData();
            for (const key in eventData) {
                if (eventData[key]) formData.append(key, eventData[key]);
            }

            // Include the event ID if we're editing an existing event
            if (selectedEventId) formData.append("id", selectedEventId);
            await axios.post("/api/events", formData); // publish route
            alert("Event published!");
        } catch (err) {
            console.error("Error publishing event:", err);
            alert("Publish failed.");
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
                                    {event.program} ({event.status})  {/* Replace 'program' with the correct field name */}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No events found</MenuItem>
                        )}
                    </Select>
                </Grid>

                <Grid item xs={12}>
                    <Grid item xs={12}><Typography variant="subtitle1">Event Details:</Typography></Grid>
                    <TextField fullWidth size="small" label="Title" name="title" variant="outlined" onChange={handleChange} sx={{ mt: 2 }} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Date" type="date" name="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Insert Link" name="Link" onChange={handleChange} />
                </Grid>

                {/* Save/Publish Buttons */}
                <Grid item xs={12} className="flex gap-2 mt-2 justify-center sm:justify-end">
                    <Button onClick={handleSave} variant="outlined" color="primary">Save Draft</Button>
                    <Button onClick={handlePublish} variant="contained" sx={{ backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#B7152F" }, }}>Publish</Button>
                    {selectedEventId && (
                        <Typography sx={{ ml: 3, mt: 1 }} variant="body2" color={isPublished ? "green" : "orange"}>
                            Status: {isPublished ? "Published" : "Draft"}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
