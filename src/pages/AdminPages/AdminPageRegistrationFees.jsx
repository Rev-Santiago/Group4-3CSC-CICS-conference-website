import React from "react";
import { Typography } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const AdminPageRegistrationFees = () => {
    return (
        <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Payment Guidelines:</Typography>
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
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Presentation Video:</Typography>
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

export default AdminPageRegistrationFees;
