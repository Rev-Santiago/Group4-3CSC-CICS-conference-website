import { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Menu, MenuItem, CircularProgress, Typography, Snackbar, Alert,
    Button, Pagination, Box, TextField, InputAdornment
} from "@mui/material";
import { MoreVert, Search, Link as LinkIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminSeeAllPublications = () => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPublication, setSelectedPublication] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    
    const navigate = useNavigate();

    // Fetch publications on component mount and when page changes
    useEffect(() => {
        fetchPublications();
    }, [page]);

    const fetchPublications = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await axios.get("/api/publications-admin", {
                params: { page, limit: 10 },
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const formattedPublications = response.data.publications.map(pub => ({
                id: pub.id,
                date: new Date(pub.publication_date).toLocaleDateString(),
                rawDate: pub.publication_date,
                title: pub.publication_description,
                link: pub.publication_link
            }));
            
            setPublications(formattedPublications);
            setTotalPages(response.data.totalPages || 1);
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

    const handleMenuOpen = (event, publication) => {
        setAnchorEl(event.currentTarget);
        setSelectedPublication(publication);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleEdit = () => {
        // Store the publication ID for the edit page
        localStorage.setItem('editPublicationId', selectedPublication.id);
        handleMenuClose();
        
        // Navigate to the edit tab in AdminPublicationsPage
        navigate('/admin/publications/edit');
        
        // Alternatively, you can emit an event to parent component
        // to switch to Edit tab and load the selected publication
        window.dispatchEvent(new CustomEvent('editPublication', {
            detail: { id: selectedPublication.id }
        }));
    };

    const handleDelete = async () => {
        handleMenuClose();
        
        try {
            const token = getAuthToken();
            await axios.delete(`/api/publications/${selectedPublication.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Remove from list
            setPublications(publications.filter(pub => pub.id !== selectedPublication.id));
            setNotification({
                open: true,
                message: "Publication deleted successfully",
                severity: "success"
            });
        } catch (error) {
            console.error("Error deleting publication:", error);
            setNotification({
                open: true,
                message: error.response?.data?.error || "Failed to delete publication",
                severity: "error"
            });
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    // Filter publications based on search term
    const filteredPublications = publications.filter(
        pub => pub.title.toLowerCase().includes(search.toLowerCase()) || 
               pub.date.includes(search)
    );

    // Render loading state or empty state
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (publications.length === 0 && !loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <Typography variant="h6" color="textSecondary">
                    No publications found
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Search Bar */}
            <Box mb={2} mt={2}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search by title or date..."
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
                            <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Title</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>Link</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold", width: "70px" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPublications.map((publication, index) => (
                            <TableRow key={index} hover>
                                <TableCell sx={{ borderRight: "1px solid #eee" }}>{publication.date}</TableCell>
                                <TableCell sx={{ borderRight: "1px solid #eee" }}>{publication.title}</TableCell>
                                <TableCell sx={{ borderRight: "1px solid #eee" }}>
                                    {publication.link ? (
                                        <Button 
                                            startIcon={<LinkIcon />} 
                                            size="small" 
                                            onClick={() => window.open(publication.link, '_blank')}
                                        >
                                            View
                                        </Button>
                                    ) : "None"}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={(e) => handleMenuOpen(e, publication)} size="small">
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

export default AdminSeeAllPublications;