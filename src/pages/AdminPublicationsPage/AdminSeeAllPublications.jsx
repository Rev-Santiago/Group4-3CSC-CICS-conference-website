// AdminSeeAllPublications.jsx
import { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Menu, MenuItem, CircularProgress, Typography, Snackbar, Alert,
    Button, Pagination, Box, TextField, InputAdornment, useTheme, useMediaQuery
} from "@mui/material";
import { MoreVert, Search, Link as LinkIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminSeeAllPublications = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
                <Typography variant={isMobile ? "subtitle1" : "h6"} color="textSecondary">
                    No publications found
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="p-1 sm:p-2">
            {/* Search Bar */}
            <Box mb={isMobile ? 1 : 2} mt={isMobile ? 1 : 2}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    placeholder="Search by title or date..."
                    value={search}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize={isMobile ? "small" : "medium"} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer component={Paper} sx={{
                mt: isMobile ? 2 : 3,
                width: "100%",
                overflowX: "auto",
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                <Table sx={{ minWidth: isMobile ? 500 : 700 }} size={isMobile ? "small" : "medium"}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#B7152F" }}>
                            <TableCell sx={{ 
                                color: "white", 
                                fontWeight: "bold", 
                                borderRight: "1px solid rgba(255,255,255,0.2)",
                                padding: isMobile ? 1 : 2,
                                fontSize: isMobile ? '0.75rem' : 'inherit'
                            }}>
                                Date
                            </TableCell>
                            <TableCell sx={{ 
                                color: "white", 
                                fontWeight: "bold", 
                                borderRight: "1px solid rgba(255,255,255,0.2)",
                                padding: isMobile ? 1 : 2,
                                fontSize: isMobile ? '0.75rem' : 'inherit'
                            }}>
                                Title
                            </TableCell>
                            <TableCell sx={{ 
                                color: "white", 
                                fontWeight: "bold", 
                                borderRight: "1px solid rgba(255,255,255,0.2)",
                                padding: isMobile ? 1 : 2,
                                fontSize: isMobile ? '0.75rem' : 'inherit'
                            }}>
                                Link
                            </TableCell>
                            <TableCell sx={{ 
                                color: "white", 
                                fontWeight: "bold", 
                                width: isMobile ? "50px" : "70px",
                                padding: isMobile ? 1 : 2,
                                fontSize: isMobile ? '0.75rem' : 'inherit'
                            }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPublications.map((publication, index) => (
                            <TableRow key={index} hover>
                                <TableCell sx={{ 
                                    borderRight: "1px solid #eee",
                                    padding: isMobile ? 1 : 2,
                                    fontSize: isMobile ? '0.75rem' : 'inherit'
                                }}>
                                    {publication.date}
                                </TableCell>
                                <TableCell sx={{ 
                                    borderRight: "1px solid #eee",
                                    padding: isMobile ? 1 : 2,
                                    fontSize: isMobile ? '0.75rem' : 'inherit'
                                }}>
                                    {publication.title}
                                </TableCell>
                                <TableCell sx={{ 
                                    borderRight: "1px solid #eee",
                                    padding: isMobile ? 1 : 2,
                                    fontSize: isMobile ? '0.75rem' : 'inherit'
                                }}>
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
                                <TableCell align="center" sx={{ padding: isMobile ? 0.5 : 1 }}>
                                    <IconButton 
                                        onClick={(e) => handleMenuOpen(e, publication)} 
                                        size="small"
                                    >
                                        <MoreVert fontSize={isMobile ? "small" : "medium"} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={isMobile ? 2 : 3} mb={isMobile ? 1 : 0}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        color="primary" 
                        onChange={handlePageChange} 
                        size={isMobile ? "small" : "medium"}
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
