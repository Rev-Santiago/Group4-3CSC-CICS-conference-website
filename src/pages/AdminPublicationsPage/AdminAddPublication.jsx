// src/pages/AdminPublicationsPage/AdminAddPublication.jsx
import { useState, useEffect } from "react";
import {
    Grid,
    TextField,
    Typography,
    Button,
    Box,
    CircularProgress
} from "@mui/material";
import axios from "axios";
import { useNotification } from "../../contexts/NotificationContext";

export default function AdminAddPublication() {
    const [publicationData, setPublicationData] = useState({
        title: "",
        date: "",
        link: ""
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [userRole, setUserRole] = useState("");
    const { showNotification, showConfirmation } = useNotification();

    useEffect(() => {
        // Get user role from localStorage
        const accountType = localStorage.getItem('accountType');
        setUserRole(accountType || '');
    }, []);

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

            const response = await axios.post(apiUrl, {
                title: publicationData.title,
                date: publicationData.date,
                link: publicationData.link
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            console.log("Draft saved:", response.data);
            
            showNotification("Draft saved successfully!", "success");
        } catch (error) {
            console.error("Error saving draft:", error);
            
            // Handle duplicate error specifically
            if (error.response?.status === 409) {
                showNotification(error.response.data.error || "A duplicate publication already exists", "warning");
            } else {
                // More detailed error logging
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                }
                
                showNotification(error.response?.data?.error || "Failed to save draft", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!validateForm()) return;
        
        // Check if user has publish permission (admin or super_admin)
        if (userRole !== 'admin' && userRole !== 'super_admin') {
            showNotification("You don't have permission to publish content", "error");
            return;
        }

        // Show confirmation dialog
        const confirmed = await showConfirmation(
            "Publish Publication", 
            "Are you sure you want to publish this publication? Once published, it will be visible to all users."
        );
        
        if (!confirmed) return;
        
        setLoading(true);
        try {
            const token = getAuthToken();
            console.log("Using token:", token ? "Token exists" : "No token");
            
            // Get the base URL
            const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
            const apiUrl = `${baseUrl}/api/publications`;
            
            const response = await axios.post(apiUrl, {
                title: publicationData.title,
                date: publicationData.date,
                link: publicationData.link
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            console.log("Publication published:", response.data);
            
            showNotification("Publication published successfully!", "success");
            resetForm();
        } catch (error) {
            console.error("Error publishing:", error);
            
            // Handle duplicate error specifically
            if (error.response?.status === 409) {
                showNotification(error.response.data.error || "A duplicate publication already exists", "warning");
            } else {
                // More detailed error logging
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                }
                
                showNotification(error.response?.data?.error || "Failed to publish", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    // Check if user can publish (admin or super_admin)
    const canPublish = userRole === 'admin' || userRole === 'super_admin';

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
                        label="Insert Link (Optional)" 
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
                        {loading ? <CircularProgress size={24} /> : "Save Draft"}
                    </Button>
                    {canPublish && (
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={handlePublish}
                            disabled={loading}
                            sx={{ backgroundColor: "#B7152F", "&:hover": { backgroundColor: "#930E24" } }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Publish"}
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}