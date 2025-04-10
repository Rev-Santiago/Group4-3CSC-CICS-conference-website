import { useEffect, useState } from "react";
import axios from "axios";
import {
    Grid, TextField, MenuItem, Typography, Divider,
    IconButton, Select, Button, Box, Autocomplete,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

export default function AdminEditEvent() {
    const accountType = localStorage.getItem("accountType");
    const [drafts, setDrafts] = useState([]);
    const [selectedDraftId, setSelectedDraftId] = useState("");
    const [eventData, setEventData] = useState({
        title: "", date: "", startTime: "", endTime: "",
        venue: "", keynoteSpeaker: "", invitedSpeaker: "",
        theme: "", category: "", keynoteImage: null,
        invitedImage: null, zoomLink: ""
    });
    
    // Fetch only drafts
    const fetchDrafts = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;
            
            const headers = { Authorization: `Bearer ${token}` };
            
            const response = await axios.get("/api/drafts", { headers });
            const draftsData = Array.isArray(response.data?.drafts) ? response.data.drafts : [];
            
            console.log("Drafts Response:", draftsData);  // Debug log
            setDrafts(draftsData);

        } catch (err) {
            console.error("Error fetching drafts:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchDrafts();
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

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setEventData((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleDraftSelection = (e) => {
        const id = e.target.value;
        setSelectedDraftId(id);

        // Find the selected draft based on the id
        const selected = drafts.find(draft => draft.id === id);

        if (selected) {
            const [start, end] = (selected.time_slot || "").split(" - ");

            // Populate fields based on the selected draft
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
                invitedImage: null,
                zoomLink: selected.online_room_link || ""
            });
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
            formData.append("zoomLink", eventData.zoomLink || "");
            
            if (eventData.keynoteImage instanceof File) {
                formData.append("keynoteImage", eventData.keynoteImage);
            }
            
            if (eventData.invitedImage instanceof File) {
                formData.append("invitedImage", eventData.invitedImage);
            }

            let response;
            // If editing an existing draft
            if (selectedDraftId) {
                response = await axios.put(`/api/drafts/${selectedDraftId}`, formData, { headers });
            } else {
                // Creating a new draft
                response = await axios.post("/api/drafts", formData, { headers });
            }
            
            alert("Event saved as draft.");
            fetchDrafts(); // Refresh the drafts list
            
            // Clear form if creating a new draft
            if (!selectedDraftId) {
                setEventData({
                    title: "", date: "", startTime: "", endTime: "",
                    venue: "", keynoteSpeaker: "", invitedSpeaker: "",
                    theme: "", category: "", keynoteImage: null,
                    invitedImage: null, zoomLink: ""
                });
            }
        } catch (err) {
            console.error("Error saving draft:", err.response?.data || err.message);
            alert("Failed to save draft.");
        }
    };

    // Delete a draft
    const handleDelete = async () => {
        if (!selectedDraftId) {
            alert("Please select a draft to delete.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this draft?")) {
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;
            
            const headers = { Authorization: `Bearer ${token}` };
            
            await axios.delete(`/api/drafts/${selectedDraftId}`, { headers });
            
            alert("Draft deleted successfully.");
            fetchDrafts(); // Refresh the drafts list
            
            // Clear the form
            setSelectedDraftId("");
            setEventData({
                title: "", date: "", startTime: "", endTime: "",
                venue: "", keynoteSpeaker: "", invitedSpeaker: "",
                theme: "", category: "", keynoteImage: null,
                invitedImage: null, zoomLink: ""
            });
        } catch (err) {
            console.error("Error deleting draft:", err.response?.data || err.message);
            alert("Failed to delete draft.");
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
            formData.append("zoomLink", eventData.zoomLink || "");
            
            if (eventData.keynoteImage instanceof File) {
                formData.append("keynoteImage", eventData.keynoteImage);
            }
            
            if (eventData.invitedImage instanceof File) {
                formData.append("invitedImage", eventData.invitedImage);
            }

            // Always create a new published event
            const response = await axios.post("/api/events", formData, { headers });
            
            alert("Event published successfully!");
            
            // Delete the draft after publishing (as it's no longer a draft)
            if (selectedDraftId) {
                await axios.delete(`/api/drafts/${selectedDraftId}`, { headers });
            }
            
            // Refresh and reset
            fetchDrafts();
            setSelectedDraftId("");
            setEventData({
                title: "", date: "", startTime: "", endTime: "",
                venue: "", keynoteSpeaker: "", invitedSpeaker: "",
                theme: "", category: "", keynoteImage: null,
                invitedImage: null, zoomLink: ""
            });
            
        } catch (err) {
            console.error("Error publishing event:", err.response?.data || err.message);
            alert("Failed to publish event: " + (err.response?.data?.error || err.message));
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
                    <Typography variant="subtitle1">Select an Existing Draft</Typography>
                    <Select
                        fullWidth size="small" value={selectedDraftId}
                        onChange={handleDraftSelection} displayEmpty sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>Select a draft</MenuItem>
                        {drafts.length > 0 ? (
                            drafts.map((draft) => (
                                <MenuItem key={draft.id} value={draft.id}>
                                    {draft.program || "Untitled Draft"}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No drafts found</MenuItem>
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
                        options={options}
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
                    <TextField fullWidth size="small" label="Zoom Link (Optional)" name="zoomLink" variant="outlined" value={eventData.zoomLink || ""} onChange={handleChange} />
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
                        options={categoryOptions}
                        value={eventData.category}
                        onChange={handleCategoryChange}
                        inputValue={eventData.category}
                        onInputChange={(e, newValue) => {
                            setEventData(prev => ({ ...prev, category: newValue }));
                        }}
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

                {/* Save/Publish/Delete Buttons */}
                <Grid item xs={12} className="flex gap-2 mt-2 justify-center sm:justify-end">
                    <Button onClick={handleSave} variant="outlined" color="primary">Save Draft</Button>
                    
                    {accountType === "super_admin" && (
                        <>
                            <Button 
                                onClick={handlePublish} 
                                variant="contained" 
                                sx={{ 
                                    backgroundColor: "#B7152F", 
                                    color: "white", 
                                    "&:hover": { backgroundColor: "#B7152F" }, 
                                }}
                            >
                                Publish
                            </Button>
                            {selectedDraftId && (
                                <Button 
                                    onClick={handleDelete} 
                                    variant="outlined" 
                                    color="error"
                                    startIcon={<Delete />}
                                >
                                    Delete
                                </Button>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}