import { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Menu, MenuItem
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

const events = [
    {   
        date: "2024-07-15",
        title: "Exploring AI in Healthcare: Innovations and Challenges",
    },
    {   
        date: "2024-08-20",
        title: "Exploring AI in Healthcare: Innovations and Challenges",
    }
];

const AdminSeeAllPublications = () => {
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
                        <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid #000" }}>Date</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid #000" }}>Title</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid #000" }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ borderRight: "1px solid #000" }}>{event.date}</TableCell>
                            <TableCell sx={{ borderRight: "1px solid #000" }}>{event.title}</TableCell>     
                            <TableCell>
                                <IconButton onClick={(e) => handleMenuOpen(e, event)} size="small">
                                    <MoreVert />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* MoreVert Dropdown Menu */}
            <Menu PaperProps={{
                sx: { boxShadow: 3 },
            }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { console.log("Edit", selectedEvent); handleMenuClose(); }}>Edit</MenuItem>
                <MenuItem onClick={() => { console.log("Delete", selectedEvent); handleMenuClose(); }}>Delete</MenuItem>
            </Menu>
        </TableContainer>
    );
};

export default AdminSeeAllPublications;