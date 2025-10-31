import React from "react";
import { Box, Typography } from "@mui/material";

//Componente per gestire apertura webApp su un dispositivo mobile
export default function MobileWarning() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            textAlign="center"
            bgcolor="#f8f8f8"
            style={{ gap: "1.8rem" }}
        >
            <img src="/LogoPC_full.png" alt="Logo PageCraft" style={{ width: "50vw", height: "auto" }}/>
            <Typography variant="h4" color="#5488AE">
                This page cannot be opened on a mobile device
                <br />
                Please use a desktop computer
            </Typography>
        </Box>
    );
}
