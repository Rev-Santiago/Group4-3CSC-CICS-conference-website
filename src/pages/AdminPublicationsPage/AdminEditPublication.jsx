import { useEffect, useState } from "react";
import axios from "axios";
import {
    Grid, 
    TextField, 
    Typography, 
    Button, 
    Box, 
    Select, 
    MenuItem, 
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";

export default function AdminEditPublication() {
    const [publications, setPublications] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [selectedPublicationId, setSelectedPublicationId] = useState("");
    const [publicationData, setPublicationData] = useState({
        title: "", 
        date: "", 
        link: ""
    });
    const [isPublished, setIsPublished] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [notification, setNotification] = useState({ 
        open: false, 
        message: "", 
        severity: "success" 
    });
    const [formErrors, setFormErrors] = useState({});

    const fetchData = async () => {
        setFetchingData(true);
        try {
            const token = getAuthToken();
            const headers = { Authorization: `Bearer ${token}` };
            
            console.log("Using token:", token);
            console.log("Headers:", headers);
            
            // Fetch published publications
            console.log("Fetching publications...");
            const publicationsResponse = await axios.get("/api/publications-admin", { headers });
            console.log("Publications response:", publicationsResponse.data);
            
            // Fetch drafts
            console.log("Fetching drafts...");
            const draftsResponse = await axios.get("/api/publications/drafts", { headers });
            console.log("Drafts response:", draftsResponse.data);
            
            // Format publications
            const formattedPublications = publicationsResponse.data.publications.map(pub => ({
                id: pub.id,
                title: pub.publication_description,
                date: pub.publication_date.split('T')[0],
                link: pub.publication_link || "",
                status: "Published"
            }));
            
            // Format drafts
            const formattedDrafts = draftsResponse.data.drafts?.map(draft => ({
                id: draft.id,
                title: draft.publication_description,
                date: draft.publication_date.split('T')[0],
                link: draft.publication_link || "",
                status: "Draft"
            })) || [];
            
            setPublications(formattedPublications);
            setDrafts(formattedDrafts);
        } catch (err) {
            console.error("Error fetching publications:", err);
            // Log more detailed error information
            if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);
            } else if (err.request) {
                console.error("Request was made but no response received");
            } else {
                console.error("Error message:", err.message);
            }
            
            setNotification({
                open: true,
                message: "Failed to load publications. Check console for details.",
                severity: "error"
            });
        } finally {
            setFetchingData(false);
        }
    };

    // Fetch publications and drafts on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPublicationData((prev) => ({ ...prev, [name]: value }));
        
        // Clear errors when field is updated
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const handlePublicationSelection = (e) => {
        const id = e.target.value;
        setSelectedPublicationId(id);

        // Find from either publications or drafts
        const allItems = [...publications, ...drafts];
        const selected = allItems.find(item => item.id === id);

        if (selected) {
            setPublicationData({
                title: selected.title || "",
                date: selected.date || "",
                link: selected.link || ""
            });
            
            setIsPublished(selected.status === "Published");
        }
    };
    
    const validateForm = () => {
        const errors = {};
        
        if (!publicationData.title.trim()) {
            errors.title = "Title is required";
        }
        
        if (!publicationData.date) {
            errors.date = "Date is required";
        }
        
        if (publicationData.link && !/^(http|https):\/\/[^ "]+$/.test(publicationData.link)) {
            errors.link = "Please enter a valid URL (start with http:// or https://)";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Save as draft
    const handleSaveDraft = async () => {
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const token = getAuthToken();
            console.log("Using token for save draft:", token);
            
            // Always use /api/publications/drafts endpoint
            const response = await axios.post("/api/publications/drafts", {
                id: !isPublished ? selectedPublicationId : null, // Only include ID if it's already a draft
                title: publicationData.title,
                date: publicationData.date,
                link: publicationData.link
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log("Save draft response:", response.data);
            
            setNotification({
                open: true,
                message: "Draft saved successfully",
                severity: "success"
            });
            
            // Refresh the data without page reload
            fetchData();
        } catch (err) {
            console.error("Error saving draft:", err);
            // Log more detailed error information
            if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);
            }
            
            setNotification({
                open: true,
                message: err.response?.data?.error || "Failed to save draft",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    // Publish 
    const handlePublish = async () => {
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const token = getAuthToken();
            console.log("Using token for publish:", token);
            
            // If editing published content, use PUT
            // If publishing a draft or creating new, use POST
            let response;
            if (isPublished) {
                console.log(`Updating publication ${selectedPublicationId}...`);
                response = await axios.put(`/api/publications/${selectedPublicationId}`, {
                    title: publicationData.title,
                    date: publicationData.date,
                    link: publicationData.link,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                console.log("Creating new publication...");
                response = await axios.post("/api/publications", {
                    title: publicationData.title,
                    date: publicationData.date,
                    link: publicationData.link,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            
            console.log("Publish response:", response.data);
            
            setNotification({
                open: true,
                message: isPublished ? "Publication updated successfully" : "Publication published successfully",
                severity: "success"
            });
            
            // Refresh the data without page reload
            fetchData();
        } catch (err) {
            console.error("Error publishing:", err);
            // Log more detailed error information
            if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);
            }
            
            setNotification({
                open: true,
                message: err.response?.data?.error || "Failed to publish",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    // Combine publications and drafts for the dropdown
    const allItems = [
        ...publications.map(pub => ({ ...pub, displayStatus: "Published" })),
        ...drafts.map(draft => ({ ...draft, displayStatus: "Draft" }))
    ];

    return (
        <Box className="p-4">
            <Grid container spacing={3} className="mt-3">
                <Grid item xs={12}>
                    <Typography variant="subtitle1">Select an Existing Publication</Typography>
                    <Select
                        fullWidth 
                        size="small" 
                        value={selectedPublicationId}
                        onChange={handlePublicationSelection} 
                        displayEmpty 
                        sx={{ mt: 2 }}
                        disabled={fetchingData}
                    >
                        <MenuItem value="" disabled>{fetchingData ? 'Loading...' : 'Select a publication'}</MenuItem>
                        {allItems.length > 0 ? (
                            allItems.map((item) => (
                                <MenuItem key={`${item.id}-${item.displayStatus}`} value={item.id}>
                                    {item.title} ({item.displayStatus})
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No publications found</MenuItem>
                        )}
                    </Select>
                </Grid>

                {selectedPublicationId && (
                    <>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Publication Details:</Typography>
                            <TextField 
                                fullWidth 
                                size="small" 
                                label="Title" 
                                name="title" 
                                value={publicationData.title}
                                onChange={handleChange} 
                                sx={{ mt: 2 }}
                                error={!!formErrors.title}
                                helperText={formErrors.title}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth 
                                size="small" 
                                label="Date" 
                                type="date" 
                                name="date"
                                value={publicationData.date}
                                InputLabelProps={{ shrink: true }} 
                                onChange={handleChange}
                                error={!!formErrors.date}
                                helperText={formErrors.date}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth 
                                size="small" 
                                label="Link" 
                                name="link"
                                value={publicationData.link || ""}
                                onChange={handleChange}
                                error={!!formErrors.link}
                                helperText={formErrors.link || "Optional: Include http:// or https://"}
                            />
                        </Grid>

                        {/* Save/Publish Buttons */}
                        <Grid item xs={12} className="flex gap-2 mt-2 justify-center sm:justify-end">
                            <Button 
                                onClick={handleSaveDraft} 
                                variant="outlined" 
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : "Save Draft"}
                            </Button>
                            <Button 
                                onClick={handlePublish} 
                                variant="contained"
                                disabled={loading}
                                sx={{ 
                                    backgroundColor: "#B7152F", 
                                    color: "white", 
                                    "&:hover": { backgroundColor: "#930E24" }
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : (isPublished ? "Update" : "Publish")}
                            </Button>
                            
                            {selectedPublicationId && (
                                <Typography sx={{ ml: 3, mt: 1 }} variant="body2" color={isPublished ? "green" : "orange"}>
                                    Status: {isPublished ? "Published" : "Draft"}
                                </Typography>
                            )}
                        </Grid>
                    </>
                )}
            </Grid>

            {/* Notification */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}