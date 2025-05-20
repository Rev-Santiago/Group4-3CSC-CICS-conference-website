import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    TextField,
    Typography,
    Box,
    Button,
    Snackbar,
    Alert,
    Paper,
    Grid,
    CircularProgress
} from "@mui/material";
import { Save } from "@mui/icons-material";

const AdminAccountPage = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [userData, setUserData] = useState({
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Fetch current user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    showNotification("Authentication error: No token found", "error");
                    return;
                }

                // Get the current user email from localStorage
                const userEmail = localStorage.getItem("userEmail");
                if (userEmail) {
                    setUserData(prev => ({ ...prev, email: userEmail }));
                }

            } catch (error) {
                console.error("Error fetching user data:", error);
                showNotification("Failed to load user data", "error");
            }
        };

        fetchUserData();
    }, []);

    const showNotification = (message, severity = "success") => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear validation error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};

        // Validate email
        if (!userData.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = "Email is invalid";
        }

        // Only validate password fields if the user is trying to change password
        if (userData.currentPassword || userData.newPassword || userData.confirmPassword) {
            // Current password is required
            if (!userData.currentPassword) {
                errors.currentPassword = "Current password is required";
            }

            // Validate new password
            if (!userData.newPassword) {
                errors.newPassword = "New password is required";
            } else if (userData.newPassword.length < 6) {
                errors.newPassword = "Password must be at least 6 characters";
            }

            // Confirm password
            if (!userData.confirmPassword) {
                errors.confirmPassword = "Please confirm your password";
            } else if (userData.newPassword !== userData.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                showNotification("Authentication error: No token found", "error");
                setLoading(false);
                return;
            }

            // Prepare the data to update based on what fields are filled
            const updateData = { email: userData.email };

            // If password fields are filled, include password update
            if (userData.currentPassword && userData.newPassword) {
                updateData.currentPassword = userData.currentPassword;
                updateData.newPassword = userData.newPassword;
            }

            // Call the API to update user information
            const response = await axios.put(`${BACKEND_URL}/api/users/update-profile`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local storage with new email if it changed
            localStorage.setItem("userEmail", userData.email);

            // Clear password fields after successful update
            setUserData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));

            showNotification("Account information updated successfully");

        } catch (error) {
            console.error("Error updating account:", error);

            // Handle specific error responses
            if (error.response) {
                if (error.response.status === 401) {
                    showNotification("Incorrect current password", "error");
                } else if (error.response.data && error.response.data.error) {
                    showNotification(error.response.data.error, "error");
                } else {
                    showNotification("Failed to update account information", "error");
                }
            } else {
                showNotification("Network error, please try again", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <Box className="container mx-auto">
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
                    Account Settings
                </Typography>
            </Box>
            
            <Paper elevation={2} sx={{ p: 2, maxWidth: 700, mx: "auto" }}>
                <Typography variant="h6" sx={{ mb: 3, borderBottom: "1px solid #eee", pb: 1 }}>
                    Personal Information
                </Typography>

                <Grid container spacing={3}>
                    {/* Email */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 3, borderBottom: "1px solid #eee", pb: 1 }}>
                            Change Password
                        </Typography>
                    </Grid>

                    {/* Current Password */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={userData.currentPassword}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!formErrors.currentPassword}
                            helperText={formErrors.currentPassword}
                        />
                    </Grid>

                    {/* New Password */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={userData.newPassword}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!formErrors.newPassword}
                            helperText={formErrors.newPassword || "Must be at least 6 characters"}
                        />
                    </Grid>

                    {/* Confirm Password */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={userData.confirmPassword}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!formErrors.confirmPassword}
                            helperText={formErrors.confirmPassword}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        onClick={handleSave}
                        disabled={loading}
                        sx={{
                            backgroundColor: "#B7152F",
                            color: "white",
                            "&:hover": { backgroundColor: "#930E24" }
                        }}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </Box>
            </Paper>

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
};

export default AdminAccountPage;
