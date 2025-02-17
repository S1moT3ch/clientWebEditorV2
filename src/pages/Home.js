import React from 'react';
import {Typography, Paper, Grid} from '@mui/material';


import { Toolbox } from '../components/Toolbox';
import { Settings } from '../components/Settings';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { Topbar } from '../components/Topbar';

import { Editor, Frame, Element} from "@craftjs/core";

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
        return (
            <div style={{margin: "auto"}}>
                <Editor resolver={{Card, Button, Text, Container}}>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Typography variant="h5" align="center" mt="10px">A super simple page editor</Typography>
                            <Topbar />
                            <Frame>
                                <Element is={Container} padding={16} background="#eee" canvas>
                                    <Card />
                                    <Button size="large" variant="outlined">Ciao</Button>
                                    <Text size="small" text="Hi world!" />
                                    <Element is={Container} padding={6} background="#999" canvas>
                                        <Text size="small"  text="It's me again!" />
                                    </Element>
                                </Element>
                            </Frame>
                            </Grid>
                        <Grid item xs={2} mr={3} mt="65px" >
                            <Paper>
                                <Toolbox />
                                <Settings />
                            </Paper>
                        </Grid>
                    </Grid>
                </Editor>
            </div>
        );
    }