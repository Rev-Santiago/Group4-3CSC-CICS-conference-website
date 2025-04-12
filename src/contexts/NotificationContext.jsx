import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

// Create the NotificationContext
const NotificationContext = createContext({
  showNotification: () => {},
  showConfirmation: () => Promise.resolve(false),
  hideNotification: () => {},
  notification: { open: false, message: '', severity: 'info' },
});

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Provider component that wraps your app and makes notifications available
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'info', 'warning', 'error'
  });

  const [confirmation, setConfirmation] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  // Show a notification
  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Hide notification
  const hideNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Show a confirmation dialog
  const showConfirmation = (title, message) => {
    return new Promise((resolve) => {
      setConfirmation({
        open: true,
        title,
        message,
        onConfirm: () => {
          setConfirmation((prev) => ({ ...prev, open: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmation((prev) => ({ ...prev, open: false }));
          resolve(false);
        },
      });
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showConfirmation,
        hideNotification,
        notification,
      }}
    >
      {children}
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmation.open}
        onClose={confirmation.onCancel}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">{confirmation.title}</DialogTitle>
        <DialogContent>
          {confirmation.message}
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmation.onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmation.onConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </NotificationContext.Provider>
  );
};