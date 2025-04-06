import React, { useState } from "react";
import { Typography, Select, MenuItem, Paper, TextField, Button } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const AdminPagePartners = () => {
    const [selectedPartner, setSelectedPartner] = useState("");
    const [partners, setPartners] = useState([
        { id: 1, name: "Company A", details: "Details about Company A" },
        { id: 2, name: "Company B", details: "Details about Company B" },
    ]);

    const handlePartnerChange = (event) => {
        setSelectedPartner(event.target.value);
    };

    return (
        <>
            <Typography variant="subtitle1" sx={{ my: 2 }}>Partners:</Typography>
            <Select fullWidth size="small" value={selectedPartner} onChange={handlePartnerChange} variant="outlined">
                <MenuItem value="">Select a partner</MenuItem>
                {partners.map((partner) => (
                    <MenuItem key={partner.id} value={partner.id}>{partner.name}</MenuItem>
                ))}
            </Select>
            {selectedPartner && (
                <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                    <Typography variant="h6" className="mb-2 font-medium">
                        {partners.find(p => p.id === selectedPartner)?.name}
                    </Typography>
                    <TextField fullWidth size="small" label="Name" variant="outlined" sx={{ mt: 2 }} />
                    <TextField fullWidth size="small" label="Industry" variant="outlined" sx={{ mt: 2 }} />
                    <TextField fullWidth size="small" label="Location" variant="outlined" sx={{ mt: 2 }} />
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
            <Button variant="outlined" sx={{ mt: 2 }}>Add a Partner</Button>
            <Button variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#930E24" } }}>
                Remove Partner
            </Button>
        </>
    );
};

export default AdminPagePartners;
