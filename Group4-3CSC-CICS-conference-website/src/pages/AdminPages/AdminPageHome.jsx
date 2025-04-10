import React, { useState } from "react";
import { TextField, Typography, Grid, IconButton, Paper, MenuItem, Select, Button, TextareaAutosize } from "@mui/material";
import { Add } from "@mui/icons-material";

const AdminPageHome = () => {
    const [accordions, setAccordions] = useState([
        { id: 1, title: "Accordion 1", body: "Content for accordion 1" },
        { id: 2, title: "Accordion 2", body: "Content for accordion 2" },
    ]);
    const [selectedAccordion, setSelectedAccordion] = useState("");

    const handleAccordionChange = (event) => {
        setSelectedAccordion(event.target.value);
    };

    return (
        <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Main:</Typography>
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
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 4 }}>Component Contents</Typography>
            </Grid>
            <Typography variant="subtitle1" sx={{ my: 2 }}>Image Carousel:</Typography>
            <Grid item xs={12} className="flex items-center gap-2">
                <TextField fullWidth size="small" label="Upload Image" type="file" variant="outlined" InputLabelProps={{ shrink: true }} />
                <IconButton color="black">
                    <Add />
                </IconButton>
            </Grid>
            <Typography variant="subtitle1" sx={{ my: 2 }}>Accordion:</Typography>
            <Select fullWidth size="small" value={selectedAccordion} onChange={handleAccordionChange} variant="outlined">
                <MenuItem value="">Select an accordion</MenuItem>
                {accordions.map((acc) => (
                    <MenuItem key={acc.id} value={acc.id}>{acc.title}</MenuItem>
                ))}
            </Select>
            {selectedAccordion && (
                <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                    <Typography variant="h6" className="mb-2 font-medium">
                        {accordions.find(a => a.id === selectedAccordion)?.title}
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
            <Button variant="outlined" sx={{ mt: 2 }}>Add an Accordion</Button>
        </>
    );
};

export default AdminPageHome;
