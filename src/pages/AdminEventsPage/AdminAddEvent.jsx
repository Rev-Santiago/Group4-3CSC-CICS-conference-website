import { useState, useEffect } from "react";
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
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

export default function AdminAddEvent({ currentUser }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
        zoomLink: "",
    });
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
    const [userInfo, setUserInfo] = useState(null);

    const [customCategories, setCustomCategories] = useState([]);
    const defaultCategories = ["Workshop", "Seminar", "Keynote", "Conference"];
    const categoryOptions = [...new Set([...defaultCategories, ...customCategories])];

    // Fetch user info on component mount
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = getAuthToken();
                if (!token) return;
                
                const response = await fetch(`${BACKEND_URL}/api/verify-token`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Token verification failed');
                
                const data = await response.json();
                console.log("User verification:", data);
                setUserInfo(data.user);
            } catch (err) {
                console.error("Token verification error:", err);
                setNotification({
                    open: true,
                    message: `Authentication error: ${err.message}`,
                    severity: "error"
                });
            }
        };
        
        verifyToken();
    }, []);

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

    const resetForm = () => {
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
            zoomLink: "",
        });
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    // Updated handleSaveDraft function
    const handleSaveDraft = async () => {
        const formData = new FormData();
        formData.append("title", eventData.title);
        formData.append("date", eventData.date);
        formData.append("startTime", eventData.startTime);
        formData.append("endTime", eventData.endTime);
        formData.append("venue", eventData.venue);
        formData.append("theme", eventData.theme);
        formData.append("category", eventData.category);
        formData.append("zoomLink", eventData.zoomLink || "");
        
        // Combine all keynote speakers into a single string
        const keynoteSpeaker = eventData.keynoteSpeakers.map(s => s.name).filter(Boolean).join(", ");
        formData.append("keynoteSpeaker", keynoteSpeaker);
        
        // Combine all invited speakers into a single string
        const invitedSpeaker = eventData.invitedSpeakers.map(s => s.name).filter(Boolean).join(", ");
        formData.append("invitedSpeaker", invitedSpeaker);

        try {
            const token = getAuthToken();
            if (!token) {
                setNotification({
                    open: true,
                    message: "Authentication error: No token found",
                    severity: "error"
                });
                return;
            }
            
            console.log("Saving draft with token", token.substring(0, 10) + "...");
            
            const res = await fetch(`${BACKEND_URL}/api/drafts`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
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

    // Updated handlePublish function
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
                
            const formData = new FormData();
            
            // Set fields manually, ensuring required fields have values
            formData.append("title", eventData.title || "Untitled Event");
            formData.append("date", useDate);
            formData.append("startTime", eventData.startTime || "");
            formData.append("endTime", eventData.endTime || "");
            formData.append("venue", eventData.venue || "");
            formData.append("theme", eventData.theme || "");
            formData.append("category", eventData.category || "");
            formData.append("zoomLink", eventData.zoomLink || "");
            
            // Combine all keynote speakers into a single string
            const keynoteSpeaker = eventData.keynoteSpeakers.map(s => s.name).filter(Boolean).join(", ");
            formData.append("keynoteSpeaker", keynoteSpeaker);
            
            // Combine all invited speakers into a single string
            const invitedSpeaker = eventData.invitedSpeakers.map(s => s.name).filter(Boolean).join(", ");
            formData.append("invitedSpeaker", invitedSpeaker);
            
            console.log("Publishing event with date:", useDate);
            
            const token = getAuthToken();
            if (!token) {
                setNotification({
                    open: true,
                    message: "Authentication error: No token found",
                    severity: "error"
                });
                return;
            }
            
            // First verify the token
            const verifyRes = await fetch(`${BACKEND_URL}/api/verify-token`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (!verifyRes.ok) {
                const verifyData = await verifyRes.json();
                throw new Error(`Token verification failed: ${verifyData.error || "Unknown error"}`);
            }
            
            const verifyData = await verifyRes.json();
            console.log("Token verification before publish:", verifyData);

            const res = await fetch(`${BACKEND_URL}/api/events`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
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
        <Box className="p-2 sm:p-4">
            <Grid item xs={12}>
                <Typography variant="subtitle1">Event Details:</Typography>
            </Grid>
            <Grid container spacing={isTablet ? 1 : 2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        label="Title"
                        name="title"
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
                    />
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
                        label="Zoom Link"
                        name="zoomLink"
                        value={eventData.zoomLink}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sx={{ mt: isMobile ? 1 : 2 }}>
                    <Typography variant="subtitle1">Keynote Speaker(s):</Typography>
                </Grid>

                {eventData.keynoteSpeakers.map((speaker, index) => (
                    <Grid container item xs={12} key={`keynote-${index}`} spacing={1} alignItems="center">
                        <Grid item xs={isMobile ? 8 : 10} className="flex items-center">
                            <TextField
                                fullWidth
                                size={isMobile ? "small" : "medium"}
                                label={`Keynote Speaker ${index + 1}`}
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


                <Grid item xs={12} sx={{ mt: isMobile ? 1 : 2 }}>
                    <Typography variant="subtitle1">Invited Speaker(s):</Typography>
                </Grid>

                {eventData.invitedSpeakers.map((speaker, index) => (
                    <Grid container item xs={12} key={`invited-${index}`} spacing={1} alignItems="center">
                        <Grid item xs={isMobile ? 8 : 10} className="flex items-center">
                            <TextField
                                fullWidth
                                size={isMobile ? "small" : "medium"}
                                label={`Invited Speaker ${index + 1}`}
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
                
                <Grid item xs={12} sx={{ mt: isMobile ? 1 : 2 }}>
                    <Typography variant="subtitle1">Event Classification:</Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        label="Theme"
                        name="theme"
                        value={eventData.theme}
                        onChange={handleChange}
                    />
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
                                size={isMobile ? "small" : "medium"}
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2 mt-2 ${isMobile ? 'justify-center' : 'justify-end'}`}>
                    <Button
                        variant="outlined"
                        onClick={handleOpenDetails}
                        size={isMobile ? "small" : "medium"}
                        fullWidth={isMobile}
                        sx={{ mb: isMobile ? 1 : 0 }}
                    >
                        See All Details
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleSaveDraft}
                        size={isMobile ? "small" : "medium"}
                        fullWidth={isMobile}
                        sx={{ mb: isMobile ? 1 : 0 }}
                    >
                        Save
                    </Button>
                    {accountType === "super_admin" && (
                        <Button
                            variant="contained"
                            onClick={handlePublish}
                            size={isMobile ? "small" : "medium"}
                            fullWidth={isMobile}
                            sx={{
                                backgroundColor: "#B7152F",
                                color: "white",
                                "&:hover": { backgroundColor: "#930E24" },
                            }}
                        >
                            Publish
                        </Button>
                    )}
                </Grid>
            </Grid>

            <Dialog
                open={detailsOpen}
                onClose={handleCloseDetails}
                fullWidth
                maxWidth={isMobile ? "xs" : "sm"}
            >
                <DialogTitle>Event Details Overview</DialogTitle>
                <DialogContent>
                    <Typography variant="body2"><strong>Title:</strong> {eventData.title}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {eventData.date}</Typography>
                    <Typography variant="body2"><strong>Time:</strong> {eventData.startTime} - {eventData.endTime}</Typography>
                    <Typography variant="body2"><strong>Venue:</strong> {eventData.venue}</Typography>
                    <Typography variant="body2"><strong>Zoom Link:</strong> {eventData.zoomLink}</Typography>
                    <Typography variant="body2"><strong>Theme:</strong> {eventData.theme}</Typography>
                    <Typography variant="body2"><strong>Category:</strong> {eventData.category}</Typography>
                    
                    <Typography variant="subtitle2" sx={{ mt: 2 }}><strong>Keynote Speakers:</strong></Typography>
                    {eventData.keynoteSpeakers.map((speaker, index) => (
                        <Typography variant="body2" key={`k-${index}`}>
                            - {speaker.name || "(Unnamed)"}
                        </Typography>
                    ))}
                    
                    <Typography variant="subtitle2" sx={{ mt: 2 }}><strong>Invited Speakers:</strong></Typography>
                    {eventData.invitedSpeakers.map((speaker, index) => (
                        <Typography variant="body2" key={`i-${index}`}>
                            - {speaker.name || "(Unnamed)"}
                        </Typography>
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
