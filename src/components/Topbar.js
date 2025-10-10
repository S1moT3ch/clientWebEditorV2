import React, {useEffect, useState} from "react";
import {Box, Button, Menu, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Snackbar, DialogActions, IconButton} from "@mui/material";

import copy from "copy-to-clipboard";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import "../App.css";
import {useEditor} from "@craftjs/core";
import {UndoRedo} from "./UndoRedo";
import {LoadSave} from "./LoadSave";

export const Topbar = ({ layout, setLayout, rows, setRows, columns, setColumns, width, setWidth, height, setHeight }) => {
    const { query, actions } = useEditor();

    const [dropdown, setDropdown] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleMenuClick = (event) => {
        setDropdown(event.currentTarget);
    };

    const handleMenuClose = () => {
        setDropdown(null);
    };

    return (
        <Box px={1} py={1} mt={3} mb={1} bgcolor={"rgba(0, 0, 0, 0.1)"} style={{display:"flex", flexDirection:"row", borderRadius:"20px", alignItems: "center", justifyContent: "space-between"}}>
            <Box display="flex" alignItems="center">
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
                    <MenuItem onClick={() => setLayout("row")}>Horizontal</MenuItem>
                    <MenuItem onClick={() => setLayout("column")}>Vertical</MenuItem>
                    <MenuItem onClick={() => setLayout("grid")}>Grid Display</MenuItem>
                    <MenuItem onClick={() => setLayout("free")}>Free Canvas</MenuItem>
                </Menu>

                {/*Bottoni per effettuare undo/redo*/}
                <Box display="flex" alignItems="center" ml={2}>
                    <UndoRedo/>
                </Box>
            </Box>

            {/*Bottoni per effettuare save/load*/}
            <Box display="flex" alignItems="center" ml={2}>
                <LoadSave layout={layout}
                          setLayout={setLayout}
                          rows={rows}
                          setRows={setRows}
                          columns={columns}
                          setColumns={setColumns}
                          width={width}
                          setWidth={setWidth}
                          height={height}
                          setHeight={setHeight}
                />
            </Box>
        </Box>
    );
};
