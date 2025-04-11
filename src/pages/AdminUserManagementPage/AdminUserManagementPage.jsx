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
    FormHelperText
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";

export default function AdminUserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', title: '', message: '' });
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [search, setSearch] = useState('');
    
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
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
                showNotification(error.response.data?.error || 'Failed to create user', 'error');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
                showNotification('No response received from server', 'error');
            } else {
                // Something happened in setting up the request that triggered an Error
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

    return (
        <section>
            {/* Page Header */}
            <div className="bg-white rounded-lg p-6 mb-6 max-w-6xl mx-auto relative">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">User Management Overview</h1>
                        <p className="text-sm text-gray-500 mt-1">View, edit, and manage all users in the system.</p>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Role: Super Admin</span>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="p-6 bg-white rounded-lg w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <h1 className="text-xl font-semibold">
                        All users <span className="text-gray-400">{totalUsers}</span>
                    </h1>
                    <div className="flex gap-2 flex-wrap">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                value={search}
                                onChange={handleSearchChange}
                                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ring-lightGray"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 10.5A6.15 6.15 0 1110.5 4.35a6.15 6.15 0 016.15 6.15z" />
                                </svg>
                            </span>
                        </div>
                        <button 
                            onClick={openAddUserDialog}
                            className="bg-customRed text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            + Add user
                        </button>
                    </div>
                </div>

                {/* Responsive Table */}
                <div className="w-full overflow-x-auto rounded-lg">
                    <div className="min-w-[768px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-10 px-4 py-2 bg-customRed border border-b-0 text-sm font-medium text-white">
                            <div className="col-span-4">User name</div>
                            <div className="col-span-3">Roles</div>
                            <div className="col-span-2">Date added</div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Loading state */}
                        {loading ? (
                            <div className="p-4 text-center">Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-4 text-center">No users found</div>
                        ) : (
                            /* Table Rows */
                            filteredUsers.map((user, idx) => (
                                <div key={user.id || idx} className="grid grid-cols-10 items-center px-4 py-3 border border-t-0 hover:bg-gray-50">
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div>
                                            <div className="font-medium">{user.name || user.email.split('@')[0]}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                            {user.account_type === 'super_admin' ? 'Super Admin' : 'Admin'}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-sm text-gray-700">{formatDate(user.date_added)}</div>
                                    <div className="col-span-1 flex justify-end">
                                        <IconButton onClick={(e) => handleMenuOpen(e, user)} size="small">
                                            <MoreVert />
                                        </IconButton>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pagination (You can implement this based on API response) */}
                <div className="flex justify-center gap-2 mt-6 flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button
                            key={n}
                            className="w-8 h-8 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-100"
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
            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
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
                <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button 
                        onClick={closeAddUserDialog} 
                        variant="outlined"
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
            >
                <Alert 
                    onClose={() => setNotification({ ...notification, open: false })} 
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </section>
    );
}
