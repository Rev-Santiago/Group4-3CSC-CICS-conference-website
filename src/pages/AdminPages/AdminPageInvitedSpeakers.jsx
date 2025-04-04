import React, { useState } from "react";
import { Typography, Select, MenuItem, Paper, TextField, TextareaAutosize, Button } from "@mui/material";

const AdminPageInvitedSpeakers = () => {
    const [selectedInvitedSpeaker, setSelectedInvitedSpeaker] = useState("");
    const [invitedSpeakers, setInvitedSpeakers] = useState([
        { id: 1, name: "Dr. Sarah Lee", position: "Data Scientist", origin: "Canada", details: "Details about Dr. Sarah Lee" },
        { id: 2, name: "Prof. Michael Brown", position: "Cybersecurity Expert", origin: "Germany", details: "Details about Prof. Michael Brown" },
    ]);

    const handleInvitedSpeakerChange = (event) => {
        setSelectedInvitedSpeaker(event.target.value);
    };

    return (
        <>
            <Typography variant="subtitle1" sx={{ my: 2 }}>Speakers:</Typography>
            <Select fullWidth size="small" value={selectedInvitedSpeaker} onChange={handleInvitedSpeakerChange} variant="outlined">
                <MenuItem value="">Select an invited speaker</MenuItem>
                {invitedSpeakers.map((speaker) => (
                    <MenuItem key={speaker.id} value={speaker.id}>{speaker.name}</MenuItem>
                ))}
            </Select>
            {selectedInvitedSpeaker && (
                <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                    <Typography variant="h6" className="mb-2 font-medium">
                        {invitedSpeakers.find(s => s.id === selectedInvitedSpeaker)?.name}
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

export default AdminPageInvitedSpeakers;