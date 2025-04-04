import React from "react";
import { Typography } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const AdminPageEventHistory = () => {
    return (
        <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Announcements:</Typography>
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

export default AdminPageEventHistory;
