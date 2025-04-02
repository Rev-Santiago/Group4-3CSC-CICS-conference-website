import React, { useState } from "react";
import { TextField, Button, MenuItem, Box, Grid, Typography, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, Menu, TextareaAutosize } from "@mui/material";
import { Add, MoreVert } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const AdminPages = () => {
    const [selectedEvent, setSelectedEvent] = useState(""); // State for dropdown selection
    const [anchorEl, setAnchorEl] = useState(null);
    const [displayText, setDisplayText] = useState("Home");
    const [selectedPage, setSelectedPage] = useState("Home");
    const [activeButton, setActiveButton] = useState("");

    const [accordions, setAccordions] = useState([
        { id: 1, title: "Accordion 1", body: "Content for accordion 1" },
        { id: 2, title: "Accordion 2", body: "Content for accordion 2" },
    ]);
    const [selectedAccordion, setSelectedAccordion] = useState("");

    const [selectedTrack, setSelectedTrack] = useState("");
    const [tracks, setTracks] = useState([
        { id: 1, title: "Track 1", description: "Details about track 1" },
        { id: 2, title: "Track 2", description: "Details about track 2" },
    ]);

    const [selectedContact, setSelectedContact] = useState("");
    const [contacts, setContacts] = useState([
        { id: 1, name: "Contact 1", details: "Details about John Doe" },
        { id: 2, name: "Contact 2", details: "Details about Jane Smith" },
    ]);

    const [selectedPartner, setSelectedPartner] = useState("");
    const [partners, setPartners] = useState([
        { id: 1, name: "Company A", details: "Details about Company A" },
        { id: 2, name: "Company B", details: "Details about Company B" },
    ]);

    const [selectedCommitteeMember, setSelectedCommitteeMember] = useState("");
    const [committee, setCommittee] = useState([
        { id: 1, position: "Chairperson", details: "Details about Alice Johnson" },
        { id: 2, position: "Secretary", details: "Details about Bob Smith" },
    ]);

    const [selectedKeynoteSpeaker, setSelectedKeynoteSpeaker] = useState("");
    const [keynoteSpeakers, setKeynoteSpeakers] = useState([
        { id: 1, name: "Dr. Emily Carter", position: "AI Researcher", origin: "USA", details: "Details about Dr. Emily Carter" },
        { id: 2, name: "Prof. James Anderson", position: "Quantum Scientist", origin: "UK", details: "Details about Prof. James Anderson" },
    ]);

    const [selectedInvitedSpeaker, setSelectedInvitedSpeaker] = useState("");
    const [invitedSpeakers, setInvitedSpeakers] = useState([
        { id: 1, name: "Dr. Sarah Lee", position: "Data Scientist", origin: "Canada", details: "Details about Dr. Sarah Lee" },
        { id: 2, name: "Prof. Michael Brown", position: "Cybersecurity Expert", origin: "Germany", details: "Details about Prof. Michael Brown" },
    ]);

    const handleInvitedSpeakerChange = (event) => {
        setSelectedInvitedSpeaker(event.target.value);
    };
    const handleTrackChange = (event) => {
        setSelectedTrack(event.target.value);
    };

    const handlePartnerChange = (event) => {
        setSelectedPartner(event.target.value);
    };

    const handleContactChange = (event) => {
        setSelectedContact(event.target.value);
    };

    const handleCommitteeChange = (event) => {
        setSelectedCommitteeMember(event.target.value);
    };

    const handleKeynoteSpeakerChange = (event) => {
        setSelectedKeynoteSpeaker(event.target.value);
    };


    const handleMenuOpen = (event, eventData) => {
        setAnchorEl(event.currentTarget);
        setSelectedEvent(eventData);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedEvent(null);
    };

    const handlePageChange = (event) => {
        setSelectedPage(event.target.value);
    };

    const handleAccordionChange = (event) => {
        setSelectedAccordion(event.target.value);
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
                            {selectedPage === "Home" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Main:</Typography>
                                    <TextField fullWidth size="small" label="Title" variant="outlined" sx={{ mt: 2 }} />
                                    <Typography variant="subtitle2" sx={{ mt: 2, ml: 1.5 }}>Body:</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        style={{
                                            width: "100%",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "8px"
                                        }}
                                    />
                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ mt: 4 }}>Component Contents</Typography>
                                    </Grid>
                                    <Typography variant="subtitle1" sx={{ my: 2 }}>Image Carousel:</Typography>
                                    <Grid item xs={12} className="flex items-center gap-2">
                                        <TextField fullWidth size="small" label="Upload Image" type="file" variant="outlined" InputLabelProps={{ shrink: true }} />
                                        <IconButton color="black">
                                            <Add />
                                        </IconButton>
                                    </Grid>
                                    <Typography variant="subtitle1" sx={{ my: 2 }}>Accordion:</Typography>
                                    <Select fullWidth size="small" value={selectedAccordion} onChange={handleAccordionChange} variant="outlined">
                                        <MenuItem value="">Select an accordion</MenuItem>
                                        {accordions.map((acc) => (
                                            <MenuItem key={acc.id} value={acc.id}>{acc.title}</MenuItem>
                                        ))}
                                    </Select>
                                    {selectedAccordion && (
                                        <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                                            <Typography variant="h6" className="mb-2 font-medium">
                                                {accordions.find(a => a.id === selectedAccordion)?.title}
                                            </Typography>
                                            <TextField fullWidth size="small" label="Title" variant="outlined" sx={{ mt: 2 }} />
                                            <Typography variant="subtitle2" sx={{ mt: 2, ml: 1.5 }}>Body:</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={3}
                                                style={{
                                                    width: "100%",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    padding: "8px"
                                                }}
                                            />
                                        </Paper>
                                    )}
                                    <Button variant="outlined" sx={{ mt: 2 }}>Add an Accordion</Button>
                                </>
                            )}
                            {selectedPage === "Call For Papers" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ my: 2 }}>Tracks:</Typography>
                                    <Select fullWidth size="small" value={selectedTrack} onChange={handleTrackChange} variant="outlined">
                                        <MenuItem value="">Select a track</MenuItem>
                                        {tracks.map((track) => (
                                            <MenuItem key={track.id} value={track.id}>{track.title}</MenuItem>
                                        ))}
                                    </Select>
                                    {selectedTrack && (
                                        <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                                            <Typography variant="h6" className="mb-2 font-medium">
                                                {tracks.find(t => t.id === selectedTrack)?.title}
                                            </Typography>
                                            <TextField fullWidth size="small" label="Title" variant="outlined" sx={{ mt: 2 }} />
                                            <Typography variant="subtitle2" sx={{ mt: 2, ml: 1.5 }}>Body:</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={3}
                                                style={{
                                                    width: "100%",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    padding: "8px"
                                                }}
                                            />
                                        </Paper>
                                    )}
                                    <Button variant="outlined" sx={{ mt: 2 }}>Add a Track</Button>
                                    <Button variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#930E24" } }}>
                                        Remove Track
                                    </Button>
                                    <Typography variant="subtitle1" sx={{ my: 2 }}>Submission Guidelines:</Typography>
                                    <Typography variant="subtitle2" sx={{ mt: 2, ml: 1.5 }}>Body:</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        style={{
                                            width: "100%",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "8px"
                                        }}
                                    />
                                </>
                            )}
                            {selectedPage === "Contact" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ my: 2 }}>Contacts:</Typography>
                                    <Select fullWidth size="small" value={selectedContact} onChange={handleContactChange} variant="outlined">
                                        <MenuItem value="">Select a contact</MenuItem>
                                        {contacts.map((contact) => (
                                            <MenuItem key={contact.id} value={contact.id}>{contact.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {selectedContact && (
                                        <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                                            <Typography variant="h6" className="mb-2 font-medium">
                                                {contacts.find(c => c.id === selectedContact)?.name}
                                            </Typography>
                                            <TextField fullWidth size="small" label="Name" variant="outlined" sx={{ mt: 2 }} />
                                            <TextField fullWidth size="small" label="Email" variant="outlined" sx={{ mt: 2 }} />
                                            <TextField fullWidth size="small" label="Telephone" variant="outlined" sx={{ mt: 2 }} />
                                        </Paper>
                                    )}
                                    <Button variant="outlined" sx={{ mt: 2 }}>Add a Contact</Button>
                                    <Button variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#930E24" } }}>
                                        Remove Contact
                                    </Button>
                                </>
                            )}
                            {selectedPage === "Partners" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ my: 2 }}>Partners:</Typography>
                                    <Select fullWidth size="small" value={selectedPartner} onChange={handlePartnerChange} variant="outlined">
                                        <MenuItem value="">Select a partner</MenuItem>
                                        {partners.map((partner) => (
                                            <MenuItem key={partner.id} value={partner.id}>{partner.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {selectedPartner && (
                                        <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                                            <Typography variant="h6" className="mb-2 font-medium">
                                                {partners.find(p => p.id === selectedPartner)?.name}
                                            </Typography>
                                            <TextField fullWidth size="small" label="Name" variant="outlined" sx={{ mt: 2 }} />
                                            <TextField fullWidth size="small" label="Industry" variant="outlined" sx={{ mt: 2 }} />
                                            <TextField fullWidth size="small" label="Location" variant="outlined" sx={{ mt: 2 }} />
                                            <Typography variant="subtitle2" sx={{ mt: 2, ml: 1.5 }}>Details:</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={3}
                                                style={{
                                                    width: "100%",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    padding: "8px"
                                                }}
                                            />
                                        </Paper>
                                    )}
                                    <Button variant="outlined" sx={{ mt: 2 }}>Add a Partner</Button>
                                    <Button variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#930E24" } }}>
                                        Remove Partner
                                    </Button>
                                </>
                            )}
                            {selectedPage === "Committee" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ my: 2 }}>Committee Positions:</Typography>
                                    <Select fullWidth size="small" value={selectedCommitteeMember} onChange={handleCommitteeChange} variant="outlined">
                                        <MenuItem value="">Select a committee position</MenuItem>
                                        {committee.map((member) => (
                                            <MenuItem key={member.id} value={member.id}>{member.position}</MenuItem>
                                        ))}
                                    </Select>
                                    {selectedCommitteeMember && (
                                        <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                                            <Typography variant="h6" className="mb-2 font-medium">
                                                {committee.find(m => m.id === selectedCommitteeMember)?.position}
                                            </Typography>
                                            <div className="flex flex-row justify-center items-center mt-4">
                                                <TextField fullWidth size="small" label="Name" variant="outlined" />
                                                <IconButton>
                                                    <CloseIcon sx={{ color: "black" }} />
                                                </IconButton>
                                            </div>
                                            <div className="flex flex-row justify-center items-center mt-4">
                                                <TextField fullWidth size="small" label="Name" variant="outlined" />
                                                <IconButton>
                                                    <CloseIcon sx={{ color: "black" }} />
                                                </IconButton>
                                            </div>
                                            <div className="flex flex-row justify-center items-center mt-4">
                                                <TextField fullWidth size="small" label="Name" variant="outlined" />
                                                <IconButton>
                                                    <CloseIcon sx={{ color: "black" }} />
                                                </IconButton>
                                            </div>
                                        </Paper>
                                    )}
                                    <Button variant="outlined" sx={{ mt: 2 }}>Add a Name</Button>
                                </>
                            )}
                            {selectedPage === "Event History" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Announcements:</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        style={{
                                            width: "100%",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "8px"
                                        }}
                                    />
                                </>
                            )}
                            {selectedPage === "Registration And Fees" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Payment Guidelines:</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        style={{
                                            width: "100%",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "8px"
                                        }}
                                    />
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Presentation Video:</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        style={{
                                            width: "100%",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "8px"
                                        }}
                                    />
                                </>
                            )}
                            {selectedPage === "Publication" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Conference Proceedings:</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        style={{
                                            width: "100%",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "8px"
                                        }}
                                    />
                                </>
                            )}
                            {selectedPage === "Schedule" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Announcements:</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        style={{
                                            width: "100%",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "8px"
                                        }}
                                    />
                                </>
                            )}
                            {selectedPage === "Venue" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Announcements:</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        style={{
                                            width: "100%",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "8px"
                                        }}
                                    />
                                </>
                            )}
                            {selectedPage === "Keynote Speakers" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ my: 2 }}>Speakers:</Typography>
                                    <Select fullWidth size="small" value={selectedKeynoteSpeaker} onChange={handleKeynoteSpeakerChange} variant="outlined">
                                        <MenuItem value="">Select a keynote speaker</MenuItem>
                                        {keynoteSpeakers.map((speaker) => (
                                            <MenuItem key={speaker.id} value={speaker.id}>{speaker.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {selectedKeynoteSpeaker && (
                                        <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                                            <Typography variant="h6" className="mb-2 font-medium">
                                                {keynoteSpeakers.find(s => s.id === selectedKeynoteSpeaker)?.name}
                                            </Typography>
                                            <TextField fullWidth size="small" label="Name" variant="outlined" sx={{ mt: 2 }} />
                                            <TextField fullWidth size="small" label="Position" variant="outlined" sx={{ mt: 2 }} />
                                            <TextField fullWidth size="small" label="Origin" variant="outlined" sx={{ mt: 2 }} />
                                            <Typography variant="subtitle2" sx={{ mt: 2, ml: 1.5 }}>Details:</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={3}
                                                style={{
                                                    width: "100%",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    padding: "8px"
                                                }}
                                            />
                                        </Paper>
                                    )}
                                    <Button variant="outlined" sx={{ mt: 2 }}>Add a Speaker</Button>
                                    <Button variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#930E24" } }}>
                                        Remove Speaker
                                    </Button>
                                </>
                            )}
                            {selectedPage === "Invited Speakers" && (
                                <>
                                    <Typography variant="subtitle1" sx={{ my: 2 }}>Speakers:</Typography>
                                    <Select fullWidth size="small" value={selectedInvitedSpeaker} onChange={handleInvitedSpeakerChange} variant="outlined">
                                        <MenuItem value="">Select an invited speaker</MenuItem>
                                        {invitedSpeakers.map((speaker) => (
                                            <MenuItem key={speaker.id} value={speaker.id}>{speaker.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {selectedInvitedSpeaker && (
                                        <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                                            <Typography variant="h6" className="mb-2 font-medium">
                                                {invitedSpeakers.find(s => s.id === selectedInvitedSpeaker)?.name}
                                            </Typography>
                                            <TextField fullWidth size="small" label="Name" variant="outlined" sx={{ mt: 2 }} />
                                            <TextField fullWidth size="small" label="Position" variant="outlined" sx={{ mt: 2 }} />
                                            <TextField fullWidth size="small" label="Origin" variant="outlined" sx={{ mt: 2 }} />
                                            <Typography variant="subtitle2" sx={{ mt: 2, ml: 1.5 }}>Details:</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={3}
                                                style={{
                                                    width: "100%",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "4px",
                                                    padding: "8px"
                                                }}
                                            />
                                        </Paper>
                                    )}
                                    <Button variant="outlined" sx={{ mt: 2 }}>Add a Speaker</Button>
                                    <Button variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#930E24" } }}>
                                        Remove Speaker
                                    </Button>
                                </>
                            )}
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
