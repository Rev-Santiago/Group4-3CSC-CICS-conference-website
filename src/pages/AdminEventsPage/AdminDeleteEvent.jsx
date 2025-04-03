import React, { useState } from "react";
import { Typography, Select, MenuItem, Button, Box, Paper } from "@mui/material";

const AdminDeleteEvent = () => {
    const [selectedEvent, setSelectedEvent] = useState("");
    const [events, setEvents] = useState([
        { id: 1, title: "Tech Conference 2025" },
        { id: 2, title: "AI Workshop" },
        { id: 3, title: "Cybersecurity Summit" },
    ]);

    const handleDelete = () => {
        if (selectedEvent) {
            setEvents(events.filter(event => event.id !== selectedEvent));
            setSelectedEvent("");
            alert("Event deleted successfully!");
        }
    };


    const handleEventChange = (event) => {
        setSelectedEvent(event.target.value);
    };

    return (
        <Paper sx={{ p: 3, mt: 1 }}>
            <Typography variant="subtitle1">Select an Event</Typography>
            <Select
                fullWidth
                size="small"
                value={selectedEvent}
                onChange={handleEventChange}
                variant="outlined"
            >
                <MenuItem value="">Select an event to delete</MenuItem>
                {events.map((event) => (
                    <MenuItem key={event.title} value={event.title}>{event.title}</MenuItem>
                ))}
            </Select>

            {selectedEvent && (
                <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#B7152F' }}>
                    About to delete: {selectedEvent}
                </Typography>
            )}
        </Paper>
    );
};

export default AdminDeleteEvent;