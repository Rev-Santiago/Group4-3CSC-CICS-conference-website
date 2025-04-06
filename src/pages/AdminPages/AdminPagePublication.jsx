import React from "react";
import { Typography, TextareaAutosize } from "@mui/material";

const AdminPagePublication = () => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Conference Proceedings:</Typography>
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

export default AdminPagePublication;