import React, { useState, useEffect } from "react";
import { Typography, Select, MenuItem, Button, Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import axios from "axios";

const AdminDeleteEvent = () => {
    const [selectedEvent, setSelectedEvent] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, eventId: null, eventTitle: "" });
    
    // Get backend URL from environment variables
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

    // Fetch events from the database
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            
            if (!token) {
                setError("Authentication error: No token found");
                setLoading(false);
                return;
            }
            
            const response = await axios.get(`${BACKEND_URL}/api/events`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Check if we have events in the response
            if (response.data && Array.isArray(response.data.events)) {
                setEvents(response.data.events);
            } else {
                setEvents([]);
            }
            
            setLoading(false);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError(err.response?.data?.error || "Failed to fetch events");
            setLoading(false);
        }
    };

    // Load events when component mounts
    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle event selection
    const handleEventChange = (event) => {
        setSelectedEvent(event.target.value);
    };

    // Open confirmation dialog before deleting
    const handleOpenConfirmDialog = () => {
        if (!selectedEvent) {
            setNotification({
                open: true,
                message: "Please select an event to delete",
                severity: "warning"
            });
            return;
        }

        const eventToDelete = events.find(event => event.id === selectedEvent);
        
        if (eventToDelete) {
            setConfirmDialog({
                open: true,
                eventId: eventToDelete.id,
                eventTitle: eventToDelete.program || "Untitled Event"
            });
        }
    };

    // Close confirmation dialog
    const handleCloseConfirmDialog = () => {
        setConfirmDialog({ ...confirmDialog, open: false });
    };

    // Delete the selected event
    const handleDeleteEvent = async () => {
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
            
            // Close the dialog
            handleCloseConfirmDialog();
            
            // Make the API call to delete the event
            await axios.delete(`${BACKEND_URL}/api/events/${confirmDialog.eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Show success notification
            setNotification({
                open: true,
                message: "Event deleted successfully!",
                severity: "success"
            });
            
            // Refresh events list and reset selection
            fetchEvents();
            setSelectedEvent("");
            
        } catch (err) {
            console.error("Error deleting event:", err);
            
            // Show error notification
            setNotification({
                open: true,
                message: err.response?.data?.error || "Failed to delete event",
                severity: "error"
            });
        }
    };

    // Close notification
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Box className="p-4">
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Select an Event to Delete</Typography>
            
            {loading ? (
                <Typography variant="body2" color="textSecondary">Loading events...</Typography>
            ) : error ? (
                <Typography variant="body2" color="error">Error: {error}</Typography>
            ) : (
                <>
                    <Select
                        fullWidth
                        size="small"
                        value={selectedEvent}
                        onChange={handleEventChange}
                        variant="outlined"
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select an event to delete</MenuItem>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <MenuItem key={event.id} value={event.id}>
                                    {event.program || "Untitled Event"} - {new Date(event.event_date).toLocaleDateString()}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No events found</MenuItem>
                        )}
                    </Select>

                    {selectedEvent && (
                        <Box sx={{ mt: 3, mb: 3 }}>
                            <Typography sx={{ fontWeight: 'bold', color: '#666' }}>
                                Selected event details:
                            </Typography>
                            {(() => {
                                const event = events.find(e => e.id === selectedEvent);
                                return event ? (
                                    <Box sx={{ mt: 1, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                                        <Typography><strong>Title:</strong> {event.program || "Untitled"}</Typography>
                                        <Typography><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</Typography>
                                        <Typography><strong>Time:</strong> {event.time_slot || "Not specified"}</Typography>
                                        <Typography><strong>Venue:</strong> {event.venue || "Not specified"}</Typography>
                                        <Typography><strong>Speaker:</strong> {event.speaker || "Not specified"}</Typography>
                                        <Typography><strong>Category:</strong> {event.category || "Not specified"}</Typography>
                                    </Box>
                                ) : null;
                            })()}
                        </Box>
                    )}

                    <Button 
                        variant="contained" 
                        color="error" 
                        disabled={!selectedEvent}
                        onClick={handleOpenConfirmDialog}
                        sx={{ mt: 2 }}
                    >
                        Delete Selected Event
                    </Button>
                </>
            )}

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={handleCloseConfirmDialog}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the event "{confirmDialog.eventTitle}"? 
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteEvent} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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

export default AdminDeleteEvent;