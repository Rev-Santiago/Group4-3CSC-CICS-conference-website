import React, { useState } from "react";
import {
    TextField,
    Typography,
    Grid,
    Paper,
    MenuItem,
    Select,
    Button,
    Avatar,
} from "@mui/material";
import { Upload, Save, Cancel } from "@mui/icons-material";

const AdminAccountPage = () => {
    const [currency, setCurrency] = useState("INR");

    return (
        <section className="">
            <div className="p-6 max-w-4xl mx-auto ">
                {/* Profile Section */}
                <div className="bg-white p-6 mb-6 shadow-md rounded-xl">
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Change Profile
                    </Typography>
                    <div className="flex flex-col items-center">
                        <Avatar sx={{ width: 80, height: 80 }} src="/avatar-placeholder.png" />
                        <div className="mt-4 flex gap-4">
                            <Button variant="outlined" color="secondary">Reset</Button>
                            <Button variant="contained" sx={{ backgroundColor: "#B7152F" }} startIcon={<Upload />}>Upload</Button>
                        </div>
                        <Typography variant="caption" className="mt-2 text-gray-500">
                            Allowed JPG, GIF, PNG. Max size 800KB.
                        </Typography>
                    </div>
                </div>

                {/* Personal Details Box */}
                <div className="bg-white p-6 mb-6 shadow-md rounded-lg">
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Personal Details
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="First Name" variant="outlined" size="small" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Last Name" variant="outlined" size="small" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Email" variant="outlined" size="small" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Phone" variant="outlined" size="small" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Address" variant="outlined" size="small" />
                        </Grid>
                    </Grid>
                </div>

                {/* Change Password Box */}
                <div className="bg-white p-6 mb-6 shadow-md rounded-lg">
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Change Password
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Current Password" variant="outlined" size="small" type="password" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="New Password" variant="outlined" size="small" type="password" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Confirm Password" variant="outlined" size="small" type="password" />
                        </Grid>
                    </Grid>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outlined">Cancel</Button>
                        <Button variant="contained" sx={{ backgroundColor: "#B7152F" }} startIcon={<Save />}>Save</Button>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default AdminAccountPage;