import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { LayoutContext } from "../../App"; // ✅ Import the context

const NotFoundPage = () => {
  const { setHideLayout } = useContext(LayoutContext); // ✅ Get function to hide layout

  useEffect(() => {
    setHideLayout(true);  // ✅ Hide navbar & footer when mounted
    return () => setHideLayout(false); // ✅ Restore layout when unmounted
  }, [setHideLayout]);

  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h2" color="error">
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 3 }} component={Link} to="/">
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
