import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { LayoutContext } from "../../App";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage = () => {
  const { setHideLayout } = useContext(LayoutContext);

  useEffect(() => {
    setHideLayout(true);
    return () => setHideLayout(false);
  }, [setHideLayout]);

  return (
    <Container maxWidth="md" sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper 
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: "center",
          background: "linear-gradient(to bottom right, #ffffff, #f5f5f5)",
          border: "1px solid #eaeaea",
          maxWidth: 600,
          width: "100%"
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: "#B7152F", mb: 2 }} />
        
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: "4rem", md: "6rem" },
            fontWeight: 700,
            color: "#B7152F",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            mt: 2,
            mb: 3,
            color: "#555",
            fontWeight: 500
          }}
        >
          Oops! The page you're looking for has vanished into thin air.
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: "#777"
          }}
        >
          It might have been moved, deleted, or perhaps never existed in the first place.
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<HomeIcon />}
          sx={{ 
            mt: 2,
            backgroundColor: "#B7152F",
            padding: "10px 25px",
            borderRadius: "30px",
            fontWeight: 600,
            boxShadow: "0 4px 10px rgba(183, 21, 47, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#8E1023",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 15px rgba(183, 21, 47, 0.4)",
            }
          }} 
          component={Link} 
          to="/"
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;