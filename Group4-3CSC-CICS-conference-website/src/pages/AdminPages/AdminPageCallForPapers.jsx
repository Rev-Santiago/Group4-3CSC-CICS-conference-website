import React, { useState } from "react";
import { Typography, Select, MenuItem, Paper, TextField, Button, TextareaAutosize } from "@mui/material";

const AdminPageCallForPapers = () => {
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
            <Typography variant="subtitle1" sx={{ my: 2 }}>Tracks:</Typography>
            <Select fullWidth size="small" value={selectedTrack} onChange={handleTrackChange} variant="outlined">
                <MenuItem value="">Select a track</MenuItem>
                {tracks.map((track) => (
                    <MenuItem key={track.id} value={track.id}>{track.title}</MenuItem>
                ))}
            </Select>
            {selectedTrack && (
                <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                    <Typography variant="h6" className="mb-2 font-medium">
                        {tracks.find(t => t.id === selectedTrack)?.title}
                    </Typography>
                    <TextField fullWidth size="small" label="Title" variant="outlined" sx={{ mt: 2 }} />
                    <Typography variant="subtitle2" sx={{ mt: 2, ml: 1.5 }}>Body:</Typography>
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={3}
                        style={{
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            padding: "8px"
                        }}
                    />
                </Paper>
            )}
            <Button variant="outlined" sx={{ mt: 2 }}>Add a Track</Button>
            <Button variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#930E24" } }}>
                Remove Track
            </Button>
            <Typography variant="subtitle1" sx={{ my: 2 }}>Submission Guidelines:</Typography>
            <Typography variant="subtitle2" sx={{ mt: 2, ml: 1.5 }}>Body:</Typography>
            <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                style={{
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px"
                }}
            />
        </>
    );
};

export default AdminPageCallForPapers;
