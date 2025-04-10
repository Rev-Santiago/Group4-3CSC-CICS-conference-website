import React, { useState } from "react";
import { Typography, Select, MenuItem, Paper, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AdminPageCommittee = () => {
    const [selectedCommitteeMember, setSelectedCommitteeMember] = useState("");
    const [committee, setCommittee] = useState([
        { id: 1, position: "Chairperson", details: "Details about Alice Johnson" },
        { id: 2, position: "Secretary", details: "Details about Bob Smith" },
    ]);

    const handleCommitteeChange = (event) => {
        setSelectedCommitteeMember(event.target.value);
    };

    return (
        <>
            <Typography variant="subtitle1" sx={{ my: 2 }}>Committee Positions:</Typography>
            <Select fullWidth size="small" value={selectedCommitteeMember} onChange={handleCommitteeChange} variant="outlined">
                <MenuItem value="">Select a committee position</MenuItem>
                {committee.map((member) => (
                    <MenuItem key={member.id} value={member.id}>{member.position}</MenuItem>
                ))}
            </Select>
            {selectedCommitteeMember && (
                <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                    <Typography variant="h6" className="mb-2 font-medium">
                        {committee.find(m => m.id === selectedCommitteeMember)?.position}
                    </Typography>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex flex-row justify-center items-center mt-4">
                            <TextField fullWidth size="small" label="Name" variant="outlined" />
                            <IconButton>
                                <CloseIcon sx={{ color: "black" }} />
                            </IconButton>
                        </div>
                    ))}
                </Paper>
            )}
            <Button variant="outlined" sx={{ mt: 2 }}>Add a Name</Button>
        </>
    );
};

export default AdminPageCommittee;
