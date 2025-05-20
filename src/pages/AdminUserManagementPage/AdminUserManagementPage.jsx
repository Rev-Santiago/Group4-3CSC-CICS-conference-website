import React, { useState, useEffect } from "react";
import { 
    IconButton, Menu, MenuItem, Dialog, DialogTitle, 
    DialogContent, DialogActions, Button, Snackbar, Alert,
    TextField, FormControl, InputLabel, Select, FormHelperText,
    useTheme, useMediaQuery, Box, Card, CardContent, 
    Typography, CircularProgress, Pagination, InputAdornment, Chip
} from "@mui/material";
import { MoreVert, Search, Person, Email, AdminPanelSettings, CalendarMonth } from "@mui/icons-material";
import axios from "axios";

export default function AdminUserManagementPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', title: '', message: '' });
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(6);
    const [addUserDialog, setAddUserDialog] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '', confirmPassword: '', account_type: 'admin' });
    const [formErrors, setFormErrors] = useState({});

    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
    const rowsPerPage = 10;

    // Menu handling
    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };
    
    const handleMenuClose = () => setAnchorEl(null);

    // Load users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${baseUrl}/api/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setUsers(response.data.users || []);
            setTotalUsers(response.data.count || 0);
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            showNotification('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle user actions
    const handleUserAction = async (action) => {
        if (!selectedUser) return;
        
        try {
            const token = localStorage.getItem('authToken');
            let url, message;
            
            if (action === 'promote') {
                url = `${baseUrl}/api/users/${selectedUser.id}/promote`;
                message = 'User promoted to Super Admin successfully';
            } else if (action === 'demote') {
                url = `${baseUrl}/api/users/${selectedUser.id}/demote`;
                message = 'User demoted to Admin successfully';
            } else if (action === 'remove') {
                url = `${baseUrl}/api/users/${selectedUser.id}`;
                await axios.delete(url, { headers: { 'Authorization': `Bearer ${token}` } });
                showNotification('User removed successfully');
                fetchUsers();
                setConfirmDialog({ ...confirmDialog, open: false });
                return;
            }
            
            await axios.post(url, {}, { headers: { 'Authorization': `Bearer ${token}` } });
            showNotification(message);
            fetchUsers();
            setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error) {
            console.error(`Error ${action} user:`, error);
            showNotification(error.response?.data?.error || `Failed to ${action} user`, 'error');
            setConfirmDialog({ ...confirmDialog, open: false });
        }
    };

    // Open confirmation dialog
    const openConfirmDialog = (type) => {
        const actionTypes = {
            promote: { title: 'Promote User', message: `Are you sure you want to promote ${selectedUser?.name || selectedUser?.email} to Super Admin?` },
            demote: { title: 'Demote User', message: `Are you sure you want to demote ${selectedUser?.name || selectedUser?.email} to regular Admin?` },
            remove: { title: 'Remove User', message: `Are you sure you want to remove ${selectedUser?.name || selectedUser?.email}? This action cannot be undone.` }
        };
        
        setConfirmDialog({
            open: true,
            type,
            ...actionTypes[type]
        });
        handleMenuClose();
    };

    // Show notification
    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Handle search and page change
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };
    
    const handlePageChange = (event, newPage) => setPage(newPage);

    // User dialog handlers
    const openAddUserDialog = () => setAddUserDialog(true);
    
    const closeAddUserDialog = () => {
        setAddUserDialog(false);
        setNewUser({ email: '', password: '', confirmPassword: '', account_type: 'admin' });
        setFormErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
        if (formErrors[name]) setFormErrors({ ...formErrors, [name]: null });
    };

    const validateForm = () => {
        const errors = {};
        
        if (!newUser.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = 'Email is invalid';
        
        if (!newUser.password) errors.password = 'Password is required';
        else if (newUser.password.length < 6) errors.password = 'Password must be at least 6 characters';
        
        if (!newUser.confirmPassword) errors.confirmPassword = 'Please confirm your password';
        else if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        
        if (!newUser.account_type) errors.account_type = 'Account type is required';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitNewUser = async () => {
        if (!validateForm()) return;
        
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${baseUrl}/api/users`, {
                email: newUser.email,
                password: newUser.password,
                account_type: newUser.account_type
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            showNotification('User created successfully');
            fetchUsers();
            closeAddUserDialog();
        } catch (error) {
            console.error('Error creating user:', error);
            showNotification(error.response?.data?.error || 'Failed to create user', 'error');
        }
    };

    // Filter and paginate users
    const filteredUsers = users.filter(user => 
        user.email?.toLowerCase().includes(search.toLowerCase()) || 
        (user.name && user.name.toLowerCase().includes(search.toLowerCase()))
    );

    const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredUsers.length / rowsPerPage));
    }, [filteredUsers]);

    // Improved User card for mobile view
    const UserCard = ({ user }) => (
        <Card sx={{ mb: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
                <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                        {user.name || user.email.split('@')[0]}
                    </Typography>
                    
                    <Box sx={{ mt: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Email fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AdminPanelSettings 
                                fontSize="small" 
                                color={user.account_type === 'super_admin' ? "success" : "primary"} 
                                sx={{ mr: 1 }} 
                            />
                            <Chip 
                                label={user.account_type === 'super_admin' ? 'Super Admin' : 'Admin'} 
                                size="small"
                                color={user.account_type === 'super_admin' ? 'success' : 'primary'}
                            />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarMonth fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Added: {formatDate(user.date_added)}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {user.account_type === 'admin' ? (
                            <Button 
                                size="small" 
                                variant="outlined" 
                                color="success" 
                                onClick={() => openConfirmDialog('promote')}
                                fullWidth
                            >
                                Promote
                            </Button>
                        ) : (
                            <Button 
                                size="small" 
                                variant="outlined" 
                                color="primary" 
                                onClick={() => openConfirmDialog('demote')}
                                fullWidth
                            >
                                Demote
                            </Button>
                        )}
                        <Button 
                            size="small" 
                            variant="outlined" 
                            color="error" 
                            onClick={() => openConfirmDialog('remove')}
                            fullWidth
                        >
                            Remove
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ py: 3, maxWidth: '1200px', mx: 'auto' }}>
            {/* Page Header */}
            <Card sx={{ p: 3, mb: 3, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>User Management Overview</Typography>
                        <Typography variant="body2" color="text.secondary">View, edit, and manage all users.</Typography>
                    </Box>
                    <Chip 
                        label="Role: Super Admin" 
                        size={isMobile ? "small" : "medium"}
                        sx={{ bgcolor: 'grey.100' }}
                    />
                </Box>
            </Card>

            {/* Main Table Card */}
            <Card sx={{ p: 3, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                {/* Header */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 3,
                    gap: 2
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        All users <Typography component="span" color="text.secondary">({totalUsers})</Typography>
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        width: isMobile ? '100%' : 'auto',
                        gap: 1
                    }}>
                        <TextField
                            placeholder="Search users..."
                            size="small"
                            value={search}
                            onChange={handleSearchChange}
                            sx={{ width: isMobile ? '100%' : '220px' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                            }}
                        />
                        <Button 
                            variant="contained"
                            onClick={openAddUserDialog}
                            startIcon={<Person />}
                            fullWidth={isMobile}
                            sx={{ bgcolor: '#B7152F', '&:hover': { bgcolor: '#871122' } }}
                        >
                            Add user
                        </Button>
                    </Box>
                </Box>

                {/* Content */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredUsers.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                        <Typography>No users found</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Mobile view for users */}
                        {isMobile ? (
                            <Box>
                                {paginatedUsers.map((user, idx) => (
                                    <UserCard key={user.id || idx} user={user} />
                                ))}
                            </Box>
                        ) : (
                            /* Desktop view - Responsive Table */
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ 
                                    width: '100%', 
                                    borderCollapse: 'collapse',
                                    fontSize: isTablet ? '0.875rem' : '1rem'
                                }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#B7152F', color: 'white' }}>
                                            <th style={{ padding: isTablet ? '8px' : '12px 16px', textAlign: 'left', width: isTablet ? '50%' : '40%' }}>
                                                User name
                                            </th>
                                            <th style={{ padding: isTablet ? '8px' : '12px 16px', textAlign: 'left', width: isTablet ? '30%' : '30%' }}>
                                                Role
                                            </th>
                                            <th style={{ padding: isTablet ? '8px' : '12px 16px', textAlign: 'left', width: isTablet ? '20%' : '20%' }}>
                                                Date added
                                            </th>
                                            <th style={{ width: '40px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedUsers.map((user, idx) => (
                                            <tr key={user.id || idx} style={{ 
                                                borderBottom: '1px solid #eee',
                                                backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white'
                                            }}>
                                                <td style={{ padding: isTablet ? '8px' : '12px 16px' }}>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {user.name || user.email.split('@')[0]}
                                                    </div>
                                                    <div style={{ fontSize: isTablet ? '0.75rem' : '0.875rem', color: '#666' }}>
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td style={{ padding: isTablet ? '8px' : '12px 16px' }}>
                                                    <Chip 
                                                        label={user.account_type === 'super_admin' ? 'Super Admin' : 'Admin'} 
                                                        size="small"
                                                        color={user.account_type === 'super_admin' ? 'success' : 'primary'}
                                                    />
                                                </td>
                                                <td style={{ 
                                                    padding: isTablet ? '8px' : '12px 16px',
                                                    fontSize: isTablet ? '0.75rem' : '0.875rem',
                                                    color: '#666'
                                                }}>
                                                    {formatDate(user.date_added)}
                                                </td>
                                                <td style={{ 
                                                    padding: isTablet ? '4px' : '8px',
                                                    textAlign: 'center'
                                                }}>
                                                    <IconButton onClick={(e) => handleMenuOpen(e, user)} size="small">
                                                        <MoreVert fontSize={isTablet ? 'small' : 'medium'} />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
                        )}
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                            siblingCount={isMobile ? 0 : 1}
                        />
                    </Box>
                )}
            </Card>

            {/* Menu for actions - Only for desktop */}
            {!isMobile && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {selectedUser?.account_type === 'admin' ? (
                        <MenuItem onClick={() => openConfirmDialog('promote')}>Promote to Super Admin</MenuItem>
                    ) : selectedUser?.account_type === 'super_admin' ? (
                        <MenuItem onClick={() => openConfirmDialog('demote')}>Demote to Admin</MenuItem>
                    ) : null}
                    <MenuItem onClick={() => openConfirmDialog('remove')}>Remove</MenuItem>
                </Menu>
            )}

            {/* Confirmation Dialog */}
            <Dialog 
                open={confirmDialog.open} 
                onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle sx={{ bgcolor: '#B7152F', color: 'white' }}>{confirmDialog.title}</DialogTitle>
                <DialogContent sx={{ pt: 2, mt: 1 }}><Typography>{confirmDialog.message}</Typography></DialogContent>
                <DialogActions sx={{ p: 2, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
                    <Button 
                        onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
                        variant="outlined"
                        fullWidth={isMobile}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained"
                        fullWidth={isMobile}
                        onClick={() => handleUserAction(confirmDialog.type)}
                        sx={{ bgcolor: '#B7152F', '&:hover': { bgcolor: '#871122' } }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog 
                open={addUserDialog} 
                onClose={closeAddUserDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ bgcolor: '#B7152F', color: 'white' }}>Add New User</DialogTitle>
                <DialogContent sx={{ pt: 2, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Create a new user account. All users will receive login details via email.
                    </Typography>
                    <TextField
                        autoFocus
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newUser.email}
                        onChange={handleInputChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment>
                        }}
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newUser.password}
                        onChange={handleInputChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password || "Must be at least 6 characters"}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newUser.confirmPassword}
                        onChange={handleInputChange}
                        error={!!formErrors.confirmPassword}
                        helperText={formErrors.confirmPassword}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="account-type-label">Account Type</InputLabel>
                        <Select
                            labelId="account-type-label"
                            name="account_type"
                            value={newUser.account_type}
                            label="Account Type"
                            onChange={handleInputChange}
                            startAdornment={<InputAdornment position="start"><AdminPanelSettings fontSize="small" /></InputAdornment>}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="super_admin">Super Admin</MenuItem>
                        </Select>
                        <FormHelperText>Choose the user's role in the system</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
                    <Button variant="outlined" onClick={closeAddUserDialog} fullWidth={isMobile}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSubmitNewUser} 
                        fullWidth={isMobile}
                        sx={{ bgcolor: '#B7152F', '&:hover': { bgcolor: '#871122' } }}
                    >
                        Create User
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setNotification({ ...notification, open: false })} 
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}