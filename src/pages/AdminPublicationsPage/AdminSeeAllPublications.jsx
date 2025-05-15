import { useState, useEffect, useRef } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, CircularProgress, Typography, Snackbar, Alert,
    Button, Pagination, Box, TextField, InputAdornment, useTheme, useMediaQuery,
    Card, CardContent, Stack, ClickAwayListener
} from "@mui/material";
import { MoreVert, Search, Link as LinkIcon, CalendarToday } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';

// Custom Menu component rendered directly to body to avoid positioning issues
const CustomDropdownMenu = ({ position, onClose, onDelete }) => {
    if (!position) return null;
    
    return ReactDOM.createPortal(
        <ClickAwayListener onClickAway={onClose}>
            <div 
                style={{
                    position: 'fixed',
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    zIndex: 9999,
                    backgroundColor: 'white',
                    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    minWidth: '120px',
                    overflow: 'hidden'
                }}
            >
                <div 
                    onClick={onDelete}
                    style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background-color 0.2s',
                        userSelect: 'none'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    Delete
                </div>
            </div>
        </ClickAwayListener>,
        document.body
    );
};

const AdminSeeAllPublications = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuPosition, setMenuPosition] = useState(null);
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
    const rowsPerPage = 10;

    // Fetch publications on component mount and when page changes
    useEffect(() => {
        fetchPublications();
    }, [page]);

    const fetchPublications = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
            console.log("Admin - Fetching publications from:", `${baseUrl}/api/publications-admin`);
            
            const response = await axios.get(`${baseUrl}/api/publications-admin`, {
                params: { page, limit: rowsPerPage },
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Log the raw API response
            console.log("Admin - Raw API Response:", response.data);
            
            // Log the specific publications array
            console.log("Admin - Raw publications array:", response.data.publications);
            
            const formattedPublications = response.data.publications.map(pub => {
                // Log each raw publication
                console.log("Admin - Processing publication:", pub);
                console.log("Admin - Publication link:", pub.publication_link, "Type:", typeof pub.publication_link);
                
                return {
                    id: pub.id,
                    date: new Date(pub.publication_date).toLocaleDateString(),
                    rawDate: pub.publication_date,
                    title: pub.publication_description,
                    link: pub.publication_link
                };
            });
            
            // Log the formatted publications
            console.log("Admin - Formatted publications:", formattedPublications);
            
            setPublications(formattedPublications);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Admin - Error fetching publications:", error);
            if (error.response) {
                console.error("Admin - Error response data:", error.response.data);
                console.error("Admin - Error response status:", error.response.status);
            }
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

    // Helper function to check if link exists and is valid
    const hasValidLink = (publication) => {
        const isValid = publication.link && 
               typeof publication.link === 'string' && 
               publication.link.trim() !== '';
        
        // Log link validation
        console.log(`Admin - Publication "${publication.title}" has valid link: ${isValid}, Link: ${publication.link}`);
        
        return isValid;
    };

    const handleMenuOpen = (event, publication) => {
        // Stop event propagation to prevent any parent handlers from firing
        event.stopPropagation();
        event.preventDefault();
        
        // Get the position of the clicked button
        const rect = event.currentTarget.getBoundingClientRect();
        
        // Calculate position considering viewport constraints
        // Keep menu within viewport bounds on right and bottom edges
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Default positioning
        let left = rect.right - 120; // Position menu to the left of the right edge of button
        let top = rect.bottom + 5; // Position menu below button with small gap
        
        // Adjust if would go off right edge
        if (left + 120 > viewportWidth) {
            left = viewportWidth - 130;
        }
        
        // Adjust if would go off bottom edge
        if (top + 50 > viewportHeight) {
            top = rect.top - 50; // Position above the button instead
        }
        
        // Make sure we don't go off left edge either
        if (left < 10) {
            left = 10;
        }
        
        setMenuPosition({ top, left });
        setSelectedPublication(publication);
    };

    const handleMenuClose = () => {
        setMenuPosition(null);
        setSelectedPublication(null);
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
        
        // Confirm before deletion
        if (!window.confirm("Are you sure you want to delete this publication?")) {
            return;
        }
        
        try {
            const token = getAuthToken();
            const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
            await axios.delete(`${baseUrl}/api/publications/${selectedPublication.id}`, {
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
        setPage(1); // Reset to first page when searching
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    // Filter publications based on search term
    const filteredPublications = publications.filter(
        pub => pub.title.toLowerCase().includes(search.toLowerCase()) || 
               pub.date.includes(search)
    );

    // Paginate the filtered publications
    const paginatedPublications = filteredPublications.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    // Mobile card view component for each publication
    const PublicationCard = ({ publication }) => {
        // Log card rendering and link info
        console.log("Admin - Rendering publication card:", publication);
        console.log("Admin - Card link:", publication.link);
        
        return (
            <Card sx={{ mb: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" component="div" sx={{ fontSize: '1rem', fontWeight: 'bold', flex: 1 }}>
                            {publication.title || "Untitled Publication"}
                        </Typography>
                        
                        <IconButton 
                            onClick={(e) => handleMenuOpen(e, publication)}
                            size="small"
                            sx={{ p: 0.5 }}
                        >
                            <MoreVert fontSize="small" />
                        </IconButton>
                    </Box>
                    
                    <Box sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                {publication.date || "No date"}
                            </Typography>
                        </Stack>
                    </Box>
                    
                    {hasValidLink(publication) && (
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<LinkIcon />}
                            onClick={() => window.open(publication.link, '_blank')}
                            sx={{ mt: 1 }}
                            fullWidth
                        >
                            View Publication
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    };

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

            {/* Conditional rendering based on screen size */}
            {isMobile ? (
                // Mobile view - cards
                <Box sx={{ mt: 2 }}>
                    {paginatedPublications.map((publication, index) => (
                        <PublicationCard key={publication.id || index} publication={publication} />
                    ))}
                </Box>
            ) : (
                // Desktop view - table
                <TableContainer component={Paper} sx={{
                    mt: isMobile ? 2 : 3,
                    width: "100%",
                    overflowX: "auto",
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                    <Table sx={{ minWidth: isTablet ? 500 : 700 }} size={isMobile ? "small" : "medium"}>
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
                                }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedPublications.map((publication, index) => {
                                // Log table row rendering
                                console.log(`Admin - Table row ${index} link:`, publication.link);
                                return (
                                    <TableRow key={publication.id || index} hover>
                                        <TableCell sx={{ 
                                            borderRight: "1px solid #eee",
                                            padding: isTablet ? 1 : 2,
                                            fontSize: isTablet ? '0.75rem' : 'inherit'
                                        }}>
                                            {publication.date}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: "1px solid #eee",
                                            padding: isTablet ? 1 : 2,
                                            fontSize: isTablet ? '0.75rem' : 'inherit'
                                        }}>
                                            {publication.title}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: "1px solid #eee",
                                            padding: isTablet ? 1 : 2,
                                            fontSize: isTablet ? '0.75rem' : 'inherit'
                                        }}>
                                            {hasValidLink(publication) ? (
                                                <Button 
                                                    startIcon={<LinkIcon />} 
                                                    size="small" 
                                                    onClick={() => window.open(publication.link, '_blank')}
                                                >
                                                    View
                                                </Button>
                                            ) : "None"}
                                        </TableCell>
                                        <TableCell align="center" sx={{ padding: isTablet ? 0.5 : 1 }}>
                                            <IconButton 
                                                onClick={(e) => handleMenuOpen(e, publication)} 
                                                size="small"
                                            >
                                                <MoreVert fontSize={isTablet ? "small" : "medium"} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={isMobile ? 2 : 3} mb={isMobile ? 1 : 0}>
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

            {/* Custom Menu Dropdown */}
            <CustomDropdownMenu 
                position={menuPosition}
                onClose={handleMenuClose}
                onDelete={handleDelete}
            />

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