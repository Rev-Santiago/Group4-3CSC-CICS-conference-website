import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  Grid
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import axios from "axios";

const AdminDeletePublication = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedPublication, setSelectedPublication] = useState("");
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch publications on component mount
  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get("/api/publications-admin", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Format publications for display
      const formattedPublications = response.data.publications.map(pub => ({
        id: pub.id,
        title: pub.publication_description,
        date: new Date(pub.publication_date).toLocaleDateString()
      }));
      
      setPublications(formattedPublications);
    } catch (error) {
      console.error("Error fetching publications:", error);
      setNotification({
        open: true,
        message: "Failed to load publications",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const handlePublicationChange = (event) => {
    setSelectedPublication(event.target.value);
  };

  const openConfirmDialog = () => {
    if (!selectedPublication) {
      setNotification({
        open: true,
        message: "Please select a publication to delete",
        severity: "warning"
      });
      return;
    }
    setConfirmDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedPublication) return;
    
    setLoading(true);
    try {
      const token = getAuthToken();
      await axios.delete(`/api/publications/${selectedPublication}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from list
      setPublications(publications.filter(pub => pub.id !== selectedPublication));
      setSelectedPublication("");
      setNotification({
        open: true,
        message: "Publication deleted successfully",
        severity: "success"
      });
      setConfirmDialog(false);
    } catch (error) {
      console.error("Error deleting publication:", error);
      setNotification({
        open: true,
        message: error.response?.data?.error || "Failed to delete publication",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Find the selected publication object
  const selectedObj = publications.find(pub => pub.id === selectedPublication);

  return (
    <Box className="p-2 sm:p-4">
      <Grid container spacing={isTablet ? 1 : 2}>
        <Grid item xs={12}>
          <Typography variant={isMobile ? "subtitle2" : "subtitle1"} sx={{ mb: 1 }}>
            Select a Publication to Delete
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <Select
              value={selectedPublication}
              onChange={handlePublicationChange}
              displayEmpty
              disabled={loading || publications.length === 0}
              sx={{ mb: 2 }}
              renderValue={(selected) => {
                if (!selected) return <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Select Publication</span>;
                const pub = publications.find(p => p.id === selected);
                return pub ? `${pub.title} (${pub.date})` : '';
              }}
            >
              {publications.length > 0 ? (
                publications.map(pub => (
                  <MenuItem key={pub.id} value={pub.id}>
                    {pub.title} ({pub.date})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No publications available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        {selectedObj && (
          <Grid item xs={12}>
            <Typography sx={{ mb: 2, fontWeight: 'bold', color: '#B7152F' }}>
              Selected: {selectedObj.title}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12} className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2 mt-2 ${isMobile ? 'justify-center' : 'justify-end'}`}>
          <Button
            variant="contained"
            onClick={openConfirmDialog}
            disabled={!selectedPublication || loading}
            startIcon={<DeleteOutline />}
            color="error"
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
            sx={{ backgroundColor: "#B7152F", color: "white", '&:hover': { backgroundColor: "#930E24" } }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Delete Publication"}
          </Button>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the publication:
            {selectedObj && <strong> "{selectedObj.title}"</strong>}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} color="primary" size={isMobile ? "small" : "medium"}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" size={isMobile ? "small" : "medium"}>
            {loading ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default AdminDeletePublication;
