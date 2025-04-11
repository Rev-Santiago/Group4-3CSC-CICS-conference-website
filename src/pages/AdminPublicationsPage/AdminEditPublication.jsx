// src/pages/AdminPublicationsPage/AdminEditPublication.jsx
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
    const [drafts, setDrafts] = useState([]);
    const [selectedDraftId, setSelectedDraftId] = useState("");
    const [publicationData, setPublicationData] = useState({
        title: "", 
        date: "", 
        link: ""
    });
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [notification, setNotification] = useState({ 
        open: false, 
        message: "", 
        severity: "success" 
    });
    const [formErrors, setFormErrors] = useState({});

    // Get the base URL
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

    const fetchDrafts = async () => {
        setFetchingData(true);
        try {
            const token = getAuthToken();
            
            if (!token) {
                console.error("No auth token found");
                setNotification({
                    open: true,
                    message: "Authentication error: No token found",
                    severity: "error"
                });
                return;
            }
            
            const headers = { Authorization: `Bearer ${token}` };
            
            console.log("Fetching drafts...");
            const draftsResponse = await axios.get(`${baseUrl}/api/publications/drafts`, { headers });
            console.log("Drafts response:", draftsResponse.data);
            
            // Format drafts
            const formattedDrafts = draftsResponse.data.drafts?.map(draft => ({
                id: draft.id,
                title: draft.publication_description,
                date: draft.publication_date.split('T')[0],
                link: draft.publication_link || ""
            })) || [];
            
            setDrafts(formattedDrafts);
        } catch (err) {
            console.error("Error fetching drafts:", err);
            // Log more detailed error information
            if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);
            }
            
            setNotification({
                open: true,
                message: "Failed to load drafts. Check console for details.",
                severity: "error"
            });
        } finally {
            setFetchingData(false);
        }
    };

    // Fetch drafts on component mount
    useEffect(() => {
        fetchDrafts();
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

    const handleDraftSelection = (e) => {
        const id = e.target.value;
        setSelectedDraftId(id);

        // Find the selected draft
        const selected = drafts.find(draft => draft.id === id);

        if (selected) {
            setPublicationData({
                title: selected.title || "",
                date: selected.date || "",
                link: selected.link || ""
            });
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
            console.log("Using token for save draft:", token ? "Token exists" : "No token");
            
            // Include ID for existing draft to update, or null for new draft
            const response = await axios.post(`${baseUrl}/api/publications/drafts`, {
                id: selectedDraftId || null,
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
            
            // Refresh drafts
            fetchDrafts();
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
            console.log("Using token for publish:", token ? "Token exists" : "No token");
            
            // First, publish the draft
            console.log("Creating new publication...");
            const response = await axios.post(`${baseUrl}/api/publications`, {
                title: publicationData.title,
                date: publicationData.date,
                link: publicationData.link,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log("Publish response:", response.data);
            
            /* 
            NOTE: Your backend doesn't appear to have a dedicated API endpoint
            to delete drafts by ID. Since drafts are stored in a separate table,
            we would need a backend route for this functionality.
            
            We're keeping the draft in the database for now, but it's noted
            as a feature request to add a delete endpoint for drafts.
            */
            
            setNotification({
                open: true,
                message: "Publication published successfully",
                severity: "success"
            });
            
            // Reset form and selection
            setSelectedDraftId("");
            setPublicationData({
                title: "",
                date: "",
                link: ""
            });
            
            // Refresh drafts
            fetchDrafts();
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
    
    // Delete a draft
// Updated handleDelete function for AdminEditPublication.jsx

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
    
    setLoading(true);
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
        
        // Use the correct URL format for the delete endpoint
        const response = await axios.delete(`${baseUrl}/api/publications/drafts/${selectedDraftId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setNotification({
            open: true,
            message: "Draft deleted successfully!",
            severity: "success"
        });
        
        // Refresh drafts and reset selection
        fetchDrafts();
        setSelectedDraftId("");
        setPublicationData({
            title: "",
            date: "",
            link: ""
        });
    } catch (err) {
        console.error("Error deleting draft:", err);
        setNotification({
            open: true,
            message: err.response?.data?.error || "Failed to delete draft",
            severity: "error"
        });
    } finally {
        setLoading(false);
    }
};
    
    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <Box className="p-4">
            <Grid container spacing={3} className="mt-3">
                <Grid item xs={12}>
                    <Typography variant="subtitle1">Select an Existing Draft</Typography>
                    <Select
                        fullWidth 
                        size="small" 
                        value={selectedDraftId}
                        onChange={handleDraftSelection} 
                        displayEmpty 
                        sx={{ mt: 2 }}
                        disabled={fetchingData}
                    >
                        <MenuItem value="" disabled>{fetchingData ? 'Loading...' : 'Select a draft'}</MenuItem>
                        {drafts.length > 0 ? (
                            drafts.map((draft) => (
                                <MenuItem key={draft.id} value={draft.id}>
                                    {draft.title}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No drafts found</MenuItem>
                        )}
                    </Select>
                </Grid>

                {selectedDraftId && (
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

                        {/* Save/Publish/Delete Buttons */}
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Publish"}
                            </Button>
                            <Button 
                                onClick={handleDelete} 
                                variant="outlined"
                                color="error"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : "Delete"}
                            </Button>
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