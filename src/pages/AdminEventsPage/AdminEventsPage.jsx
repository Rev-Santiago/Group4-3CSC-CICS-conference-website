import React, { useState } from "react";
import { 
    TextField, Button, MenuItem, Box, Grid, Typography, 
    Divider, IconButton, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Menu,
    useMediaQuery, useTheme
} from "@mui/material";
import { Add, MoreVert } from "@mui/icons-material";
import AdminAddEvent from "./AdminAddEvent";
import AdminEditEvent from "./AdminEditEvent";
import AdminDeleteEvent from "./AdminDeleteEvent";
import AdminSeeAllEvents from "./AdminSeeAllEvents";

const AdminEventsPage = () => {
    const [activeButton, setActiveButton] = useState("Add Event");
    const [selectedEvent, setSelectedEvent] = useState(""); // State for dropdown selection
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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

    // Define actions as an array for easier mapping
    const actions = ["Add Event", "Edit Event", "Delete Event", "See all Events"];

    return (
        <section className="flex justify-center items-center rounded-3xl p-2 sm:p-4 md:p-6">
            <div className="w-full max-w-6xl">
                <Grid container spacing={isMobile ? 2 : 3}>
                    {/* Sidebar Actions */}
                    <Grid item xs={12} md={3}>
                        <Box className="bg-white p-3 md:p-4 rounded-lg shadow-md">
                            <Typography variant="h6" className="mb-2 md:mb-4 font-medium text-center">
                                Actions
                            </Typography>
                            {/* Vertical stack of buttons with text-overflow fixes */}
                            <Box display="flex" flexDirection="column" gap={1}>
                                {actions.map((action) => (
                                    <Button
                                        key={action}
                                        fullWidth
                                        size={isMobile ? "small" : "medium"}
                                        variant={activeButton === action ? "contained" : "outlined"}
                                        sx={{
                                            marginY: "2px",
                                            backgroundColor: activeButton === action ? "#B7152F" : "transparent",
                                            color: activeButton === action ? "white" : "inherit",
                                            borderColor: activeButton === action ? "#B7152F" : "black",
                                            borderWidth: "1px",
                                            // Fix for text overflow
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "normal", // Changed from nowrap to normal
                                            height: "auto", // Allow button to expand vertically
                                            padding: "8px 16px", // Consistent padding
                                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                                            lineHeight: 1.2, // Tighter line height
                                            textTransform: "none", // Prevent uppercase transformation
                                            "&:hover": {
                                                backgroundColor: activeButton === action ? "#930E24" : "rgba(183, 21, 47, 0.1)",
                                                borderColor: "black",
                                            },
                                        }}
                                        onClick={() => handleButtonClick(action)}
                                    >
                                        {action}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={12} md={9}>
                        <Box className="bg-white p-3 md:p-6 rounded-lg shadow-md">
                            <Typography 
                                variant={isMobile ? "h6" : "h5"} 
                                className="mb-3 md:mb-6 font-semibold text-center"
                            >
                                {getTitle()}
                            </Typography>
                            
                            {/* Conditionally render based on screen size */}
                            <Box sx={{ 
                                overflowX: 'auto', 
                                width: '100%',
                                maxHeight: isTablet ? 'calc(100vh - 250px)' : 'auto',
                                overflowY: isTablet ? 'auto' : 'visible'
                            }}>
                                {activeButton === "Edit Event" && <AdminEditEvent />}
                                {activeButton === "See all Events" && <AdminSeeAllEvents />}
                                {activeButton === "Delete Event" && <AdminDeleteEvent />}
                                {activeButton === "Add Event" && <AdminAddEvent />}
                            </Box>

                            {/* I'm preserving the original buttons section but keeping it commented out 
                                as it was in the original code */}
                            {/* {activeButton !== "See all Events" &&
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
                            } */}
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </section>
    );
};

export default AdminEventsPage;
