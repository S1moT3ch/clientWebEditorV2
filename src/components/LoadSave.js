import React, {useEffect, useState} from "react";
import {Box, Button, Menu, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Snackbar, DialogActions, IconButton} from "@mui/material";

import copy from "copy-to-clipboard";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import "../App.css";
import {useEditor} from "@craftjs/core";

export const LoadSave = ({ layout, setLayout, rows, setRows, columns, setColumns, width, setWidth, height, setHeight }) => {
    const { query, actions } = useEditor();

    const [snackbarMessage, setSnackbarMessage] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [stateToLoad, setStateToLoad] = useState("");
    const [loadMode, setLoadMode] = useState("zipJson"); //scelta del file da caricare: html, zip o json

    //Listener globale alla tastiera per gestire le shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "s") {
                e.preventDefault();
                saveLayout()
            }
            if (e.ctrlKey && e.key.toLowerCase() === "l") {
                e.preventDefault();
                document.getElementById("loadButton")?.click();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [dialogOpen]);


    //Funzione per il salvataggio di HTML e JSON in una cartella .zip
    const saveLayout = async () => {
        try{
            const serialized = query.serialize();

            // Dati layout
            const layoutInfo = {
                layout,
                rows,
                columns,
                width,
                height,
            };

            //Se si è in modalità "free", vengono salvate le coordinate di ogni nodo
            if (layout === "free") {
                const rootElement = document.getElementById("ROOT");
                const nodePositions = Array.from(rootElement.children).map((node) => ({
                    id: node.id,
                    top: node.style.top || "0px",
                    left: node.style.left || "0px",
                }));

                layoutInfo.nodePositions = nodePositions;
            }

            const extendedData = {
                craftData: JSON.parse(serialized),
                layoutInfo,
            };

            const json = JSON.stringify(extendedData);

            const rootElement = document.getElementById("ROOT");
            if (!rootElement) {
                setSnackbarMessage("Error: ROOT container not found!")
                return
            }

            const clonedElement = rootElement.cloneNode(true);
            clonedElement.querySelectorAll("[data-craft-node]").forEach((node) => {
                node.removeAttribute("data-craft-node");
            });

            const extractedHTML = clonedElement.outerHTML;
            copy(extractedHTML);

            //input del nome della cartella di cui effettuare il download
            const folderNameInput = prompt("Insert the project name")
            if (!folderNameInput) {
                setSnackbarMessage("Project name is not present: Saving cancelled")
            }
            const folderName = folderNameInput.trim()

            //creazione cartella .zip
            const zip = new JSZip();
            const folder = zip.folder(folderName);

            //file da inserire nella cartella
            folder.file(`${folderName}.html`, extractedHTML);
            folder.file(`${folderName}.json`, json, { type: "application/json" });

            //zippa la cartella
            const content = await zip.generateAsync({ type: "blob" });
            //salva il file .zip generato
            saveAs(content, `${folderName}.zip`);

            setSnackbarMessage("Zip archive saved and HTML copied to clipboard");
        } catch (error) {
            console.error(error);
            setSnackbarMessage("Error while saving");
        }
    };

    //Funzione caricamento HTML
    const loadHTMLContent = (htmlContent) => {
        try {
            const rootElement = document.getElementById("ROOT");
            if (!rootElement) {
                setSnackbarMessage("Error: ROOT container not found!");
                return;
            }

            while (rootElement.firstChild) {
                rootElement.removeChild(rootElement.firstChild);
            }

            rootElement.innerHTML = htmlContent;

            setStateToLoad("");
            setLoadMode("zipJson");
            setSnackbarMessage("HTML loaded successfully!");
        } catch (error) {
            console.error(error);
            setSnackbarMessage("The HTML you're trying to load is not valid!");
            setDialogOpen(true);
        }
    };

    //Funzione caricamento file .zip o .json
    const handleFileLoad = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileName = file.name.toLowerCase();

        if (fileName.endsWith(".zip")) {
            // Carica file ZIP
            try {
                //trova il file json nell'archivio ZIP
                const zip = await JSZip.loadAsync(file);
                const jsonFileName = Object.keys(zip.files).find(name => name.endsWith(".json"));

                if (!jsonFileName) {
                    setSnackbarMessage("No .json file found in ZIP archive");
                    return;
                }

                const jsonContent = await zip.file(jsonFileName).async("string");
                const content = JSON.parse(jsonContent);

                //deserializza lo stato di Craft.js e le info di layout. Poi ripristina lo stato del canvas caricato, posizionando gli elementi, se in free-layout, nella posizione in cui sono stati salvati
                actions.deserialize(JSON.stringify(content.craftData)); // Ripristina Craft.js
                setLayout(content.layoutInfo.layout);
                setRows(content.layoutInfo.rows);
                setColumns(content.layoutInfo.columns);
                setWidth(content.layoutInfo.width);
                setHeight(content.layoutInfo.height);

                document.getElementById("ROOT").style.width = `${content.layoutInfo.width}px`;
                document.getElementById("ROOT").style.height = `${content.layoutInfo.height}px`;

                if (content.layoutInfo.layout === "free" && content.layoutInfo.nodePositions) {
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    content.layoutInfo.nodePositions.forEach(({ id, top, left }) => {
                        const el = document.getElementById(id);
                        if (el) {
                            el.style.position = "absolute";
                            el.style.top = top;
                            el.style.left = left;
                        }
                    });
                }


                setLoadMode("zipJson");
                setSnackbarMessage("Layout successfully loaded from ZIP!");
                setDialogOpen(false);

            } catch (error) {
                console.error(error);
                setSnackbarMessage("Error loading ZIP file");
            }

        } else if (fileName.endsWith(".json")) {
            // Carica file JSON
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const content = JSON.parse(event.target.result);

                    //deserializza lo stato di Craft.js e le info di layout. Poi ripristina lo stato del canvas caricato
                    actions.deserialize(JSON.stringify(content.craftData)); // Ripristina Craft.js
                    setLayout(content.layoutInfo.layout);
                    setRows(content.layoutInfo.rows);
                    setColumns(content.layoutInfo.columns);
                    setWidth(content.layoutInfo.width);
                    setHeight(content.layoutInfo.height);

                    document.getElementById("ROOT").style.width = `${content.layoutInfo.width}px`;
                    document.getElementById("ROOT").style.height = `${content.layoutInfo.height}px`;

                    if (content.layoutInfo.layout === "free" && content.layoutInfo.nodePositions) {
                        await new Promise((resolve) => setTimeout(resolve, 500)); // piccolo delay per sicurezza

                        content.layoutInfo.nodePositions.forEach(({ id, top, left }) => {
                            const el = document.getElementById(id);
                            if (el) {
                                el.style.position = "absolute";
                                el.style.top = top;
                                el.style.left = left;
                            }
                        });
                    }


                    setLoadMode("zipJson");
                    setSnackbarMessage("Layout successfully loaded from ZIP!");
                    setDialogOpen(false);

                } catch (error) {
                    console.error(error);
                    setSnackbarMessage("Error: Invalid JSON file");
                }
            };
            reader.readAsText(file);

        } else {
            setSnackbarMessage("Unsupported file format. Please upload a .zip or .json file");
        }
    };


    //Funzione helper per attendere il caricamento di tutte le immagini
    const waitForImagesToLoad = () => {
        return new Promise((resolve) => {
            const images = document.querySelectorAll("#ROOT img");
            const totalImages = images.length;
            if (totalImages === 0) return resolve();

            let loadedCount = 0;
            images.forEach((img) => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalImages) resolve();
                    };
                    img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === totalImages) resolve();
                    };
                }
            });

            // Nel caso tutte le immagini siano già caricate
            if (loadedCount === totalImages) resolve();
        });
    };

    return (
        <Box>
            {/*Bottone per salvare HTML e JSON*/}
            <Button className="custom-typography"
                    style={{ fontWeight: "bold", fontSize: "17px", marginLeft: "auto", borderRadius:"20px"}}
                    variant="outlined"
                    onClick={saveLayout}
            >
                Save
            </Button>

            {/*Bottone per caricare HTML e JSON*/}
            <Button
                className="custom-typography"
                id="loadButton"
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
                PaperProps={{
                    style: {
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                    }
                }}
            >
                <DialogTitle id="dialog-title" style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
                    Load State
                </DialogTitle>
                <DialogContent display="flex" gap={2} flexWrap="wrap">
                    <Box mb={2} display="flex" gap={2}>
                        <Button
                            variant={loadMode === "zipJson" ? "contained" : "outlined"}
                            color="primary"
                            onClick={() => setLoadMode("zipJson")}
                            style={{ flex:1, minWidth: "180px" }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <span>Load File</span>
                                <small style={{ fontSize: "0.8rem" }}>(editing mode)</small>
                            </div>
                        </Button>
                        <Button
                            variant={loadMode === "html" ? "contained" : "outlined"}
                            color="secondary"
                            onClick={() => setLoadMode("html")}
                            style={{ flex: 1, minWidth: "180px" }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <span>Paste HTML</span>
                                <small style={{ fontSize: "0.8rem" }}>(read-only mode)</small>
                            </div>
                        </Button>
                    </Box>

                    {loadMode === "html" && (
                        <TextField
                            multiline
                            fullWidth
                            placeholder="Paste the HTML you want to load!"
                            size="small"
                            value={stateToLoad}
                            onChange={ e => setStateToLoad(e.target.value)}
                            variant="outlined"
                            style={{ minHeight: "150px", backgroundColor: "#fafafa" }}
                        />
                    )}

                    {loadMode === "zipJson" && (
                        <Box mt={2} display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={1}>
                            <input
                                accept=".zip,.json"
                                type="file"
                                id="zipJsonFileInput"
                                style={{ display: "none" }}
                                onChange={handleFileLoad}
                            />
                            <label htmlFor="zipJsonFileInput" style={{ display: "flex", justifyContent: "center" }}>
                                <Button
                                    variant="outlined"
                                    component="span"
                                    style={{
                                        padding: "12px 20px",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    Select ZIP or JSON file
                                </Button>
                            </label>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions style={{ padding: "16px" }}>
                    <Button
                        onClick={() => {
                            setDialogOpen(false);
                            setLoadMode("zipJson");
                        }}
                        color="inherit"
                    >
                        Cancel
                    </Button>

                    {loadMode === "html" && (
                        <Button
                            onClick={() => {
                                setDialogOpen(false);
                                loadHTMLContent(stateToLoad);
                            }}
                            variant="contained"
                            color="primary"
                            autoFocus
                        >
                            Load HTML
                        </Button>
                    )}
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
