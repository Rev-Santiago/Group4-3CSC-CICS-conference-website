import React, { useState } from "react";
import { TextField, Typography, Grid, IconButton, Paper, MenuItem, Select, Button, TextareaAutosize } from "@mui/material";

const AdminGlobalLayoutNavbar = () => {
    const [selectedTrack, setSelectedTrack] = useState("");
    const [tracks, setTracks] = useState([
        { id: 1, title: "Track 1", description: "Details about track 1" },
        { id: 2, title: "Track 2", description: "Details about track 2" },
    ]);

    const handleTrackChange = (event) => {
        setSelectedTrack(event.target.value);
    };

    return (
        <>
            <Typography variant="subtitle1" sx={{ my: 2 }}>Logo:</Typography>
            <Grid item xs={12} className="flex items-center gap-2">
                <TextField fullWidth size="small" label="Upload Image" type="file" variant="outlined" InputLabelProps={{ shrink: true }} />
            </Grid>
        </>
    );
};

export default AdminGlobalLayoutNavbar;
