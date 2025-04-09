import { useState } from "react";
import {
    Grid,
    TextField,
    Typography,
    Button,
    Box,
} from "@mui/material";

export default function AdminAddPublication({ currentUser }) {
    const [eventData, setEventData] = useState({
        title: "",
        date: "",
        Link: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({ ...prev, [name]: value }));
    };


    const resetForm = () => {
        setEventData({
            title: "",
            date: "",
            Link: "",
        });
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const handleSaveDraft = async () => {
        const formData = new FormData();
        Object.entries(eventData).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        try {
            const res = await fetch("http://localhost:5000/api/drafts", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
            });

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

    const handlePublish = async () => {
        const formData = new FormData();
        Object.entries(eventData).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        try {
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
            const res = await fetch("http://localhost:5000/api/events", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
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
        <Box className="p-4">
            <Grid item xs={12}>
                <Typography variant="subtitle1">Publication Details:</Typography>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Title" name="title" onChange={handleChange} sx={{ mt: 2 }} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Date" type="date" name="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Insert Link" name="Link" onChange={handleChange} />
                </Grid>
                <Grid item xs={12} className="flex gap-2 mt-2 justify-center sm:justify-end">
                    <Button variant="outlined" onClick={handleOpenDetails}>See All Details</Button>
                    <Button variant="contained" color="warning" onClick={handleSaveDraft}>Save</Button>
                    {currentUser?.account_type === "super_admin" && (
                        <Button variant="contained" color="error" onClick={handleSubmit}>Publish</Button>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
