import { useEffect, useState } from "react";
import axios from "axios";
import {
    Grid, TextField, MenuItem, Typography, Divider,
    IconButton, Select, Button, Box, Autocomplete, Snackbar, Alert,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

export default function AdminEditEvent() {
    const accountType = localStorage.getItem("accountType");
    const [drafts, setDrafts] = useState([]);
    const [selectedDraftId, setSelectedDraftId] = useState("");
    const [eventData, setEventData] = useState({
        title: "", 
        date: "", 
        startTime: "", 
        endTime: "",
        venue: "", 
        keynoteSpeakers: [{ name: "" }],
        invitedSpeakers: [{ name: "" }],
        theme: "", 
        category: "", 
        zoomLink: ""
    });
    const [notification, setNotification] = useState({ 
        open: false, 
        message: "", 
        severity: "success" 
    });
    
    // Fetch only drafts
    const fetchDrafts = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("No auth token found");
                return;
            }
            
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
    
    const defaultCategories = ["Workshop", "Seminar", "Keynote", "Conference"];
    const [customCategories, setCustomCategories] = useState([]);
    const categoryOptions = [...new Set([...defaultCategories, ...customCategories])];

    const handleCategoryChange = (e, newValue) => {
        if (newValue && !defaultCategories.includes(newValue) && !customCategories.includes(newValue)) {
            setCustomCategories([...customCategories, newValue]);
        }
        setEventData({ ...eventData, category: newValue || "" }); // Ensure empty string fallback
    };

    const defaultVenues = ["Cafeteria", "Auditorium"];
    const [customVenues, setCustomVenues] = useState([]);
    const options = [...new Set([...defaultVenues, ...customVenues])];

    const handleVenueChange = (e, newValue) => {
        if (newValue && !defaultVenues.includes(newValue) && !customVenues.includes(newValue)) {
            setCustomVenues([...customVenues, newValue]);
        }
        setEventData({ ...eventData, venue: newValue || "" }); // Ensure empty string fallback
    };

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle keynote speaker name change
    const handleKeynoteSpeakerChange = (index, value) => {
        const updatedSpeakers = [...eventData.keynoteSpeakers];
        updatedSpeakers[index] = { ...updatedSpeakers[index], name: value };
        setEventData({ ...eventData, keynoteSpeakers: updatedSpeakers });
    };

    // Handle invited speaker name change
    const handleInvitedSpeakerChange = (index, value) => {
        const updatedSpeakers = [...eventData.invitedSpeakers];
        updatedSpeakers[index] = { ...updatedSpeakers[index], name: value };
        setEventData({ ...eventData, invitedSpeakers: updatedSpeakers });
    };

    // Handle adding keynote speaker
    const handleAddKeynoteSpeaker = () => {
        setEventData({
            ...eventData,
            keynoteSpeakers: [...eventData.keynoteSpeakers, { name: "" }]
        });
    };

    // Handle adding invited speaker
    const handleAddInvitedSpeaker = () => {
        setEventData({
            ...eventData,
            invitedSpeakers: [...eventData.invitedSpeakers, { name: "" }]
        });
    };

    // Handle removing keynote speaker
    const handleRemoveKeynoteSpeaker = (index) => {
        if (eventData.keynoteSpeakers.length > 1) {
            const updatedSpeakers = eventData.keynoteSpeakers.filter((_, i) => i !== index);
            setEventData({ ...eventData, keynoteSpeakers: updatedSpeakers });
        }
    };

    // Handle removing invited speaker
    const handleRemoveInvitedSpeaker = (index) => {
        if (eventData.invitedSpeakers.length > 1) {
            const updatedSpeakers = eventData.invitedSpeakers.filter((_, i) => i !== index);
            setEventData({ ...eventData, invitedSpeakers: updatedSpeakers });
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    const handleDraftSelection = (e) => {
        const id = e.target.value;
        setSelectedDraftId(id);

        // Find the selected draft based on the id
        const selected = drafts.find(draft => draft.id === id);

        if (selected) {
            const [start, end] = (selected.time_slot || "").split(" - ");

            // Parse speaker data if available
            let keynoteSpeakers = [{ name: "" }];
            let invitedSpeakers = [{ name: "" }];

            if (selected.speaker) {
                const speakers = selected.speaker.split(',').map(s => s.trim());
                
                if (speakers.length > 0) {
                    keynoteSpeakers = speakers
                        .filter((_, i) => i === 0 || i % 2 === 0)
                        .map(name => ({ name }));
                    
                    invitedSpeakers = speakers
                        .filter((_, i) => i % 2 === 1)
                        .map(name => ({ name }));
                }
                
                // Ensure at least one empty speaker in each array
                if (keynoteSpeakers.length === 0) {
                    keynoteSpeakers = [{ name: "" }];
                }
                if (invitedSpeakers.length === 0) {
                    invitedSpeakers = [{ name: "" }];
                }
            }

            // Populate fields based on the selected draft
            setEventData({
                title: selected.program || "",
                date: selected.event_date ? selected.event_date.split("T")[0] : "",
                startTime: start ? convertTo24Hour(start) : "",
                endTime: end ? convertTo24Hour(end) : "",
                venue: selected.venue || "",
                keynoteSpeakers,
                invitedSpeakers,
                theme: selected.theme || "",
                category: selected.category || "",
                zoomLink: selected.online_room_link || ""
            });
        }
    };

    // Save/update as draft
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setNotification({
                    open: true,
                    message: "Authentication error: No token found",
                    severity: "error"
                });
                return;
            }
            
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
            formData.append("theme", eventData.theme);
            formData.append("category", eventData.category);
            formData.append("zoomLink", eventData.zoomLink || "");
            
            // Modified speaker handling - combine into single strings like in AdminAddEvent
            // Combine all keynote speakers into a single string
            const keynoteSpeaker = eventData.keynoteSpeakers.map(s => s.name).filter(Boolean).join(", ");
            formData.append("keynoteSpeaker", keynoteSpeaker);
            
            // Combine all invited speakers into a single string
            const invitedSpeaker = eventData.invitedSpeakers.map(s => s.name).filter(Boolean).join(", ");
            formData.append("invitedSpeaker", invitedSpeaker);

            let response;
            // If editing an existing draft
            if (selectedDraftId) {
                response = await axios.put(`/api/drafts/${selectedDraftId}`, formData, { headers });
            } else {
                // Creating a new draft
                response = await axios.post("/api/drafts", formData, { headers });
            }
            
            setNotification({
                open: true,
                message: "Event saved as draft successfully!",
                severity: "success"
            });
            
            fetchDrafts(); // Refresh the drafts list
            
            // Clear form if creating a new draft
            if (!selectedDraftId) {
                setEventData({
                    title: "", 
                    date: "", 
                    startTime: "", 
                    endTime: "",
                    venue: "", 
                    keynoteSpeakers: [{ name: "" }],
                    invitedSpeakers: [{ name: "" }],
                    theme: "", 
                    category: "", 
                    zoomLink: ""
                });
            }
        } catch (err) {
            console.error("Error saving draft:", err.response?.data || err.message);
            setNotification({
                open: true,
                message: `Failed to save draft: ${err.response?.data?.error || err.message}`,
                severity: "error"
            });
        }
    };

    // Delete a draft
    const handleDelete = async () => {
        if (!selectedDraftId) {
            setNotification({
                open: true,
                message: "Please select a draft to delete",
                severity: "warning"
            });
            return;
        }

        if (!window.confirm("Are you sure you want to delete this draft?")) {
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setNotification({
                    open: true,
                    message: "Authentication error: No token found",
                    severity: "error"
                });
                return;
            }
            
            const headers = { Authorization: `Bearer ${token}` };
            
            await axios.delete(`/api/drafts/${selectedDraftId}`, { headers });
            
            setNotification({
                open: true,
                message: "Draft deleted successfully!",
                severity: "success"
            });
            
            fetchDrafts(); // Refresh the drafts list
            
            // Clear the form
            setSelectedDraftId("");
            setEventData({
                title: "", 
                date: "", 
                startTime: "", 
                endTime: "",
                venue: "", 
                keynoteSpeakers: [{ name: "" }],
                invitedSpeakers: [{ name: "" }],
                theme: "", 
                category: "", 
                zoomLink: ""
            });
        } catch (err) {
            console.error("Error deleting draft:", err.response?.data || err.message);
            setNotification({
                open: true,
                message: `Failed to delete draft: ${err.response?.data?.error || err.message}`,
                severity: "error"
            });
        }
    };

    // Publish final event
    const handlePublish = async () => {
        try {
            // Validate form data
            if (!eventData.title || eventData.title.trim() === "") {
                setNotification({
                    open: true,
                    message: "Event title is required",
                    severity: "warning"
                });
                return;
            }
            
            // Ensure we have a valid date - if not, use current date
            const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const useDate = eventData.date && eventData.date.trim() !== "" 
                ? eventData.date 
                : currentDate;
                
            const token = localStorage.getItem("authToken");
            if (!token) {
                setNotification({
                    open: true,
                    message: "Authentication error: No token found",
                    severity: "error"
                });
                return;
            }
            
            console.log("Publishing with token:", token.substring(0, 10) + "..."); // Log partial token for debugging
            console.log("Using date:", useDate); // Log the date being used
            
            const headers = { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            };
    
            const formData = new FormData();
            formData.append("title", eventData.title || "Untitled Event");
            formData.append("date", useDate);
            formData.append("startTime", eventData.startTime || "");
            formData.append("endTime", eventData.endTime || "");
            formData.append("venue", eventData.venue || "");
            formData.append("theme", eventData.theme || "");
            formData.append("category", eventData.category || "");
            formData.append("zoomLink", eventData.zoomLink || "");
            
            // Modified speaker handling - combine into single strings like in AdminAddEvent
            // Combine all keynote speakers into a single string
            const keynoteSpeaker = eventData.keynoteSpeakers.map(s => s.name).filter(Boolean).join(", ");
            formData.append("keynoteSpeaker", keynoteSpeaker);
            
            // Combine all invited speakers into a single string
            const invitedSpeaker = eventData.invitedSpeakers.map(s => s.name).filter(Boolean).join(", ");
            formData.append("invitedSpeaker", invitedSpeaker);
    
            // Verify token before publishing
            const verifyResponse = await axios.get("/api/verify-token", { headers });
            console.log("Token verification:", verifyResponse.data);
            
            // Always create a new published event
            const response = await axios.post("/api/events", formData, { headers });
            
            setNotification({
                open: true,
                message: "Event published successfully!",
                severity: "success"
            });
            
            // Delete the draft after publishing (as it's no longer a draft)
            if (selectedDraftId) {
                await axios.delete(`/api/drafts/${selectedDraftId}`, { headers });
            }
            
            // Refresh and reset
            fetchDrafts();
            setSelectedDraftId("");
            setEventData({
                title: "", 
                date: "", 
                startTime: "", 
                endTime: "",
                venue: "", 
                keynoteSpeakers: [{ name: "" }],
                invitedSpeakers: [{ name: "" }],
                theme: "", 
                category: "", 
                zoomLink: ""
            });
            
        } catch (err) {
            console.error("Error publishing event:", err);
            setNotification({
                open: true,
                message: `Failed to publish event: ${err.response?.data?.error || err.message}`,
                severity: "error"
            });
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
                    <Typography variant="subtitle1">Keynote Speaker(s):</Typography>
                </Grid>

                {eventData.keynoteSpeakers.map((speaker, index) => (
                    <Grid container item xs={12} key={`keynote-${index}`} spacing={2}>
                        <Grid item xs={10}>
                            <TextField 
                                fullWidth 
                                size="small" 
                                label={`Keynote Speaker ${index + 1}`} 
                                variant="outlined" 
                                value={speaker.name} 
                                onChange={(e) => handleKeynoteSpeakerChange(index, e.target.value)} 
                            />
                        </Grid>
                        <Grid item xs={2} className="flex items-center">
                            <IconButton 
                                color="primary" 
                                onClick={handleAddKeynoteSpeaker}
                                title="Add another keynote speaker"
                            >
                                <Add />
                            </IconButton>
                            {eventData.keynoteSpeakers.length > 1 && (
                                <IconButton 
                                    color="error" 
                                    onClick={() => handleRemoveKeynoteSpeaker(index)}
                                    title="Remove this keynote speaker"
                                >
                                    <Delete />
                                </IconButton>
                            )}
                        </Grid>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Typography variant="subtitle1">Invited Speaker(s):</Typography>
                </Grid>

                {eventData.invitedSpeakers.map((speaker, index) => (
                    <Grid container item xs={12} key={`invited-${index}`} spacing={2}>
                        <Grid item xs={10}>
                            <TextField 
                                fullWidth 
                                size="small" 
                                label={`Invited Speaker ${index + 1}`} 
                                variant="outlined" 
                                value={speaker.name} 
                                onChange={(e) => handleInvitedSpeakerChange(index, e.target.value)} 
                            />
                        </Grid>
                        <Grid item xs={2} className="flex items-center">
                            <IconButton 
                                color="primary" 
                                onClick={handleAddInvitedSpeaker}
                                title="Add another invited speaker"
                            >
                                <Add />
                            </IconButton>
                            {eventData.invitedSpeakers.length > 1 && (
                                <IconButton 
                                    color="error" 
                                    onClick={() => handleRemoveInvitedSpeaker(index)}
                                    title="Remove this invited speaker"
                                >
                                    <Delete />
                                </IconButton>
                            )}
                        </Grid>
                    </Grid>
                ))}

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
            
            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}