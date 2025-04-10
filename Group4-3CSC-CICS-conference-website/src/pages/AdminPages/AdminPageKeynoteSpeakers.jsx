import React, { useState } from "react";
import { Typography, Select, MenuItem, Paper, TextField, TextareaAutosize, Button } from "@mui/material";

const AdminPageKeynoteSpeakers = () => {
    const [selectedKeynoteSpeaker, setSelectedKeynoteSpeaker] = useState("");
    const [keynoteSpeakers, setKeynoteSpeakers] = useState([
        { id: 1, name: "Dr. Emily Carter", position: "AI Researcher", origin: "USA", details: "Details about Dr. Emily Carter" },
        { id: 2, name: "Prof. James Anderson", position: "Quantum Scientist", origin: "UK", details: "Details about Prof. James Anderson" },
    ]);

    const handleKeynoteSpeakerChange = (event) => {
        setSelectedKeynoteSpeaker(event.target.value);
    };
    return (
        <>
            <Typography variant="subtitle1" sx={{ my: 2 }}>Speakers:</Typography>
            <Select fullWidth size="small" value={selectedKeynoteSpeaker} onChange={handleKeynoteSpeakerChange} variant="outlined">
                <MenuItem value="">Select a keynote speaker</MenuItem>
                {keynoteSpeakers.map((speaker) => (
                    <MenuItem key={speaker.id} value={speaker.id}>{speaker.name}</MenuItem>
                ))}
            </Select>
            {selectedKeynoteSpeaker && (
                <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                    <Typography variant="h6" className="mb-2 font-medium">
                        {keynoteSpeakers.find(s => s.id === selectedKeynoteSpeaker)?.name}
                    </Typography>
                    <TextField fullWidth size="small" label="Name" variant="outlined" sx={{ mt: 2 }} />
                    <TextField fullWidth size="small" label="Position" variant="outlined" sx={{ mt: 2 }} />
                    <TextField fullWidth size="small" label="Origin" variant="outlined" sx={{ mt: 2 }} />
                    <Typography variant="subtitle2" sx={{ mt: 2, ml: 1.5 }}>Details:</Typography>
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
            <Button variant="outlined" sx={{ mt: 2 }}>Add a Speaker</Button>
            <Button variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#930E24" } }}>
                Remove Speaker
            </Button>
        </>
    );
};

export default AdminPageKeynoteSpeakers;