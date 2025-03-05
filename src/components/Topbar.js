import React, { useState, useEffect } from "react";
import { Box, Button, Menu, MenuItem, TextField } from "@mui/material";
import "../App.css";

export const Topbar = ({ layout, setLayout, rows, setRows, columns, setColumns }) => {
    const [dropdown, setDropdown] = useState(null); // Stato per gestire l'apertura del menu


    const handleMenuClick = (event) => {
        setDropdown(event.currentTarget);
    };

    const handleMenuClose = () => {
        setDropdown(null);
    };

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);  // Cambia il layout
        setDropdown(null); // Chiude il menu
    };


    return (
        <Box px={1} py={1} mt={3} mb={1} bgcolor={"rgba(0, 0, 0, 0.1)"} style={{display:"flex", flexDirection:"row"}}>
            <Button
                className="custom-typography"
                style={{ fontWeight: "bold", fontSize: "17px" }}
                variant="outlined"
                onClick={handleMenuClick}
            >
                {layout === "row" ? "Horizontal" : layout === "column" ? "Vertical" : "Grid Display"}
            </Button>

            {/* Input per righe e colonne quando il layout è grid */}
            {layout === "grid" && (
                <Box sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}>
                    <TextField
                        label="Rows"
                        type="number"
                        value={rows}
                        onChange={(e) => setRows(Number(e.target.value))}
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: "bold", fontSize: "17px"}}
                    />
                    <TextField
                        label="Columns"
                        type="number"
                        value={columns}
                        onChange={(e) => setColumns(Number(e.target.value))}
                        variant="outlined"
                        size="small"
                    />
                </Box>
            )}
            <Menu
                anchorEl={dropdown}
                open={Boolean(dropdown)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleLayoutChange("row")}>Horizontal</MenuItem>
                <MenuItem onClick={() => handleLayoutChange("column")}>Vertical</MenuItem>
                <MenuItem onClick={() => handleLayoutChange("grid")}>Grid Display</MenuItem>
            </Menu>
        </Box>
    );
};
