import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Menu, MenuItem, CircularProgress, Typography, Snackbar, Alert,
  Button, Pagination, Box, TextField, InputAdornment
} from "@mui/material";
import { MoreVert, Search, Link as LinkIcon } from "@mui/icons-material";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const AdminSeeAllEvent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const rowsPerPage = 10;

  const handleMenuOpen = (event, eventData) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/api/schedule`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: rowsPerPage }
      });

      // Transform the data to match our table structure
      const formattedEvents = [];
      
      if (response.data && response.data.data) {
        response.data.data.forEach(dayData => {
          dayData.events.forEach(event => {
            formattedEvents.push({
              // Only use a numeric ID if it exists in the data
              id: event.id || null, 
              // Include date + time as a composite identifier
              dateTime: `${dayData.date}-${event.time}`,
              program: event.program,
              date: dayData.date,
              time: event.time,
              venue: event.venue,
              speaker: event.speaker,
              category: event.category,
              online_room_link: event.online_room_link
            });
          });
        });
      }
      
      setEvents(formattedEvents);
      
      // Set total pages
      if (response.data && response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      } else {
        setTotalPages(Math.ceil(formattedEvents.length / rowsPerPage));
      }
      
    } catch (error) {
      console.error("Error fetching events:", error);
      setNotification({
        open: true,
        message: "Failed to load events",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

// Updated handleDelete function for AdminSeeAllEvents.jsx

const handleDelete = async () => {
  handleMenuClose();
  
  if (!selectedEvent) return;
  
  // Confirm before deletion
  if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
  }
  
  try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
          setNotification({
              open: true,
              message: "Authentication error: No token found",
              severity: "error"
          });
          return;
      }
      
      // Set loading state
      setLoading(true);
      
      // We need to use the proper ID to delete the event
      // This is the issue - we're missing the ID in some cases
      // Let's improve the code to handle both direct ID and composite ID cases
      
      if (!selectedEvent.id) {
          setNotification({
              open: true,
              message: "Cannot delete this event - missing event ID",
              severity: "error"
          });
          return;
      }
      
      // Make the delete request
      await axios.delete(`${BACKEND_URL}/api/events/${selectedEvent.id}`, {
          headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from list and update UI
      setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEvent.id));
      
      setNotification({
          open: true,
          message: "Event deleted successfully",
          severity: "success"
      });
      
      // Refresh the list after deletion
      fetchEvents();
      
  } catch (error) {
      console.error("Error deleting event:", error);
      setNotification({
          open: true,
          message: error.response?.data?.error || "Failed to delete event. Check console for details.",
          severity: "error"
      });
  } finally {
      setLoading(false);
  }
};

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1); // Reset to first page
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredEvents = events.filter(event =>
    (event.program?.toLowerCase().includes(search.toLowerCase()) ||
    event.date?.toLowerCase().includes(search.toLowerCase()) ||
    event.speaker?.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedEvents = filteredEvents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  // Render empty state
  if (events.length === 0 && !loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography variant="h6" color="textSecondary">
          No events found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={2} mt={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title, date, or speaker..."
          size="small"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{
        mt: 3,
        width: "100%",
        overflowX: "auto",
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#B7152F" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Time</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Program</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Venue</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Speaker</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Category</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Link</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", width: "70px" }}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedEvents.map((event, index) => (
              <TableRow key={event.id || event.dateTime || index} hover>
                <TableCell sx={{ borderRight: "1px solid #eee" }}>
                  {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #eee" }}>{event.time || "N/A"}</TableCell>
                <TableCell sx={{ borderRight: "1px solid #eee" }}>{event.program || "N/A"}</TableCell>
                <TableCell sx={{ borderRight: "1px solid #eee" }}>{event.venue || "N/A"}</TableCell>
                <TableCell sx={{ borderRight: "1px solid #eee" }}>{event.speaker || "N/A"}</TableCell>
                <TableCell sx={{ borderRight: "1px solid #eee" }}>{event.category || "N/A"}</TableCell>
                <TableCell sx={{ borderRight: "1px solid #eee" }}>
                  {event.online_room_link ? (
                    <Button 
                      startIcon={<LinkIcon />} 
                      size="small" 
                      onClick={() => window.open(event.online_room_link, '_blank')}
                    >
                      Join
                    </Button>
                  ) : "None"}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => handleMenuOpen(e, event)} size="small">
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination 
            count={totalPages} 
            page={page} 
            color="primary" 
            onChange={handlePageChange} 
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
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSeeAllEvent;
