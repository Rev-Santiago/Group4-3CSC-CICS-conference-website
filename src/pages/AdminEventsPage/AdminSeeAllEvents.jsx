import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Menu, MenuItem, CircularProgress, Typography, Snackbar, Alert,
  Button, Pagination, Box, TextField, InputAdornment, Card, CardContent,
  useMediaQuery, useTheme, Divider, Chip, Stack
} from "@mui/material";
import { MoreVert, Search, Link as LinkIcon, Event, Person, Category, Place } from "@mui/icons-material";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const AdminSeeAllEvent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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

  const handleDelete = async () => {
    handleMenuClose();

    if (!selectedEvent) return;

    // Confirm before deletion
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      // Use a new endpoint specifically for deleting events by date and time
      await axios.delete(`${BACKEND_URL}/api/events-by-criteria`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          program: selectedEvent.program,
          date: selectedEvent.date,
          time: selectedEvent.time
        }
      });

      // Remove from list
      setEvents(prevEvents => prevEvents.filter(event =>
        !(event.date === selectedEvent.date &&
          event.time === selectedEvent.time &&
          event.program === selectedEvent.program)
      ));

      setNotification({
        open: true,
        message: "Event deleted successfully",
        severity: "success"
      });

    } catch (error) {
      console.error("Error deleting event:", error);

      // Check if this is a "not implemented" error
      if (error.response?.status === 404 ||
        error.response?.status === 501 ||
        error.response?.data?.error?.includes("not implemented")) {
        setNotification({
          open: true,
          message: "Event deletion by criteria is not implemented. Please use the edit interface to delete events.",
          severity: "info"
        });
      } else {
        setNotification({
          open: true,
          message: error.response?.data?.error || "Failed to delete event",
          severity: "error"
        });
      }
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

  // Mobile card view component for each event
  const EventCard = ({ event }) => (
    <Card sx={{ mb: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
          {event.program || "Untitled Event"}
        </Typography>
        
        <Box sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Event fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {event.date ? new Date(event.date).toLocaleDateString() : "No date"} at {event.time || "No time"}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Place fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {event.venue || "No venue"}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Person fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {event.speaker || "No speaker"}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Category fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {event.category || "Uncategorized"}
            </Typography>
          </Stack>
        </Box>
        
        {event.online_room_link && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<LinkIcon />}
            onClick={() => window.open(event.online_room_link, '_blank')}
            sx={{ mt: 1 }}
            fullWidth
          >
            Join Meeting
          </Button>
        )}
      </CardContent>
    </Card>
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

      {/* Conditional rendering based on screen size */}
      {isMobile ? (
        // Mobile view - cards
        <Box sx={{ mt: 2 }}>
          {paginatedEvents.map((event, index) => (
            <EventCard key={event.id || event.dateTime || index} event={event} />
          ))}
        </Box>
      ) : (
        // Desktop view - table
        <TableContainer component={Paper} sx={{
          mt: 3,
          width: "100%",
          overflowX: "auto",
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <Table sx={{ minWidth: isTablet ? 650 : 700 }} size={isTablet ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#B7152F" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Date</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Time</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Program</TableCell>
                {!isTablet && (
                  <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Venue</TableCell>
                )}
                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Speaker</TableCell>
                {!isTablet && (
                  <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Category</TableCell>
                )}
                <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Link</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedEvents.map((event, index) => (
                <TableRow key={event.id || event.dateTime || index} hover>
                  <TableCell sx={{ borderRight: "1px solid #eee" }}>
                    {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #eee" }}>{event.time || "N/A"}</TableCell>
                  <TableCell sx={{ borderRight: "1px solid #eee", fontSize: isTablet ? "0.7rem" : "0.75rem" }}>
                    {event.program || "N/A"}
                  </TableCell>
                  {!isTablet && (
                    <TableCell sx={{ borderRight: "1px solid #eee" }}>{event.venue || "N/A"}</TableCell>
                  )}
                  <TableCell sx={{ borderRight: "1px solid #eee" }}>{event.speaker || "N/A"}</TableCell>
                  {!isTablet && (
                    <TableCell sx={{ borderRight: "1px solid #eee" }}>{event.category || "N/A"}</TableCell>
                  )}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            color="primary"
            onChange={handlePageChange}
            size={isMobile ? "small" : "medium"}
            siblingCount={isMobile ? 0 : 1}
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
