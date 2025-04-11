import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Menu, MenuItem, TextField, Box, Pagination, Typography
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const AdminSeeAllEvent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const handleMenuOpen = (event, eventData) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(`${BACKEND_URL}/api/admin_event_preview`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(response.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.date?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedEvents = filteredEvents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box mt={3}>
      <Typography variant="h6" mb={2}>All Events Overview</Typography>

      <TextField
        fullWidth
        placeholder="Search by title or date..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reset to first page
        }}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#B7152F" }}>
              {["Title", "Date", "Time", "Venue", "Speakers", "Theme", "Category", ""].map((head, idx) => (
                <TableCell
                  key={idx}
                  sx={{ color: "white", fontWeight: "bold", borderRight: idx !== 7 ? "1px solid #eee" : "" }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No events found</TableCell>
              </TableRow>
            ) : (
              paginatedEvents.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>{event.speakers}</TableCell>
                  <TableCell>{event.theme}</TableCell>
                  <TableCell>{event.category}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, event)} size="small">
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {filteredEvents.length > rowsPerPage && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredEvents.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* MoreVert Dropdown Menu */}
      <Menu
        PaperProps={{ sx: { boxShadow: 3 } }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { console.log("Edit", selectedEvent); handleMenuClose(); }}>Edit</MenuItem>
        <MenuItem onClick={() => { console.log("Delete", selectedEvent); handleMenuClose(); }}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminSeeAllEvent;
