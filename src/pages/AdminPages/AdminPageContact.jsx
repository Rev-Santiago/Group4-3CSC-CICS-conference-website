import React, { useState } from "react";
import { Typography, Select, MenuItem, Paper, TextField, Button } from "@mui/material";

const AdminPageContact = () => {
    const [selectedContact, setSelectedContact] = useState("");
    const [contacts, setContacts] = useState([
        { id: 1, name: "Contact 1", details: "Details about John Doe" },
        { id: 2, name: "Contact 2", details: "Details about Jane Smith" },
    ]);

    const handleContactChange = (event) => {
        setSelectedContact(event.target.value);
    };

    return (
        <>
            <Typography variant="subtitle1" sx={{ my: 2 }}>Contacts:</Typography>
            <Select fullWidth size="small" value={selectedContact} onChange={handleContactChange} variant="outlined">
                <MenuItem value="">Select a contact</MenuItem>
                {contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>{contact.name}</MenuItem>
                ))}
            </Select>
            {selectedContact && (
                <Paper className="mt-4 p-4 border rounded-lg shadow-sm">
                    <Typography variant="h6" className="mb-2 font-medium">
                        {contacts.find(c => c.id === selectedContact)?.name}
                    </Typography>
                    <TextField fullWidth size="small" label="Name" variant="outlined" sx={{ mt: 2 }} />
                    <TextField fullWidth size="small" label="Email" variant="outlined" sx={{ mt: 2 }} />
                    <TextField fullWidth size="small" label="Telephone" variant="outlined" sx={{ mt: 2 }} />
                </Paper>
            )}
            <Button variant="outlined" sx={{ mt: 2 }}>Add a Contact</Button>
            <Button variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: "#B7152F", color: "white", "&:hover": { backgroundColor: "#930E24" } }}>
                Remove Contact
            </Button>
        </>
    );
};

export default AdminPageContact;
