import React, { useState, useEffect } from "react";
import { 
    Grid, 
    Typography, 
    Select, 
    MenuItem, 
    Button, 
    Box,
    CircularProgress
} from "@mui/material";
import axios from "axios";
import { useNotification } from "../../contexts/NotificationContext";

const AdminDeletePublication = () => {
    const [selectedPublication, setSelectedPublication] = useState("");
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [userRole, setUserRole] = useState("");
    const { showNotification, showConfirmation } = useNotification();

    // Get the base URL
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

    // Check if user can delete (only super_admin)
    useEffect(() => {
        const accountType = localStorage.getItem('accountType');
        setUserRole(accountType || '');
    }, []);

    // Fetch publications on component mount
    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = async () => {
        setFetchingData(true);
        try {
            const token = getAuthToken();
            const response = await axios.get(`${baseUrl}/api/publications-admin`, {
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
            showNotification("Failed to load publications", "error");
        } finally {
            setFetchingData(false);
        }
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const handlePublicationChange = (event) => {
        setSelectedPublication(event.target.value);
    };

    const handleDelete = async () => {
        if (!selectedPublication) {
            showNotification("Please select a publication to delete", "warning");
            return;
        }
        
        // Only super_admin can delete
        if (userRole !== 'super_admin') {
            showNotification("You don't have permission to delete publications", "error");
            return;
        }
        
        // Show confirmation dialog
        const confirmed = await showConfirmation(
            "Delete Publication", 
            "Are you sure you want to delete this publication? This action cannot be undone."
        );
        
        if (!confirmed) return;
        
        setLoading(true);
        try {
            const token = getAuthToken();
            await axios.delete(`${baseUrl}/api/publications/${selectedPublication}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Remove from list
            setPublications(publications.filter(pub => pub.id !== selectedPublication));
            setSelectedPublication("");
            showNotification("Publication deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting publication:", error);
            showNotification(error.response?.data?.error || "Failed to delete publication", "error");
        } finally {
            setLoading(false);
        }
    };

    // Find the selected publication object
    const selectedPublicationObject = publications.find(pub => pub.id === selectedPublication);

    // Check if user can delete (only super_admin)
    const canDelete = userRole === 'super_admin';

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
                disabled={fetchingData || publications.length === 0}
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
            
            {fetchingData && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress size={40} />
                </Box>
            )}
            
            <Grid
                item xs={12}
                className="flex flex-wrap gap-3"
                sx={{ mt: 4, justifyContent: { xs: "center", sm: "flex-end" } }}
            >
                <Button
                    variant="contained"
                    onClick={handleDelete}
                    disabled={!selectedPublication || loading || !canDelete}
                    sx={{
                        backgroundColor: "#B7152F",
                        color: "white",
                        "&:hover": { backgroundColor: "#930E24" },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Delete Publication"}
                </Button>
            </Grid>
            
            {!canDelete && (
                <Typography sx={{ mt: 2, color: 'gray', textAlign: 'center', fontStyle: 'italic' }}>
                    Only Super Admins can delete publications
                </Typography>
            )}
        </Box>
    );
};

export default AdminDeletePublication;