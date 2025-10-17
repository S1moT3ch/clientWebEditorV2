import React from "react";
import { Box, Typography } from "@mui/material";

//Componente per gestire apertura webApp su un dispositivo mobile
export default function MobileWarning() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            textAlign="center"
            bgcolor="#f8f8f8"
        >
            <Typography variant="h4" color="error">
                This page cannot be opened on a mobile device
                <br />
                Please use a desktop computer
            </Typography>
        </Box>
    );
}
