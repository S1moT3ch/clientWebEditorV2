import React, {useEffect, useState} from 'react';
import {Paper, Grid} from '@mui/material';
import "../App.css"

import { Toolbox } from '../components/Toolbox';
import { Settings } from '../components/Settings';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { ImageUpload } from '../components/ImageUpload';
import { Card, CardTop, CardBottom} from '../components/Card';
import { Topbar } from '../components/Topbar';
import "../App.css"


import {Editor, Frame, Element} from "@craftjs/core";

//editor avvolge tutta l'applicazione per fornire contesto ai componenti modificabili
//definiti nella prop resolver
//frame invece è il contenitore principale dove andremo a droppare i componenti
//ogni elemento renderizzato nel frame sarà gestito dall'editor come un elemento modificabile chiamato node
//ogni node descrive il componente che rappresenta, le props, gli eventi e le relazioni con altri nodi
//ad esempio se un elemento è draggable o meno dipende dal tipo di nodo che rappresenta
//se il nodo è un canvas node, allora l'elemento sarà droppable , se e invece un immediate children di un canvas node allora è draggable
//usiamo il componente Element per definire manualmente i nodi (canvas e non)
//in particolare renderemo i container canvas in modo da poter droppare elementi all'interno e i loro immediate children
//come i componenti all'interno , saranno draggable.

export default function App() {

    //la modifica del layout e il relativo useEffect erano nella topbar , ma in questo modo non mi aggiornava i figli del container ROOT come le card
    //che rimanevano di un layout sbagliato
    const [layout, setLayout] = useState("column"); // Layout corrente
    const [rows, setRows] = useState(2); // Numero di righe
    const [columns, setColumns] = useState(2); // Numero di colonne
    const [width, setWidth] = useState(1148); // Larghezza del container
    const [height, setHeight] = useState(600); // Altezza del container

    const updateNodePosition = (id, gridRow, gridColumn, isGrid) => {
        const node = document.getElementById(id);
        if (!node) return;

        if (isGrid) {
            node.style.gridRowStart = gridRow;
            node.style.gridColumnStart = gridColumn;
        } else {
            node.style.top = `${gridRow}px`;
            node.style.left = `${gridColumn}px`;
        }
    };

    function getDraggedElementId(e) {
        const currentEl = e.target.id;
        e.dataTransfer.setData("text/plain", currentEl);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        const container = document.getElementById("ROOT");
        if (!container) return;

        const nodeId = e.dataTransfer.getData("text/plain");
        if (!nodeId) return;

        const isGrid = getComputedStyle(container).display === "grid";

        if (isGrid) {
            // Ottieni le dimensioni del container
            const rect = container.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            // Ottieni il numero di colonne e righe della griglia
            const gridStyles = getComputedStyle(container);
            const columnWidth = rect.width / parseInt(gridStyles.gridTemplateColumns.split(" ").length);
            const rowHeight = rect.height / parseInt(gridStyles.gridTemplateRows.split(" ").length);

            // Calcola la riga e la colonna basate sulla posizione del mouse
            const gridColumn = Math.floor(offsetX / columnWidth) + 1;
            const gridRow = Math.floor(offsetY / rowHeight) + 1;

            updateNodePosition(nodeId, gridRow, gridColumn, true);
        } else {
            // Se è free canvas, usa le coordinate top e left
            const rect = container.getBoundingClientRect();
            const left = e.clientX - rect.left;
            const top = e.clientY - rect.top;

            updateNodePosition(nodeId, top, left, false);
        }
    };




    // Modifica il layout del ROOT quando layout, rows o columns cambiano
    useEffect(() => {
        const container = document.getElementById("ROOT");
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
        if (container) {
            switch (layout) {
                case "grid":
                    container.style.setProperty("display", "grid");
                    container.style.setProperty("grid-template-rows", `repeat(${rows}, 1fr)`);
                    container.style.setProperty("grid-template-columns", `repeat(${columns}, 1fr)`);
                {if (container.classList.contains("free-canvas")) {
                    container.classList.remove("free-canvas");
                }}
                    break;
                case "column":
                    container.style.setProperty("display", "flex");
                    container.style.setProperty("flex-direction", "column");
                {if (container.classList.contains("free-canvas")) {
                    container.classList.remove("free-canvas");
                }}
                    break;
                case "row":
                    container.style.setProperty("display", "flex");
                    container.style.setProperty("flex-direction", "row");
                {if (container.classList.contains("free-canvas")) {
                    container.classList.remove("free-canvas");
                }}
                    break;
                default:
                    container.style.removeProperty("display");
                    container.childNodes.forEach((el) => {
                        el.style.setProperty("position", "absolute");
                    });
                    container.classList.add("free-canvas");
                    break;
            }
        }
    }, [layout, rows, columns]);


    return (
            <div style={{display:"flex"}}>
                <Editor resolver={{Card, Button, Text, Container, CardTop, CardBottom, ImageUpload}}>
                    <Grid container spacing={3} margin={0.5} style={{ display: "flex", flexWrap: "nowrap"}} >
                        <Grid item xs style={{ overflow:"hidden", flexGrow:1, maxWidth: "calc(100vw - 300px)"}}>
                            <h2 className="custom-typography" align="center" >Page Editor</h2>
                            <Topbar  layout={layout}
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
                            <div onDragStart={getDraggedElementId} onDrop={handleDrop} onDragEnd={(e) => e.preventDefault()}>
                                <Frame>
                                    <Element is={Container} padding={16} background="#eee" canvas>
                                        <Card/>
                                        <Button size="medium" variant="contained">Ciao</Button>
                                        <Text size="small" text="Hi world!" />
                                        <Text size="small"  text="It's me again!" />
                                    </Element>
                                </Frame>
                            </div>

                        </Grid>
                        <Grid item xs={2} mr={5} >
                            <Paper className="custom-paper">
                                <Toolbox />
                                <Settings />
                            </Paper>
                        </Grid>
                    </Grid>
                </Editor>
            </div>
        );
    }