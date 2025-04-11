// AdminPublicationsPage.jsx
import React, { useState } from "react";
import { 
    Button, Box, Grid, Typography 
} from "@mui/material";
import AdminAddPublication from "./AdminAddPublication";
import AdminEditPublication from "./AdminEditPublication";
import AdminDeletePublication from "./AdminDeletePublication";
import AdminSeeAllPublications from "./AdminSeeAllPublications";

const AdminPublicationsPage = () => {
    const [activeButton, setActiveButton] = useState("Add Publication");

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

    return (
        <section className="flex justify-center items-center rounded-3xl p-6">
            <div className="w-full max-w-6xl">
                <Grid container spacing={3}>
                    {/* Sidebar Actions */}
                    <Grid item xs={12} md={3}>
                        <Box className="bg-white p-4 rounded-lg shadow-md">
                            <Typography variant="h6" className="mb-4 font-medium text-center">
                                Actions
                            </Typography>
                            {["Add Publication", "Edit Publication", "Delete Publication", "See all Publications"].map((action) => (
                                <Button
                                    key={action}
                                    fullWidth
                                    variant={activeButton === action ? "contained" : "outlined"}
                                    sx={{
                                        backgroundColor: activeButton === action ? "#B7152F" : "transparent",
                                        color: activeButton === action ? "white" : "inherit",
                                        borderColor: activeButton === action ? "#B7152F" : "black",
                                        borderWidth: "1px",
                                        marginBottom: "8px",
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
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={12} md={9}>
                        <Box className="bg-white p-6 rounded-lg shadow-md">
                            <Typography variant="h5" className="mb-6 font-semibold text-center">
                                {getTitle()}
                            </Typography>
                            {activeButton === "Add Publication" && <AdminAddPublication />}
                            {activeButton === "Edit Publication" && <AdminEditPublication />}
                            {activeButton === "Delete Publication" && <AdminDeletePublication />}
                            {activeButton === "See all Publications" && <AdminSeeAllPublications />}
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </section>
    );
};

export default AdminPublicationsPage;