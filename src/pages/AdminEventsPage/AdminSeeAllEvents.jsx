import { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Menu, MenuItem
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

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

const AdminSeeAllEvent = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleMenuOpen = (event, eventData) => {
        setAnchorEl(event.currentTarget);
        setSelectedEvent(eventData);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedEvent(null);
    };

    return (
        <TableContainer component={Paper} sx={{
            mt: 3,
            width: "100%",
            overflowX: "auto",
            maxWidth: "100vw"
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
    );
};

export default AdminSeeAllEvent;