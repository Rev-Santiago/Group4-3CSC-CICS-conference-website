import React, { useState } from "react";
import { Grid, Typography, Select, MenuItem, Button, Box, Paper } from "@mui/material";

const AdminDeletePublication = () => {
    const [selectedEvent, setSelectedEvent] = useState("");
    const [events, setEvents] = useState([
        { id: 1, title: "Exploring AI in Healthcare: Innovations and Challenges" },
        { id: 2, title: "Exploring AI in Healthcare: Innovations and Challenges" },
        { id: 3, title: "Big Data Analytics in Academic Research" },
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
        <Box className="p-4">
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Select a Publication</Typography>
            <Select
                fullWidth
                size="small"
                value={selectedEvent}
                onChange={handleEventChange}
                variant="outlined"
            >
                <MenuItem value="">Select an publication to remove</MenuItem>
                {events.map((event) => (
                    <MenuItem key={event.title} value={event.title}>{event.title}</MenuItem>
                ))}
            </Select>

            {selectedEvent && (
                <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#B7152F' }}>
                    About to remove: {selectedEvent}
                </Typography>
            )}
            <Grid
                item xs={12}
                className="flex flex-wrap gap-3"
                sx={{ mt: 2, justifyContent: { xs: "center", sm: "flex-end" } }}
            >
                <Button variant="outlined">Approvers</Button>
                <Button variant="outlined">Save</Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#B7152F",
                        color: "white",
                        "&:hover": { backgroundColor: "#930E24" },
                    }}
                >
                    Publish
                </Button>
            </Grid>
        </Box>
    );
};

export default AdminDeletePublication;