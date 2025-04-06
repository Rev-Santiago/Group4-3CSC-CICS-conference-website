import React, { useState } from "react";
import { TextField, Button, MenuItem, Box, Grid, Typography, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu } from "@mui/material";
import { Add, MoreVert } from "@mui/icons-material";
import AdminAddEvent from "./AdminAddEvent";
import AdminEditEvent from "./AdminEditEvent";
import AdminDeleteEvent from "./AdminDeleteEvent";
import AdminSeeAllEvents from "./AdminSeeAllEvents";

const AdminEventsPage = () => {
    const [activeButton, setActiveButton] = useState("Add Event");
    const [selectedEvent, setSelectedEvent] = useState(""); // State for dropdown selection
    const [anchorEl, setAnchorEl] = useState(null);

    const handleButtonClick = (button) => {
        setActiveButton(button);
        setSelectedEvent(""); // Reset selection when switching actions
    };

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
        <section className="flex justify-center items-center rounded-3xl p-6">
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
                            {activeButton === "Edit Event" && <AdminEditEvent />}
                            {activeButton === "See all Events" && <AdminSeeAllEvents />}
                            {activeButton === "Delete Event" && <AdminDeleteEvent />}
                            {/* Render full form only for Add/Edit mode */}
                            {activeButton === "Add Event" && <AdminAddEvent />}

                            {/* Buttons */}
                            {activeButton !== "See all Events" &&
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
                            }
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </section>
    );
};

export default AdminEventsPage;
