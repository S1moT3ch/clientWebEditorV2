import React, { useEffect, useState, useRef } from 'react';
import { Paper, Grid } from '@mui/material';
import "../App.css";

import { Toolbox } from '../components/Toolbox';
import { Settings } from '../components/Settings';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { ImageUpload } from '../components/ImageUpload';
import { Card, CardTop, CardBottom } from '../components/Card';
import { ResizableRect } from "../components/ResizableRect";
import { Arrow } from "../components/Arrow";
import { Topbar } from '../components/Topbar';
import "../App.css";

import { Editor, Frame, Element} from "@craftjs/core";
import {DraggableItem} from "../components/DraggableItem";
import {ResizableRectWrapper} from "../components/ResizableRectWrapper";

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
        //In modalità free canvas
        const container = document.getElementById("ROOT");
        if (!container) return;

        const type = e.dataTransfer.getData("component-type");
        if (!type) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

            const { actions, query } = editorRef.current;
            const componentMap = {
                Arrow,
                Button,
                Text,
                ImageUpload,
                Card,
                ResizableRectWrapper,
                Container,
            };

            const Component = componentMap[type];
            if (!Component) return;

            const nodeTree = query.parseReactElement(
                <Component x={x} y={y} />
            ).toNodeTree();

            actions.addNodeTree(nodeTree, "ROOT");
        };
    };

    const containerRef = useRef(null);
    const editorRef = useRef(null);

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
                        el.style.setProperty("position", "absolute");
                    });
                    container.classList.add("free-canvas");
                    break;
            }
        }
    }, [layout, rows, columns, width, height]);

    return (
        <div style={{ display: "flex" }}>
            <Editor ref={editorRef} resolver={{ Card, Button, Text, Container, CardTop, CardBottom, ImageUpload, ResizableRect, ResizableRectWrapper, Arrow, DraggableItem }}>
                <Grid className="home-grid" container spacing={3} margin={0.5}>
                    <Grid className="side-grid" item xs>
                        <h2 className="custom-typography" align="center">Page Editor</h2>
                        <Topbar {...{ layout, setLayout, rows, setRows, columns, setColumns, width, setWidth, height, setHeight }} />
                        <div onDragStart={getDraggedElementId} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onDragEnd={(e) => e.preventDefault()}>
                            <Frame>
                                <Element is={Container} padding={10} canvas ref={containerRef}>
                                    <Card />
                                    <Button size="medium" variant="contained">Ciao</Button>
                                    <Text size="small" text="Hi world!" />
                                    <Text size="small" text="It's me again!" />
                                </Element>
                            </Frame>
                        </div>
                    </Grid>
                    <Grid item xs={2} mr={5}>
                        <Paper className="custom-paper">
                            <Toolbox layout={layout}/> {/*Per rendering condizionale*/}
                            <Settings />
                        </Paper>
                    </Grid>
                </Grid>
            </Editor>
        </div>
    );
}
