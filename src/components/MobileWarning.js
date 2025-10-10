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
                Questa pagina non può essere aperta da un dispositivo mobile.
                <br />
                Per favore usa un computer desktop.
            </Typography>
        </Box>
    );
}
