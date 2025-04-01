import React, { useState, useEffect } from "react";
import {Box, Button, Menu, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, Snackbar, DialogActions} from "@mui/material";
import lz from "lzutf8";
import copy from "copy-to-clipboard";

import "../App.css";
import {useEditor} from "@craftjs/core";

export const Topbar = ({ layout, setLayout, rows, setRows, columns, setColumns }) => {
    const { query, actions } = useEditor();
    const [dropdown, setDropdown] = useState(null); // Stato per gestire l'apertura del menu
    const [snackbarMessage, setSnackbarMessage] = useState(); //Stato per notificare salvataggio stato
    const [dialogOpen, setDialogOpen] = useState(false); //Stato per gestire apertura dialog
    const [stateToLoad, setStateToLoad] = useState(""); //Stato per gestire caricamento stato


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
        <Box px={1} py={1} mt={3} mb={1} bgcolor={"rgba(0, 0, 0, 0.1)"} style={{display:"flex", flexDirection:"row", borderRadius:"20px"}}>
            <Button
                className="custom-typography"
                style={{ fontWeight: "bold", fontSize: "17px", marginLeft: "3px", borderRadius:"20px"  }}
                variant="outlined"
                onClick={handleMenuClick}
            >
                {layout === "row" ? "Horizontal" : layout === "column" ? "Vertical" : layout === "grid" ? "Grid Display" : "Free Canvas"}
            </Button>

            {/* Input per righe e colonne quando il layout è grid */}
            {layout === "grid" && (
                <Box style={{ display: "flex", alignItems: "center", marginLeft: "3px"}}>
                    <TextField
                        label="Rows"
                        type="number"
                        value={rows}
                        onChange={(e) => setRows(Number(e.target.value))}
                        variant="outlined"
                        size="small"
                            sx={{ fontWeight: "bold", fontSize: "17px" }}
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
                <MenuItem onClick={() => handleLayoutChange("free")}>Free Canvas</MenuItem>
            </Menu>
            <Button className="custom-typography"
                    style={{ fontWeight: "bold", fontSize: "17px", marginLeft: "auto", borderRadius:"20px"}}
                    variant="outlined"
                    onClick={()=> {
                        const json = query.serialize();
                        copy(lz.encodeBase64(lz.compress(json)));
                        setSnackbarMessage("State saved to clipboard!");
                    }}>
                Save
            </Button>
            <Button className="custom-typography"
                    style={{ fontWeight: "bold", fontSize: "17px", borderRadius:"20px", marginLeft:"10px"}}
                    variant="outlined"
                    onClick={()=> {
                        setDialogOpen(true);
                    }}>
                Load
            </Button>
            <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            fullWidth
            maxWidth="md"
            >
                <DialogTitle id="dialog-title">Load State</DialogTitle>
                <DialogContent>
                    <TextField
                    multiline
                    fullWidth
                    placeholder="Paste the state you want to load !"
                    size="small"
                    value={stateToLoad}
                    onChange={ e => setStateToLoad(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                    onClick={() => {
                        setDialogOpen(false);
                        try{
                            const json = lz.decompress(lz.decodeBase64(stateToLoad));
                            actions.deserialize(json);
                            setSnackbarMessage("State loaded!")
                    }catch (error) {
                        setSnackbarMessage("The state you're trying to load is not valid!");
                        setDialogOpen(true);
                        }
                    }}
                    autoFocus
                    >
                        Load
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                autoHideDuration={1000}
                anchorOrigin={{ vertical: "top", horizontal:"center"}}
                open={snackbarMessage}
                onClose={()=> setSnackbarMessage(null)}
                message={<span>{snackbarMessage}</span>}>
            </Snackbar>
        </Box>
    );
};
