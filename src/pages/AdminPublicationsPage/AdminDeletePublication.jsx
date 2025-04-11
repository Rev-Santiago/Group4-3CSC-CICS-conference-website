import React, { useState, useEffect } from "react";
import { 
    Grid, 
    Typography, 
    Select, 
    MenuItem, 
    Button, 
    Box, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";
import axios from "axios";

const AdminDeletePublication = () => {
    const [selectedPublication, setSelectedPublication] = useState("");
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // Fetch publications on component mount
    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await axios.get("/api/publications-admin", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Format publications for display
            const formattedPublications = response.data.publications.map(pub => ({
                id: pub.id,
                title: pub.publication_description,
                date: new Date(pub.publication_date).toLocaleDateString()
            }));
            
            setPublications(formattedPublications);
        } catch (error) {
            console.error("Error fetching publications:", error);
            setNotification({
                open: true,
                message: "Failed to load publications",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const handlePublicationChange = (event) => {
        setSelectedPublication(event.target.value);
    };

    const openConfirmDialog = () => {
        if (!selectedPublication) {
            setNotification({
                open: true,
                message: "Please select a publication to delete",
                severity: "warning"
            });
            return;
        }
        setConfirmDialog(true);
    };

    const handleDelete = async () => {
        if (!selectedPublication) return;
        
        setLoading(true);
        try {
            const token = getAuthToken();
            await axios.delete(`/api/publications/${selectedPublication}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Remove from list
            setPublications(publications.filter(pub => pub.id !== selectedPublication));
            setSelectedPublication("");
            setNotification({
                open: true,
                message: "Publication deleted successfully",
                severity: "success"
            });
            setConfirmDialog(false);
        } catch (error) {
            console.error("Error deleting publication:", error);
            setNotification({
                open: true,
                message: error.response?.data?.error || "Failed to delete publication",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    // Find the selected publication object
    const selectedPublicationObject = publications.find(pub => pub.id === selectedPublication);

    return (
        <Box className="p-4">
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Select a Publication to Delete</Typography>
            <Select
                fullWidth
                size="small"
                value={selectedPublication}
                onChange={handlePublicationChange}
                variant="outlined"
                displayEmpty
                disabled={loading || publications.length === 0}
            >
                <MenuItem value="">Select a publication to remove</MenuItem>
                {publications.map((pub) => (
                    <MenuItem key={pub.id} value={pub.id}>
                        {pub.title} ({pub.date})
                    </MenuItem>
                ))}
            </Select>

            {selectedPublicationObject && (
                <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#B7152F' }}>
                    Selected: {selectedPublicationObject.title}
                </Typography>
            )}
            
            <Grid
                item xs={12}
                className="flex flex-wrap gap-3"
                sx={{ mt: 4, justifyContent: { xs: "center", sm: "flex-end" } }}
            >
                <Button
                    variant="contained"
                    onClick={openConfirmDialog}
                    disabled={!selectedPublication || loading}
                    sx={{
                        backgroundColor: "#B7152F",
                        color: "white",
                        "&:hover": { backgroundColor: "#930E24" },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Delete Publication"}
                </Button>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog}
                onClose={() => setConfirmDialog(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the publication:
                        {selectedPublicationObject && (
                            <strong> "{selectedPublicationObject.title}"</strong>
                        )}? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

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
};

export default AdminDeletePublication;