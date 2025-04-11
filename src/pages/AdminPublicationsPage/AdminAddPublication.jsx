// Updated src/pages/AdminPublicationsPage/AdminAddPublication.jsx
import { useState } from "react";
import {
    Grid,
    TextField,
    Typography,
    Button,
    Box,
    Snackbar,
    Alert
} from "@mui/material";
import axios from "axios";

export default function AdminAddPublication({ currentUser }) {
    const [publicationData, setPublicationData] = useState({
        title: "",
        date: "",
        link: ""
    });
    const [notification, setNotification] = useState({ 
        open: false, 
        message: "", 
        severity: "success" 
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPublicationData((prev) => ({ ...prev, [name]: value }));
        
        // Clear errors when field is updated
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
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

    const resetForm = () => {
        setPublicationData({
            title: "",
            date: "",
            link: ""
        });
        setFormErrors({});
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const handleSaveDraft = async () => {
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const token = getAuthToken();
            
            // Add debugging logs to trace the request
            console.log("Saving draft with token:", token ? "Token exists" : "No token");
            
            // Get the base URL
            const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
            const apiUrl = `${baseUrl}/api/publications/drafts`;
            console.log("API URL:", apiUrl);

            const response = await axios.post(apiUrl, {
                title: publicationData.title,
                date: publicationData.date,
                link: publicationData.link
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            console.log("Draft saved:", response.data);
            
            setNotification({
                open: true,
                message: "Draft saved successfully!",
                severity: "success"
            });
        } catch (error) {
            console.error("Error saving draft:", error);
            
            // More detailed error logging
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            
            setNotification({
                open: true,
                message: error.response?.data?.error || "Failed to save draft",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const token = getAuthToken();
            console.log("Using token:", token ? "Token exists" : "No token");
            
            // Get the base URL
            const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
            const apiUrl = `${baseUrl}/api/publications`;
            console.log("API URL:", apiUrl);
            
            const response = await axios.post(apiUrl, {
                title: publicationData.title,
                date: publicationData.date,
                link: publicationData.link
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            console.log("Publication published:", response.data);
            
            setNotification({
                open: true,
                message: "Publication published successfully!",
                severity: "success"
            });
            
            resetForm();
        } catch (error) {
            console.error("Error publishing:", error);
            
            // More detailed error logging
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            
            setNotification({
                open: true,
                message: error.response?.data?.error || "Failed to publish",
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
            <Grid item xs={12}>
                <Typography variant="subtitle1">Publication Details:</Typography>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
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
                        label="Insert Link" 
                        name="link"
                        value={publicationData.link} 
                        onChange={handleChange}
                        error={!!formErrors.link}
                        helperText={formErrors.link || "Optional: Include http:// or https://"} 
                    />
                </Grid>
                <Grid item xs={12} className="flex gap-2 mt-2 justify-center sm:justify-end">
                    <Button 
                        variant="outlined" 
                        onClick={handleSaveDraft}
                        disabled={loading}
                    >
                        Save Draft
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handlePublish}
                        disabled={loading}
                        sx={{ backgroundColor: "#B7152F", "&:hover": { backgroundColor: "#930E24" } }}
                    >
                        Publish
                    </Button>
                </Grid>
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