// AdminPublicationsPage.jsx
import React, { useState } from "react";
import { 
    Button, Box, Grid, Typography, useMediaQuery, useTheme
} from "@mui/material";
import AdminAddPublication from "./AdminAddPublication";
import AdminEditPublication from "./AdminEditPublication";
import AdminDeletePublication from "./AdminDeletePublication";
import AdminSeeAllPublications from "./AdminSeeAllPublications";

const AdminPublicationsPage = () => {
    const [activeButton, setActiveButton] = useState("Add Publication");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    const getTitle = () => {
        switch (activeButton) {
            case "Add Publication":
                return "Add New Publication";
            case "Edit Publication":
                return "Edit Existing Publication";
            case "Delete Publication":
                return "Delete a Publication";
            case "See all Publications":
                return "All Publications Overview";
            default:
                return "Manage Publications";
        }
    };

    // Define actions array for mapping
    const actions = ["Add Publication", "Edit Publication", "Delete Publication", "See all Publications"];

    return (
        <section className="flex justify-center items-center rounded-3xl p-2 sm:p-4 md:p-6">
            <div className="w-full max-w-6xl">
                <Grid container spacing={isMobile ? 2 : 3}>
                    {/* Sidebar Actions */}
                    <Grid item xs={12} md={3}>
                        <Box className="bg-white p-3 md:p-4 rounded-lg shadow-md">
                            <Typography variant="h6" className="mb-2 md:mb-4 font-medium text-center">
                                Actions
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={1}>
                                {actions.map((action) => (
                                    <Button
                                        key={action}
                                        fullWidth
                                        size={isMobile ? "small" : "medium"}
                                        variant={activeButton === action ? "contained" : "outlined"}
                                        sx={{
                                            marginY: "2px",
                                            backgroundColor: activeButton === action ? "#B7152F" : "transparent",
                                            color: activeButton === action ? "white" : "inherit",
                                            borderColor: activeButton === action ? "#B7152F" : "black",
                                            borderWidth: "1px",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "normal",
                                            height: "auto",
                                            padding: "8px 16px",
                                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                                            lineHeight: 1.2,
                                            textTransform: "none",
                                            "&:hover": {
                                                backgroundColor: activeButton === action ? "#930E24" : "rgba(183, 21, 47, 0.1)",
                                                borderColor: "black",
                                            },
                                        }}
                                        onClick={() => handleButtonClick(action)}
                                    >
                                        {action}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={12} md={9}>
                        <Box className="bg-white p-3 md:p-6 rounded-lg shadow-md">
                            <Typography 
                                variant={isMobile ? "h6" : "h5"} 
                                className="mb-3 md:mb-6 font-semibold text-center"
                            >
                                {getTitle()}
                            </Typography>
                            
                            <Box sx={{ 
                                overflowX: 'auto', 
                                width: '100%',
                                maxHeight: isTablet ? 'calc(100vh - 250px)' : 'auto',
                                overflowY: isTablet ? 'auto' : 'visible'
                            }}>
                                {activeButton === "Add Publication" && <AdminAddPublication />}
                                {activeButton === "Edit Publication" && <AdminEditPublication />}
                                {activeButton === "Delete Publication" && <AdminDeletePublication />}
                                {activeButton === "See all Publications" && <AdminSeeAllPublications />}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </section>
    );
};

export default AdminPublicationsPage;
