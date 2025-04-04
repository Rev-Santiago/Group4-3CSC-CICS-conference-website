import React, { useState } from "react";
import { Button, MenuItem, Box, Grid, Typography, Divider, Select } from "@mui/material";

import AdminPageHome from "./AdminPageHome";
import AdminPageCallForPapers from "./AdminPageCallForPapers";
import AdminPageContact from "./AdminPageContact";
import AdminPagePartners from "./AdminPagePartners";
import AdminPageCommittee from "./AdminPageCommittee";
import AdminPageEventHistory from "./AdminPageEventHistory";
import AdminPageRegistrationFees from "./AdminPageRegistrationFees";
import AdminPagePublication from "./AdminPagePublication";
import AdminPageSchedule from "./AdminPageSchedule";
import AdminPageVenue from "./AdminPageVenue";
import AdminPageKeynoteSpeakers from "./AdminPageKeynoteSpeakers";
import AdminPageInvitedSpeakers from "./AdminPageInvitedSpeakers";
import AdminGlobalLayoutNavbar from "./AdminGlobalLayoutNavbar";
import AdminGlobalLayoutFooter from "./AdminGlobalLayoutFooter";

const AdminPages = () => {
    const [selectedEvent, setSelectedEvent] = useState(""); // State for dropdown selection
    const [anchorEl, setAnchorEl] = useState(null);
    const [displayText, setDisplayText] = useState("Home");
    const [selectedPage, setSelectedPage] = useState("Home");
    const [activeButton, setActiveButton] = useState("");

    const handlePageChange = (event) => {
        setSelectedPage(event.target.value);
    };

    const handleButtonClick = (id, label) => {
        setActiveButton(id);
        setSelectedPage(label);
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

                            {/* Pages Dropdown */}
                            <Typography variant="subtitle1" className="mb-2 font-medium">
                                Pages
                            </Typography>
                            <Select
                                fullWidth
                                value={selectedPage}
                                onChange={handlePageChange}
                                sx={{
                                    height: 48, // Adjust height as needed
                                    ".MuiSelect-select": {
                                        padding: "10px", // Adjust padding if necessary
                                    },
                                }}
                            >
                                <MenuItem value="Home">Home</MenuItem>
                                <MenuItem value="Call For Papers">Call For Papers</MenuItem>
                                <MenuItem value="Contact">Contacts</MenuItem>
                                <MenuItem value="Partners">Partners</MenuItem>
                                <MenuItem value="Committee">Committee</MenuItem>
                                <MenuItem value="Event History">Event History</MenuItem>
                                <MenuItem value="Registration And Fees">Registration & Fees</MenuItem>
                                <MenuItem value="Publication">Publication</MenuItem>
                                <MenuItem value="Schedule">Schedule</MenuItem>
                                <MenuItem value="Venue">Venue</MenuItem>
                                <MenuItem value="Keynote Speakers">Keynote Speakers</MenuItem>
                                <MenuItem value="Invited Speakers">Invited Speakers</MenuItem>
                            </Select>

                            <Grid item xs={12}>
                                <Divider sx={{ mt: 3, mb: 1 }} />
                            </Grid>

                            {/* Navbar Section */}
                            <Typography variant="subtitle1" className="mb-2 font-medium">
                                Global Layout
                            </Typography>
                            {[
                                { label: "Navbar", id: "Navbar" },
                                { label: "Footer", id: "Footer" },
                            ].map((item) => (
                                <Button
                                    key={item.id}
                                    fullWidth
                                    variant={activeButton === item.id ? "contained" : "outlined"}
                                    sx={{
                                        backgroundColor: activeButton === item.id ? "#B7152F" : "transparent",
                                        color: activeButton === item.id ? "white" : "inherit",
                                        borderColor: "black",
                                        borderWidth: "1px",
                                        marginBottom: "8px",
                                        "&:hover": {
                                            backgroundColor: activeButton === item.id ? "#930E24" : "rgba(183, 21, 47, 0.1)",
                                            borderColor: "black",
                                        },
                                    }}
                                    onClick={() => handleButtonClick(item.id, item.label)}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={12} md={9}>
                        <Box className="bg-white p-6 rounded-lg shadow-md">
                            <Typography variant="h5" className="mb-6 font-semibold text-center">
                                {selectedPage}
                            </Typography>
                            {selectedPage === "Home" && <AdminPageHome />}
                            {selectedPage === "Call For Papers" && <AdminPageCallForPapers />}
                            {selectedPage === "Contact" && <AdminPageContact />}
                            {selectedPage === "Partners" && <AdminPagePartners />}
                            {selectedPage === "Committee" && <AdminPageCommittee />}
                            {selectedPage === "Event History" && <AdminPageEventHistory />}
                            {selectedPage === "Registration And Fees" && <AdminPageRegistrationFees />}
                            {selectedPage === "Publication" && <AdminPagePublication />}
                            {selectedPage === "Schedule" && <AdminPageSchedule />}
                            {selectedPage === "Venue" && <AdminPageVenue />}
                            {selectedPage === "Keynote Speakers" && <AdminPageKeynoteSpeakers />}
                            {selectedPage === "Invited Speakers" && <AdminPageInvitedSpeakers />}
                            {selectedPage === "Navbar" && <AdminGlobalLayoutNavbar />}
                            {selectedPage === "Footer" && <AdminGlobalLayoutFooter />}
                            <Grid item xs={12} className="flex flex-wrap gap-3" sx={{ justifyContent: { xs: "center", sm: "flex-end" }, mt: 4 }}>
                                <Button variant="outlined" sx={{ mt: 1 }}>Preview Page</Button>
                                <Button variant="outlined" sx={{ mt: 1 }}>Approvers</Button>
                                <Button variant="outlined" sx={{ mt: 1 }}>Save</Button>
                                <Button variant="contained" sx={{ mt: 1, backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#930E24" } }}>
                                    Publish
                                </Button>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </section>
    );
};

export default AdminPages;
