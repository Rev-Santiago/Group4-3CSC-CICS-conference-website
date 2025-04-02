import React, { useState } from "react";
import { TextField, Button, MenuItem, Box, Grid, Typography, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu } from "@mui/material";
import { Add, MoreVert } from "@mui/icons-material";


const AdminEventsPage = () => {
    const [activeButton, setActiveButton] = useState("Add Event");
    const [selectedEvent, setSelectedEvent] = useState(""); // State for dropdown selection
    const [anchorEl, setAnchorEl] = useState(null);

    const handleButtonClick = (button) => {
        setActiveButton(button);
        setSelectedEvent(""); // Reset selection when switching actions
    };

    const handleMenuOpen = (event, eventData) => {
        setAnchorEl(event.currentTarget);
        setSelectedEvent(eventData);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedEvent(null);
    };

    // Mock event list (Replace with actual data)
    const eventList = ["Event A", "Event B", "Event C"];
    const events = [
        {
            title: "Tech Conference 2024",
            date: "2024-07-15",
            time: "10:00 AM",
            venue: "Auditorium",
            speakers: "John Doe, Jane Smith",
            theme: "Future of AI",
            category: "Conference"
        },
        {
            title: "Business Workshop",
            date: "2024-08-20",
            time: "2:00 PM",
            venue: "Meeting Hall",
            speakers: "Alice Johnson",
            theme: "Leadership & Growth",
            category: "Workshop"
        }
    ];


    const getTitle = () => {
        switch (activeButton) {
            case "Add Event":
                return "Add New Event";
            case "Edit Event":
                return "Edit Existing Event";
            case "Delete Event":
                return "Delete an Event";
            case "See all Events":
                return "All Events Overview";
            default:
                return "Manage Events";
        }
    };

    return (
        <section className="flex justify-center items-center bg-gray-200 rounded-3xl p-6">
            <div className="w-full max-w-6xl">
                <Grid container spacing={3}>
                    {/* Sidebar Actions */}
                    <Grid item xs={12} md={3}>
                        <Box className="bg-white p-4 rounded-lg shadow-md">
                            <Typography variant="h6" className="mb-4 font-medium text-center">
                                Actions
                            </Typography>
                            {["Add Event", "Edit Event", "Delete Event", "See all Events"].map((action, index) => (
                                <Button
                                    fullWidth
                                    variant={activeButton === action ? "contained" : "outlined"}
                                    sx={{
                                        backgroundColor: activeButton === action ? "#B7152F" : "transparent",
                                        color: activeButton === action ? "white" : "inherit",
                                        borderColor: activeButton === action ? "#B7152F" : "black", // Set outline to black
                                        borderWidth: "1px", // Make border thicker for better visibility
                                        "&:hover": {
                                            backgroundColor: activeButton === action ? "#930E24" : "rgba(183, 21, 47, 0.1)",
                                            borderColor: "black", // Keep border black on hover
                                        },
                                    }}
                                    onClick={() => handleButtonClick(action)}
                                >
                                    {action}
                                </Button>
                            ))}
                        </Box>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={12} md={9}>
                        <Box className="bg-white p-6 rounded-lg shadow-md">
                            <Typography variant="h5" className="mb-6 font-semibold text-center">
                                {getTitle()}
                            </Typography>

                            {/* Show event list only when "See all Events" is selected */}
                            {activeButton === "See all Events" ? (
                                <TableContainer component={Paper} sx={{
                                    mt: 3,
                                    width: "100%",
                                    overflowX: "auto",
                                    maxWidth: "100vw" // Prevents full-page scrolling
                                }}>
                                    <Table sx={{ minWidth: 800 }}>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: "#B7152F" }}>
                                                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid #000" }}>Title</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid #000" }}>Date</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid #000" }}>Time</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid #000" }}>Venue</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid #000" }}>Speakers</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid #000" }}>Theme</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid #000" }}>Category</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: "bold" }}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {events.map((event, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ borderRight: "1px solid #000" }}>{event.title}</TableCell>
                                                    <TableCell sx={{ borderRight: "1px solid #000" }}>{event.date}</TableCell>
                                                    <TableCell sx={{ borderRight: "1px solid #000" }}>{event.time}</TableCell>
                                                    <TableCell sx={{ borderRight: "1px solid #000" }}>{event.venue}</TableCell>
                                                    <TableCell sx={{ borderRight: "1px solid #000" }}>{event.speakers}</TableCell>
                                                    <TableCell sx={{ borderRight: "1px solid #000" }}>{event.theme}</TableCell>
                                                    <TableCell sx={{ borderRight: "1px solid #000" }}>{event.category}</TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={(e) => handleMenuOpen(e, event)}>
                                                            <MoreVert />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {/* MoreVert Dropdown Menu */}
                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                        <MenuItem onClick={() => { console.log("Edit", selectedEvent); handleMenuClose(); }}>Edit</MenuItem>
                                        <MenuItem onClick={() => { console.log("Delete", selectedEvent); handleMenuClose(); }}>Delete</MenuItem>
                                    </Menu>
                                </TableContainer>
                            ) : (
                                <>
                                    {/* Show dropdown if editing or deleting an event */}
                                    {(activeButton === "Edit Event" || activeButton === "Delete Event") && (
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    label="Select an Existing Event"
                                                    value={selectedEvent}
                                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ mt: 3 }}
                                                >
                                                    {eventList.map((event, index) => (
                                                        <MenuItem key={index} value={event}>
                                                            {event}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            {/* Show selected event name in Delete Event mode */}
                                            {activeButton === "Delete Event" && selectedEvent && (
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                                        Selected Event: <strong>{selectedEvent}</strong>
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    )}

                                    {/* Render full form only for Add/Edit mode */}
                                    {activeButton !== "Delete Event" && (
                                        <Grid container spacing={3} className="mt-3">
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Title" variant="outlined" sx={{ mt: 3 }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Date"
                                                    type="date"
                                                    variant="outlined"
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>

                                            {/* Time Field - Stacks on mobile */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Time"
                                                    type="time"
                                                    variant="outlined"
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Venue" select variant="outlined">
                                                    <MenuItem value="Cafeteria">Cafeteria</MenuItem>
                                                    <MenuItem value="Auditorium">Auditorium</MenuItem>
                                                </TextField>
                                            </Grid>

                                            {/* Divider above Speakers Section */}
                                            <Grid item xs={12}>
                                                <Divider className="my-4" />
                                            </Grid>

                                            {/* Speakers Section */}
                                            <Grid item xs={12}>
                                                <Typography variant="h6">Speaker(s):</Typography>
                                            </Grid>
                                            {/* Keynote Speaker */}
                                            <Grid item xs={12} className="flex items-center gap-2">
                                                <TextField fullWidth size="small" label="Keynote Speaker" variant="outlined" />
                                                <IconButton color="black">
                                                    <Add />
                                                </IconButton>
                                            </Grid>

                                            <Grid item xs={12} className="flex items-center gap-2">
                                                <TextField fullWidth size="small" label="Upload Image" type="file" variant="outlined" InputLabelProps={{ shrink: true }} />
                                                <IconButton color="black">
                                                    <Add />
                                                </IconButton>
                                            </Grid>

                                            {/* Invited Speaker */}
                                            <Grid item xs={12} className="flex items-center gap-2">
                                                <TextField fullWidth size="small" label="Invited Speaker" variant="outlined" />
                                                <IconButton color="black">
                                                    <Add />
                                                </IconButton>
                                            </Grid>

                                            <Grid item xs={12} className="flex items-center gap-2">
                                                <TextField fullWidth size="small" label="Upload Image" type="file" variant="outlined" InputLabelProps={{ shrink: true }} />
                                                <IconButton color="black">
                                                    <Add />
                                                </IconButton>
                                            </Grid>


                                            {/* Divider above Theme */}
                                            <Grid item xs={12}>
                                                <Divider className="my-4" />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Theme" variant="outlined" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Categories" select variant="outlined">
                                                    <MenuItem value="Conference">Conference</MenuItem>
                                                    <MenuItem value="Workshop">Workshop</MenuItem>
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                    )}

                                    {/* Buttons */}
                                    <Grid
                                        item xs={12}
                                        className="flex flex-wrap gap-3"
                                        sx={{ mt: 2, justifyContent: { xs: "center", sm: "flex-end" } }}
                                    >
                                        {activeButton !== "Delete Event" && <Button variant="outlined">See all details</Button>}
                                        <Button variant="outlined">Approvers</Button>
                                        {activeButton !== "Delete Event" && <Button variant="outlined">Save</Button>}
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#B7152F",
                                                color: "white",
                                                "&:hover": { backgroundColor: "#930E24" },
                                            }}
                                        >
                                            {activeButton === "Delete Event" ? "Delete" : "Publish"}
                                        </Button>
                                    </Grid>
                                </>
                            )}

                        </Box>
                    </Grid>
                </Grid>
            </div>
        </section>
    );
};

export default AdminEventsPage;
