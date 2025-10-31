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

    // Funzione per gestire il passaggio tra un layout e un altro in modo fluido
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
        if (!nodes.length) return;

        if (newLayout === "free") {
            const containerRect = container.getBoundingClientRect();

            nodes.forEach((node) => {

                const rect = node.getBoundingClientRect();

                const absTop = rect.top - containerRect.top + container.scrollTop;
                const absLeft = rect.left - containerRect.left + container.scrollLeft;

                // salva per eventuale ripristino futuro
                node.dataset.absTop = `${absTop}px`;
                node.dataset.absLeft = `${absLeft}px`;

                // rimuovi margin/transform che possono spostare la visuale
                node.style.margin = "0";
                node.style.removeProperty("transform");
            });


            container.style.position = container.style.position || "relative";
            container.style.removeProperty("display");
            container.classList.add("free-canvas");

            nodes.forEach((node) => {
                node.style.position = "absolute";
                node.style.top = node.dataset.absTop || "0px";
                node.style.left = node.dataset.absLeft || "0px";
            });

            return;
        }

        if (["row", "column", "grid"].includes(newLayout)) {
            // rimuovi proprietà che possono interferire con il nuovo flow
            nodes.forEach((node) => {
                node.style.removeProperty("top");
                node.style.removeProperty("left");
                node.style.removeProperty("position");
                node.style.removeProperty("margin");
                node.style.removeProperty("transform");
            });

        }

        switch (newLayout) {
            case "row":
                container.style.display = "flex";
                container.style.flexDirection = "row";
                container.classList.remove("free-canvas");
                nodes.forEach((node) => {
                    node.style.position = "relative";
                    node.style.margin = "5px";
                });
                break;

            case "column":
                container.style.display = "flex";
                container.style.flexDirection = "column";
                container.classList.remove("free-canvas");
                nodes.forEach((node) => {
                    node.style.position = "relative";
                    node.style.margin = "5px 0";
                });
                break;

            case "grid":
                const cols = container.dataset.cols || 2;
                container.style.display = "grid";
                container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
                container.style.gridAutoRows = "auto";
                container.classList.remove("free-canvas");
                nodes.forEach((node, i) => {
                    node.style.position = "relative";
                    const row = Math.floor(i / cols) + 1;
                    const col = (i % cols) + 1;
                    node.style.gridRowStart = row;
                    node.style.gridColumnStart = col;
                });
                break;

            default:
                break;
        }
    };




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
        if (!container) return;

        // aggiorna dimensioni del container
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;

        // verifica elementi speciali
        const hasSpecial = container.querySelector("[data-type='ResizableRect']") ||
            container.querySelector("[data-type='Arrow']");

        if (hasSpecial && layout !== "free") {
            setLayout("free");
            setSnackbarMessage("Layout change not allowed: there are Rectangles or Arrows in the canvas");
            setSnackbarOpen(true);
            return;
        }

        if (layout === "grid") {
            container.style.display = "grid";
            container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
            container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            container.classList.remove("free-canvas");
            container.dataset.cols = columns;
        } else if (layout === "column") {
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.classList.remove("free-canvas");
        } else if (layout === "row") {
            container.style.display = "flex";
            container.style.flexDirection = "row";
            container.classList.remove("free-canvas");
        } else if (layout === "free") {

        } else {
            container.style.removeProperty("display");
            container.classList.remove("free-canvas");
        }

        // aspetta il frame successivo per garantire che il layout corrente sia applicato al DOM
        requestAnimationFrame(() => {
            repositionNodes(layout);
        });
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

                            <Topbar className="topbar" {...{ layout, setLayout, rows, setRows, columns, setColumns, width, setWidth, height, setHeight }} />
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
                    style = {{ zIndex: 10000 }}
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
