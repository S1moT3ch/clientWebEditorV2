import React, { useEffect, useState, useRef } from 'react';
import {Paper, Grid, Snackbar, Alert, Box} from '@mui/material';
import "../App.css";

import { Toolbox } from '../components/Toolbox';
import { Settings } from '../components/Settings';
import { Container } from '../components/Container';
import { CraftButton as Button } from '../components/Button';
import { Text } from '../components/Text';
import { ImageUpload } from '../components/ImageUpload';
import { Card, CardTop, CardBottom } from '../components/Card';
import { ResizableRect } from "../components/ResizableRect";
import { DraggableChild } from "../components/DraggableChild";
import { Arrow } from "../components/Arrow";
import { Photo } from "../components/Photo"
import { Topbar } from '../components/Topbar';
import "../App.css";

import { Editor, Frame, Element} from "@craftjs/core";
import {ZIndexStack} from "../components/ZIndexStack";

//editor avvolge tutta l'applicazione per fornire contesto ai componenti modificabili
//definiti nella prop resolver
//frame invece è il contenitore principale dove andremo a droppare i componenti
//ogni elemento renderizzato nel frame sarà gestito dall'editor come un elemento modificabile chiamato node
//ad esempio se un elemento è draggable o meno dipende dal tipo di nodo che rappresenta
//se il nodo è un canvas node, allora l'elemento sarà droppable , se e invece un immediate children di un canvas node allora è draggable
//usiamo il componente Element per definire manualmente i nodi (canvas e non)

export default function App() {
    const [layout, setLayout] = useState("column");
    const [rows, setRows] = useState(2);
    const [columns, setColumns] = useState(2);
    const [width, setWidth] = useState("fit-content");
    const [height, setHeight] = useState("fit-content");

    const [hasSpecialElements, setHasSpecialElements] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const updateNodePosition = (id, gridRow, gridColumn, isGrid) => {
        const node = document.getElementById(id);
        if (!node) return;

        if (isGrid) {
            node.style.gridRowStart = gridRow;
            node.style.gridColumnStart = gridColumn;
        } else {
            node.style.position = "absolute";
            node.style.top = `${gridRow}px`;
            node.style.left = `${gridColumn}px`;
        }
    };

    //Funzione per gestire il passaggio tra un layout ed un altro in modo fluido
    const repositionNodes = (newLayout) => {

        const container = document.getElementById("ROOT");
        if (!container) return;

        const hasRect = container.querySelector("[data-type='ResizableRect']");
        const hasArrow = container.querySelector("[data-type='Arrow']");

        if (hasRect || hasArrow) {
            console.warn("Skipping repositionNodes: special elements present");
            return;
        }

        const nodes = Array.from(container.children);
        if(!nodes.length) return;

        switch(newLayout) {
            case "row":
                nodes.forEach((node, i) => {
                    node.style.position = "relative";
                    node.style.top = "0px";
                    node.style.left = "0px";
                    node.style.marginLeft = "10px"
                });
                break;
            case "column":
                nodes.forEach((node, i) => {
                    node.style.position = "relative";
                    node.style.top = "0px";
                    node.style.left = "0px";
                    node.style.marginLeft = "10px"
                });
                break;
            case "grid":
                const cols = columns || 2
                nodes.forEach((node, i) => {
                    node.style.position = "relative";
                    const row = Math.floor(i / cols) + 1;
                    const col = Math.floor(i % cols) +1;
                    node.style.gridRowStart = row;
                    node.style.gridColumnStart = col;
                });
                break;
            case "free":
                container.style.removeProperty("display");
                container.childNodes.forEach((el) => {
                    el.style.setProperty("position", "relative");
                });
                container.classList.add("free-canvas");
                break;
            default:
                nodes.forEach((node) => {
                    node.style.position = "relative";
                });
                break
        }
    }

    function getDraggedElementId(e) {
        const currentEl = e.target.id;
        e.dataTransfer.setData("text/plain", currentEl);
    }

    //Funzione per gestire il drop dei componenti
    const handleDrop = (e) => {
        e.preventDefault();
        const container = document.getElementById("ROOT");
        if (!container) return;

        const nodeId = e.dataTransfer.getData("text/plain");
        if (!nodeId) return;

        const isGrid = getComputedStyle(container).display === "grid";

        if (isGrid) {
            const rect = container.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            const gridStyles = getComputedStyle(container);
            const columnWidth = rect.width / parseInt(gridStyles.gridTemplateColumns.split(" ").length);
            const rowHeight = rect.height / parseInt(gridStyles.gridTemplateRows.split(" ").length);

            const gridColumn = Math.floor(offsetX / columnWidth) + 1;
            const gridRow = Math.floor(offsetY / rowHeight) + 1;

            updateNodePosition(nodeId, gridRow, gridColumn, true);
        } else {
            const rect = container.getBoundingClientRect();
            const left = e.clientX - rect.left;
            const top = e.clientY - rect.top;


            const isFreeCanvas = layout === "free";
            if (isFreeCanvas) {
                updateNodePosition(nodeId, top, left, false);
            }
        }
    };

    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            const newWidth = container.scrollWidth; // Usa scrollWidth per ottenere la larghezza effettiva del contenuto
            const newHeight = container.scrollHeight; // Usa scrollHeight per ottenere l'altezza effettiva del contenuto

            // Solo aggiornamenti se le dimensioni sono effettivamente cambiate
            if (newWidth !== width) {
                setWidth(newWidth);
            }
            if (newHeight !== height) {
                setHeight(newHeight);
            }
        });

        resizeObserver.observe(container);

        // Pulizia dell'observer quando il componente viene smontato
        return () => {
            resizeObserver.disconnect();
        };
    }, [width, height]); // Dipende da width e height per evitare loop infiniti


    useEffect(() => {
        const container = document.getElementById("ROOT");
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;

        //Impedisce il cambio layout se ci sono rettangoli o frecce
        if (container) {
            switch (layout) {
                case "grid":
                    container.style.setProperty("display", "grid");
                    container.style.setProperty("grid-template-rows", `repeat(${rows}, 1fr)`);
                    container.style.setProperty("grid-template-columns", `repeat(${columns}, 1fr)`);
                    if (container.classList.contains("free-canvas")) {
                        container.classList.remove("free-canvas");
                    }
                    break;
                case "column":
                    container.style.setProperty("display", "flex");
                    container.style.setProperty("flex-direction", "column");
                    if (container.classList.contains("free-canvas")) {
                        container.classList.remove("free-canvas");
                    }
                    break;
                case "row":
                    container.style.setProperty("display", "flex");
                    container.style.setProperty("flex-direction", "row");
                    if (container.classList.contains("free-canvas")) {
                        container.classList.remove("free-canvas");
                    }
                    break;
                default:
                    container.style.removeProperty("display");
                    container.childNodes.forEach((el) => {
                        el.style.setProperty("position", "relative");
                    });
                    container.classList.add("free-canvas");
                    break;
            }

            //Passaggio tra layout in modo fluido
            const hasSpecial = container.querySelector("[data-type='ResizableRect']") || container.querySelector("[data-type='Arrow']");
            if (!hasSpecial) {
                repositionNodes(layout);
            } else {
                if (layout !== "free") {
                    setLayout("free");
                }
                setSnackbarMessage("Layout change not allowed: there are Rectangle or Arrow in the canvas");
                setSnackbarOpen(true);
                container.style.removeProperty("display");
                container.childNodes.forEach((el) => {
                    el.style.setProperty("position", "relative");
                });
                container.classList.add("free-canvas");
                return;
            }
        }


    }, [layout, rows, columns, width, height]);

    //UseEffect con un eventListener per notificare agli utenti al refresh o alla chiusura della pagina
    //la perdina delle modifiche non salvate
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const message = "Warning: if you refresh or close this page, you will lose all the unsaved changes";

            event.preventDefault();
            alert(message);
            return message;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [])

    return (
        <div style={{ display: "flex"}}>
            {/* TopBar fissa */}
            <Grid
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#e5f8ed",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                    zIndex: 9999, // sempre sopra tutto
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 20px",
                }}
            >
                <img src="/Logo_PC_hor.png" alt="Logo PageCraft" style={{ width: "10vw", height: "auto" }}/>
                <h2 className="custom-typography" align="center">WebEditor</h2>
            </Grid>
            <div
                style={{
                    width: "100%",
                    height: "calc(100vh - 80px)",
                    overflow: "auto",
                    marginTop: "60px",
                    backgroundColor: "#fdfdfd",
                }}
            >
                <Editor resolver={{ Card, Button, Text, Container, CardTop, CardBottom, ImageUpload, ResizableRect, DraggableChild, Arrow}}>
                    <Grid className="home-grid" container spacing={3}>

                        <Grid className="side-grid" item xs>

                            <Topbar {...{ layout, setLayout, rows, setRows, columns, setColumns, width, setWidth, height, setHeight }} />
                            <div className="frame" onDragStart={getDraggedElementId} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onDragEnd={(e) => e.preventDefault()}>
                                <Frame>
                                    <Element is={Container} padding={10} canvas ref={containerRef}>
                                        <Card />
                                        <Button size="medium" variant="contained">Ciao</Button>
                                        <Text size="small" text="Hi!" />
                                        <Text size="small" text="It's me!" />
                                    </Element>
                                </Frame>
                            </div>
                        </Grid>
                        <Grid item xs={2} mr={8}>
                            <Paper className="custom-paper">
                                <Toolbox layout={layout} /> {/*Per rendering condizionale*/}
                                <Settings />
                                {layout === "free" &&
                                    <ZIndexStack />
                                }
                            </Paper>
                        </Grid>
                    </Grid>
                </Editor>

                {/*Snackbar per notifiche*/}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity="warning" sx={{ width: "100%" }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}
