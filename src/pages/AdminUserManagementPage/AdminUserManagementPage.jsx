import React, { useState, useEffect } from "react";
import { 
    IconButton, 
    Menu, 
    MenuItem, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Snackbar, 
    Alert,
    TextField,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    useTheme
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";

export default function AdminUserManagementPage() {
    const theme = useTheme();
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    
    // Check screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth < 768 && window.innerWidth >= 640);
        };
        
        // Initial check
        checkScreenSize();
        
        // Add resize listener
        window.addEventListener('resize', checkScreenSize);
        
        // Clean up
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', title: '', message: '' });
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [search, setSearch] = useState('');
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(6); // This would be calculated from API response
    
    // New state for add user dialog
    const [addUserDialog, setAddUserDialog] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        account_type: 'admin'
    });
    const [formErrors, setFormErrors] = useState({});

    // Get the base URL
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

    // Menu handling
    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Load users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            console.log("Using token:", token ? "Token exists" : "No token");
            
            const response = await axios.get(`${baseUrl}/api/users`, {
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log("API response:", response.data);
            setUsers(response.data.users || []);
            setTotalUsers(response.data.count || 0);
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            showNotification('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle promote user
    const handlePromoteUser = async () => {
        if (!selectedUser) return;
        
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${baseUrl}/api/users/${selectedUser.id}/promote`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            showNotification('User promoted to Super Admin successfully');
            fetchUsers(); // Refresh the list
            setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error) {
            console.error('Error promoting user:', error);
            showNotification(error.response?.data?.error || 'Failed to promote user', 'error');
            setConfirmDialog({ ...confirmDialog, open: false });
        }
    };

    // Handle demote user
    const handleDemoteUser = async () => {
        if (!selectedUser) return;
        
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${baseUrl}/api/users/${selectedUser.id}/demote`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            showNotification('User demoted to Admin successfully');
            fetchUsers(); // Refresh the list
            setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error) {
            console.error('Error demoting user:', error);
            showNotification(error.response?.data?.error || 'Failed to demote user', 'error');
            setConfirmDialog({ ...confirmDialog, open: false });
        }
    };

    // Handle remove user
    const handleRemoveUser = async () => {
        if (!selectedUser) return;
        
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`${baseUrl}/api/users/${selectedUser.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            showNotification('User removed successfully');
            fetchUsers(); // Refresh the list
            setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error) {
            console.error('Error removing user:', error);
            showNotification(error.response?.data?.error || 'Failed to remove user', 'error');
            setConfirmDialog({ ...confirmDialog, open: false });
        }
    };

    // Open confirmation dialog
    const openConfirmDialog = (type) => {
        if (type === 'promote') {
            setConfirmDialog({
                open: true,
                type: 'promote',
                title: 'Promote User',
                message: `Are you sure you want to promote ${selectedUser?.name || selectedUser?.email} to Super Admin?`
            });
        } else if (type === 'demote') {
            setConfirmDialog({
                open: true,
                type: 'demote',
                title: 'Demote User',
                message: `Are you sure you want to demote ${selectedUser?.name || selectedUser?.email} to regular Admin?`
            });
        } else if (type === 'remove') {
            setConfirmDialog({
                open: true,
                type: 'remove',
                title: 'Remove User',
                message: `Are you sure you want to remove ${selectedUser?.name || selectedUser?.email}? This action cannot be undone.`
            });
        }
        handleMenuClose();
    };

    // Show notification
    const showNotification = (message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // Change page handler
    const handlePageChange = (newPage) => {
        setPage(newPage);
        // Here you would fetch new page of data from API
    };

    // NEW HANDLERS FOR ADD USER DIALOG
    const openAddUserDialog = () => {
        setAddUserDialog(true);
    };

    const closeAddUserDialog = () => {
        setAddUserDialog(false);
        // Reset form data and errors
        setNewUser({
            email: '',
            password: '',
            confirmPassword: '',
            account_type: 'admin'
        });
        setFormErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value
        });
        
        // Clear the error for this field when it's changed
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        
        // Email validation
        if (!newUser.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
            errors.email = 'Email is invalid';
        }
        
        // Password validation
        if (!newUser.password) {
            errors.password = 'Password is required';
        } else if (newUser.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        // Confirm password validation
        if (!newUser.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (newUser.password !== newUser.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        // Account type validation
        if (!newUser.account_type) {
            errors.account_type = 'Account type is required';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitNewUser = async () => {
        if (!validateForm()) return;
        
        try {
            const token = localStorage.getItem('authToken');
            console.log("Sending request with token:", token ? "Token exists" : "No token");
            
            const response = await axios.post(`${baseUrl}/api/users`, {
                email: newUser.email,
                password: newUser.password,
                account_type: newUser.account_type
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            console.log("Create user response:", response.data);
            showNotification('User created successfully');
            fetchUsers(); // Refresh the list
            closeAddUserDialog();
        } catch (error) {
            console.error('Error creating user:', error);
            // More detailed error logging
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
                showNotification(error.response.data?.error || 'Failed to create user', 'error');
            } else if (error.request) {
                console.error('Error request:', error.request);
                showNotification('No response received from server', 'error');
            } else {
                console.error('Error message:', error.message);
                showNotification('Error preparing request: ' + error.message, 'error');
            }
        }
    };

    // Filter users based on search
    const filteredUsers = users.filter(user => 
        user.email?.toLowerCase().includes(search.toLowerCase()) || 
        (user.name && user.name.toLowerCase().includes(search.toLowerCase()))
    );

    // Render user card for mobile view
    const renderUserCard = (user, idx) => {
        return (
            <div key={user.id || idx} className="p-4 border rounded-lg mb-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="font-medium">{user.name || user.email.split('@')[0]}</div>
                        <div className="text-sm text-gray-500 mb-2">{user.email}</div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            {user.account_type === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                        <div className="text-sm text-gray-700 mt-2">Added: {formatDate(user.date_added)}</div>
                    </div>
                    <IconButton onClick={(e) => handleMenuOpen(e, user)} size="small">
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
        );
    };

    return (
        <section className="px-4 py-6">
            {/* Page Header */}
            <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 max-w-6xl mx-auto relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">User Management Overview</h1>
                        <p className="text-sm text-gray-500 mt-1">View, edit, and manage all users in the system.</p>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Role: Super Admin</span>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="p-4 sm:p-6 bg-white rounded-lg w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                    <h1 className="text-xl font-semibold">
                        All users <span className="text-gray-400">{totalUsers}</span>
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <div className="relative flex-grow sm:flex-grow-0 max-w-full">
                            <input
                                type="text"
                                placeholder="Search"
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full sm:w-auto pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ring-lightGray"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 10.5A6.15 6.15 0 1110.5 4.35a6.15 6.15 0 016.15 6.15z" />
                                </svg>
                            </span>
                        </div>
                        <button 
                            onClick={openAddUserDialog}
                            className="bg-customRed text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto"
                        >
                            + Add user
                        </button>
                    </div>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="p-4 text-center">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-4 text-center">No users found</div>
                ) : (
                    <>
                        {/* Mobile view for users */}
                        <div className={`${isMobile ? 'block' : 'hidden'}`}>
                            {filteredUsers.map((user, idx) => renderUserCard(user, idx))}
                        </div>

                        {/* Desktop view - Responsive Table */}
                        <div className={`w-full overflow-x-auto rounded-lg ${isMobile ? 'hidden' : 'block'}`}>
                            <table className="min-w-full border-collapse">
                                {/* Table Header */}
                                <thead>
                                    <tr className="bg-customRed text-white">
                                        <th className="px-4 py-2 text-left font-medium text-sm" style={{ width: isTablet ? '50%' : '40%' }}>User name</th>
                                        <th className="px-4 py-2 text-left font-medium text-sm" style={{ width: isTablet ? '30%' : '30%' }}>Roles</th>
                                        <th className="px-4 py-2 text-left font-medium text-sm" style={{ width: isTablet ? '20%' : '20%' }}>Date added</th>
                                        <th className="w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, idx) => (
                                        <tr key={user.id || idx} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{user.name || user.email.split('@')[0]}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                                    {user.account_type === 'super_admin' ? 'Super Admin' : 'Admin'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{formatDate(user.date_added)}</td>
                                            <td className="px-4 py-3">
                                                <IconButton onClick={(e) => handleMenuOpen(e, user)} size="small">
                                                    <MoreVert />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-6 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            className={`w-8 h-8 text-sm font-medium rounded-md ${
                                page === n 
                                    ? 'bg-customRed text-white' 
                                    : 'text-gray-700 border hover:bg-gray-100'
                            }`}
                            onClick={() => handlePageChange(n)}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu for actions */}
            <Menu
                PaperProps={{ sx: { boxShadow: 1 } }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {selectedUser?.account_type === 'admin' ? (
                    <MenuItem onClick={() => openConfirmDialog('promote')}>
                        Promote to Super Admin
                    </MenuItem>
                ) : selectedUser?.account_type === 'super_admin' ? (
                    <MenuItem onClick={() => openConfirmDialog('demote')}>
                        Demote to Admin
                    </MenuItem>
                ) : null}
                <MenuItem onClick={() => openConfirmDialog('remove')}>
                    Remove
                </MenuItem>
            </Menu>

            {/* Confirmation Dialog */}
            <Dialog 
                open={confirmDialog.open} 
                onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>{confirmDialog.title}</DialogTitle>
                <DialogContent>
                    <p>{confirmDialog.message}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>Cancel</Button>
                    <Button 
                        color="primary" 
                        onClick={
                            confirmDialog.type === 'promote' ? handlePromoteUser : 
                            confirmDialog.type === 'demote' ? handleDemoteUser : 
                            handleRemoveUser
                        }
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog 
                open={addUserDialog} 
                onClose={closeAddUserDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        backgroundColor: 'customRed', 
                        color: 'white',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        padding: '16px 24px',
                        fontWeight: 600
                    }}
                >
                    Add New User
                </DialogTitle>
                <DialogContent sx={{ pt: 3, pb: 2, px: 3, mt: 1 }}>
                    <div className="mb-4">
                        <p className="text-sm text-gray-500">
                            Create a new user account. All users will receive an email with their login details.
                        </p>
                    </div>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newUser.email}
                        onChange={handleInputChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        sx={{ mb: 3 }}
                        InputProps={{
                            sx: { borderRadius: '6px' }
                        }}
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newUser.password}
                        onChange={handleInputChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password || "Must be at least 6 characters"}
                        sx={{ mb: 3 }}
                        InputProps={{
                            sx: { borderRadius: '6px' }
                        }}
                    />
                    <TextField
                        margin="dense"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newUser.confirmPassword}
                        onChange={handleInputChange}
                        error={!!formErrors.confirmPassword}
                        helperText={formErrors.confirmPassword}
                        sx={{ mb: 3 }}
                        InputProps={{
                            sx: { borderRadius: '6px' }
                        }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="account-type-label">Account Type</InputLabel>
                        <Select
                            labelId="account-type-label"
                            name="account_type"
                            value={newUser.account_type}
                            label="Account Type"
                            onChange={handleInputChange}
                            sx={{ borderRadius: '6px' }}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="super_admin">Super Admin</MenuItem>
                        </Select>
                        <FormHelperText>Choose the user's role in the system</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ 
                    px: 3, 
                    pb: 3, 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: isMobile ? 'stretch' : 'flex-end', 
                    gap: 2 
                }}>
                    <Button 
                        onClick={closeAddUserDialog} 
                        variant="outlined"
                        fullWidth={isMobile}
                        sx={{ 
                            borderRadius: '6px',
                            px: 3
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmitNewUser} 
                        variant="contained"
                        fullWidth={isMobile}
                        sx={{ 
                            backgroundColor: '#d41c1c', 
                            '&:hover': { backgroundColor: '#b01818' },
                            borderRadius: '6px',
                            px: 3,
                            boxShadow: '0 2px 8px rgba(212,28,28,0.3)'
                        }}
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
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </section>
    );
}