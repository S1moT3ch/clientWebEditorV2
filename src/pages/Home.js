import React, {useEffect, useState} from 'react';
import {Typography, Paper, Grid} from '@mui/material';
import "../App.css"
import {borderRadius, Box, margin} from '@mui/system';

import { Toolbox } from '../components/Toolbox';
import { Settings } from '../components/Settings';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
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

    // Modifica il layout del ROOT quando layout, rows o columns cambiano
    useEffect(() => {
        const container = document.getElementById("ROOT");
        if (container) {
            switch (layout) {
                case "grid":
                    container.style.setProperty("display", "grid");
                    container.style.setProperty("grid-template-rows", `repeat(${rows}, 1fr)`);
                    container.style.setProperty("grid-template-columns", `repeat(${columns}, 1fr)`);
                    break;
                case "column":
                    container.style.setProperty("display", "flex");
                    container.style.setProperty("flex-direction", "column");
                    break;
                case "row":
                default:
                    container.style.setProperty("display", "flex");
                    container.style.setProperty("flex-direction", "row");
                    break;
            }
        }
    }, [layout, rows, columns]);


    return (
            <div style={{display:"flex"}}>
                <Editor resolver={{Card, Button, Text, Container, CardTop, CardBottom}}>
                    <Grid container spacing={3} margin={0.5} style={{ display: "flex", flexWrap: "nowrap"}} >
                        <Grid item xs style={{ overflow:"hidden", flexGrow:1, maxWidth: "calc(100vw - 300px)"}}>
                            <h2 className="custom-typography" align="center" >Page Editor</h2>
                            <Topbar  layout={layout}
                                     setLayout={setLayout}
                                     rows={rows}
                                     setRows={setRows}
                                     columns={columns}
                                     setColumns={setColumns} />
                                <Frame>
                                    <Element is={Container}  padding={16} background="#eee" canvas >
                                        <Card/>
                                        <Button size="medium" variant="contained">Ciao</Button>
                                        <Text size="small" text="Hi world!" />
                                        <Text size="small"  text="It's me again!" />
                                    </Element>
                                </Frame>
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