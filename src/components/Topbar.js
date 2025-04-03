import React, { useState } from "react";
import {Box, Button, Menu, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Snackbar, DialogActions} from "@mui/material";
import copy from "copy-to-clipboard";

import "../App.css";
import {useEditor} from "@craftjs/core";

export const Topbar = ({ layout, setLayout, rows, setRows, columns, setColumns, width, setWidth, height, setHeight }) => {
    const { query, actions } = useEditor();
    const [dropdown, setDropdown] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [stateToLoad, setStateToLoad] = useState("");


    const handleMenuClick = (event) => {
        setDropdown(event.currentTarget);
    };

    const handleMenuClose = () => {
        setDropdown(null);
    };

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
        setDropdown(null);
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

            {layout === "grid" && (
                <Box style={{ display: "flex", alignItems: "center", marginLeft: "3px"}}>
                    <TextField
                        label="Rows"
                        type="number"
                        value={rows}
                        onChange={(e) => setRows(Number(e.target.value))}
                        variant="outlined"
                        size="small"
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

            {layout === "free" && (
                <Box style={{ display: "flex", alignItems: "center", marginLeft: "3px" }}>
                    <TextField
                        label="Width (px)"
                        type="number"
                        value={width}
                        onChange={(e) => {
                            setWidth(Number(e.target.value));
                            document.getElementById("ROOT").style.width = `${e.target.value}px`;
                        }}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="Height (px)"
                        type="number"
                        value={height}
                        onChange={(e) => {
                            setHeight(Number(e.target.value));
                            document.getElementById("ROOT").style.height = `${e.target.value}px`;
                        }}
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
                    onClick={() => {
                        const rootElement = document.getElementById("ROOT");
                        if (!rootElement) {
                            setSnackbarMessage("Error: ROOT container not found!");
                            return;
                        }
                        const clonedElement = rootElement.cloneNode(true);
                        clonedElement.querySelectorAll("[data-craft-node]").forEach(node => {
                            node.removeAttribute("data-craft-node");
                        });
                        const extractedHTML = clonedElement.outerHTML;
                        copy(extractedHTML);
                        setSnackbarMessage("HTML copied to clipboard!");
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
                        placeholder="Paste the HTML you want to load!"
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
                                const rootElement = document.getElementById("ROOT");
                                if (!rootElement) {
                                    setSnackbarMessage("Error: ROOT container not found!");
                                    return;
                                }
                                rootElement.innerHTML = stateToLoad;
                                setSnackbarMessage("HTML loaded successfully!");
                            } catch (error) {
                                setSnackbarMessage("The HTML you're trying to load is not valid!");
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
