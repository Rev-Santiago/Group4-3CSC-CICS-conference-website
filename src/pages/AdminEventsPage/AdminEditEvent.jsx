import { useEffect, useState } from "react";
import axios from "axios";
import {
    Grid, TextField, Typography, IconButton, Select, Button, Box, Autocomplete, 
    Snackbar, Alert, useTheme, useMediaQuery, FormControl, InputLabel, 
    MenuItem, FormHelperText
} from "@mui/material";
import { Add, Delete, Save, Publish } from "@mui/icons-material";

export default function AdminEditEvent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
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
    const [timeError, setTimeError] = useState(""); // Added for time validation

    // Time validation functions
    const timeToMinutes = (timeString) => {
        if (!timeString) return 0;
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const validateTimeRange = (startTime, endTime) => {
        if (!startTime || !endTime) {
            setTimeError("");
            return true; // Allow empty times
        }

        // Convert time strings to minutes for easier calculation
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);
        
        // Handle overnight events (end time next day)
        let diffMinutes;
        if (endMinutes < startMinutes) {
            // Overnight event: add 24 hours to end time
            diffMinutes = (endMinutes + 24 * 60) - startMinutes;
        } else {
            diffMinutes = endMinutes - startMinutes;
        }
        
        const maxDurationMinutes = 5 * 60; // 5 hours = 300 minutes
        
        if (diffMinutes > maxDurationMinutes) {
            setTimeError("Event duration cannot exceed 5 hours");
            return false;
        } else if (diffMinutes <= 0) {
            setTimeError("End time must be after start time");
            return false;
        } else {
            setTimeError("");
            return true;
        }
    };

    const getRemainingDuration = () => {
        if (!eventData.startTime || !eventData.endTime || timeError) return null;
        
        const startMinutes = timeToMinutes(eventData.startTime);
        const endMinutes = timeToMinutes(eventData.endTime);
        
        let diffMinutes;
        if (endMinutes < startMinutes) {
            diffMinutes = (endMinutes + 24 * 60) - startMinutes;
        } else {
            diffMinutes = endMinutes - startMinutes;
        }
        
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        const remainingMinutes = (5 * 60) - diffMinutes;
        const remainingHours = Math.floor(remainingMinutes / 60);
        const remainingMins = remainingMinutes % 60;
        
        return {
            current: `${hours}h ${minutes}m`,
            remaining: remainingMinutes > 0 ? `${remainingHours}h ${remainingMins}m remaining` : null
        };
    };
    
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

    // Updated handleChange with time validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newEventData = { ...eventData, [name]: value };
        setEventData(newEventData);
        
        // Validate time range when start or end time changes
        if (name === 'startTime' || name === 'endTime') {
            validateTimeRange(
                name === 'startTime' ? value : eventData.startTime,
                name === 'endTime' ? value : eventData.endTime
            );
        }
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

            const startTime = start ? convertTo24Hour(start) : "";
            const endTime = end ? convertTo24Hour(end) : "";

            // Populate fields based on the selected draft
            setEventData({
                title: selected.program || "",
                date: selected.event_date ? selected.event_date.split("T")[0] : "",
                startTime: startTime,
                endTime: endTime,
                venue: selected.venue || "",
                keynoteSpeakers,
                invitedSpeakers,
                theme: selected.theme || "",
                category: selected.category || "",
                zoomLink: selected.online_room_link || ""
            });

            // Validate time range after setting data
            setTimeout(() => {
                validateTimeRange(startTime, endTime);
            }, 0);
        }
    };

    // Save/update as draft
    const handleSave = async () => {
        try {
            // Add validation check before saving
            if (!validateTimeRange(eventData.startTime, eventData.endTime)) {
                setNotification({
                    open: true,
                    message: "Please fix the time range error before saving",
                    severity: "error"
                });
                return;
            }

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
                setTimeError(""); // Clear time error
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
            setTimeError(""); // Clear time error
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
            // Add validation check before publishing
            if (!validateTimeRange(eventData.startTime, eventData.endTime)) {
                setNotification({
                    open: true,
                    message: "Please fix the time range error before publishing",
                    severity: "error"
                });
                return;
            }

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
            setTimeError(""); // Clear time error
            
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
        <Box className="p-2 sm:p-4">
            <Grid container spacing={isTablet ? 1 : 3} className="mt-1 sm:mt-3">
                <Grid item xs={12}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"}>Select an Existing Draft</Typography>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"} variant="filled" sx={{ mt: isMobile ? 1 : 2 }}>
                        <InputLabel id="draft-select-label">Select Draft</InputLabel>
                        <Select
                            labelId="draft-select-label"
                            value={selectedDraftId}
                            onChange={handleDraftSelection}
                            displayEmpty
                        >
                            <MenuItem value="" disabled></MenuItem>
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
                        <FormHelperText>Select a draft to edit or create a new one</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mt: 2 }}>Event Details:</Typography>
                    <TextField
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        label="Title"
                        name="title"
                        variant="outlined"
                        value={eventData.title}
                        onChange={handleChange}
                        sx={{ mt: isMobile ? 1 : 2 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        label="Date"
                        type="date"
                        name="date"
                        InputLabelProps={{ shrink: true }}
                        value={eventData.date}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        label="Start Time"
                        type="time"
                        name="startTime"
                        InputLabelProps={{ shrink: true }}
                        value={eventData.startTime}
                        onChange={handleChange}
                        error={!!timeError}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        label="End Time"
                        type="time"
                        name="endTime"
                        InputLabelProps={{ shrink: true }}
                        value={eventData.endTime}
                        onChange={handleChange}
                        error={!!timeError}
                        helperText={timeError}
                    />
                </Grid>

                {/* Duration display */}
                {eventData.startTime && eventData.endTime && !timeError && (
                    <Grid item xs={12}>
                        <Typography 
                            variant="body2" 
                            color="textSecondary" 
                            sx={{ mt: 1 }}
                        >
                            Duration: {getRemainingDuration()?.current}
                            {getRemainingDuration()?.remaining && (
                                <span style={{ color: '#4caf50', marginLeft: '10px' }}>
                                    ({getRemainingDuration()?.remaining})
                                </span>
                            )}
                        </Typography>
                    </Grid>
                )}

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
                                size={isMobile ? "small" : "medium"}
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        label="Zoom Link (Optional)"
                        name="zoomLink"
                        variant="outlined"
                        value={eventData.zoomLink || ""}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mt: isMobile ? 1 : 2 }}>Keynote Speaker(s):</Typography>
                </Grid>

                {eventData.keynoteSpeakers.map((speaker, index) => (
                    <Grid container item xs={12} key={`keynote-${index}`} spacing={isTablet ? 1 : 2} alignItems="center">
                        <Grid item xs={isMobile ? 8 : 10}>
                            <TextField
                                fullWidth
                                size={isMobile ? "small" : "medium"}
                                label={`Keynote Speaker ${index + 1}`}
                                variant="outlined"
                                value={speaker.name}
                                onChange={(e) => handleKeynoteSpeakerChange(index, e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={isMobile ? 4 : 2} className="flex items-center">
                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between'
                            }}>
                                <IconButton
                                    color="primary"
                                    onClick={handleAddKeynoteSpeaker}
                                    title="Add another keynote speaker"
                                    size="small"
                                    sx={{
                                        p: isMobile ? 0.5 : 1,
                                        minWidth: 34,
                                        height: 34
                                    }}
                                >
                                    <Add fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                                {eventData.keynoteSpeakers.length > 1 && (
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveKeynoteSpeaker(index)}
                                        title="Remove this keynote speaker"
                                        size="small"
                                        sx={{
                                            p: isMobile ? 0.5 : 1,
                                            minWidth: 34,
                                            height: 34
                                        }}
                                    >
                                        <Delete fontSize={isMobile ? "small" : "medium"} />
                                    </IconButton>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mt: isMobile ? 1 : 2 }}>Invited Speaker(s):</Typography>
                </Grid>

                {eventData.invitedSpeakers.map((speaker, index) => (
                    <Grid container item xs={12} key={`invited-${index}`} spacing={isTablet ? 1 : 2} alignItems="center">
                        <Grid item xs={isMobile ? 8 : 10}>
                            <TextField
                                fullWidth
                                size={isMobile ? "small" : "medium"}
                                label={`Invited Speaker ${index + 1}`}
                                variant="outlined"
                                value={speaker.name}
                                onChange={(e) => handleInvitedSpeakerChange(index, e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={isMobile ? 4 : 2} className="flex items-center">
                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between'
                            }}>
                                <IconButton
                                    color="primary"
                                    onClick={handleAddInvitedSpeaker}
                                    title="Add another invited speaker"
                                    size="small"
                                    sx={{
                                        p: isMobile ? 0.5 : 1,
                                        minWidth: 34,
                                        height: 34
                                    }}
                                >
                                    <Add fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                                {eventData.invitedSpeakers.length > 1 && (
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveInvitedSpeaker(index)}
                                        title="Remove this invited speaker"
                                        size="small"
                                        sx={{
                                            p: isMobile ? 0.5 : 1,
                                            minWidth: 34,
                                            height: 34
                                        }}
                                    >
                                        <Delete fontSize={isMobile ? "small" : "medium"} />
                                    </IconButton>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mt: isMobile ? 1 : 2 }}>Event Classification:</Typography>
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
                                size={isMobile ? "small" : "medium"}
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                {/* Save/Publish/Delete Buttons */}
                <Grid item xs={12} className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2 mt-3 ${isMobile ? 'justify-center' : 'justify-end'}`}>
                    <Button
                        onClick={handleSave}
                        variant="outlined"
                        color="primary"
                        startIcon={<Save />}
                        size={isMobile ? "small" : "medium"}
                        fullWidth={isMobile}
                        sx={{ mb: isMobile ? 1 : 0 }}
                        disabled={!!timeError}
                    >
                        Save Draft
                    </Button>

                    {accountType === "super_admin" && (
                        <>
                            <Button
                                onClick={handlePublish}
                                variant="contained"
                                startIcon={<Publish />}
                                size={isMobile ? "small" : "medium"}
                                fullWidth={isMobile}
                                sx={{
                                    mb: isMobile ? 1 : 0,
                                    backgroundColor: "#B7152F",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#B7152F" },
                                }}
                                disabled={!!timeError}
                            >
                                Publish
                            </Button>
                            {selectedDraftId && (
                                <Button
                                    onClick={handleDelete}
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete />}
                                    size={isMobile ? "small" : "medium"}
                                    fullWidth={isMobile}
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