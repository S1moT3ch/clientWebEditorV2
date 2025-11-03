import React, {useEffect, useState} from "react";
import {
    Box,
    Grid,
    Button as MaterialButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography
} from "@mui/material";

//import icone
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import ImageIcon from "@mui/icons-material/Image";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import ViewDay from "@mui/icons-material/ViewDay";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { Element, useEditor } from "@craftjs/core";
import { ImageUpload } from "./ImageUpload";
import { CraftButton as Button } from "./Button";
import { Text } from "./Text";
import { Container } from "./Container";
import { Card } from "./Card";
import { ResizableRect } from "./ResizableRect";
import { DraggableChild } from "./DraggableChild";
import { Arrow } from "./Arrow";
import { Photo } from "./Photo";
import "../App.css";

export const Toolbox = ({ layout }) => {
    const { connectors, actions, selected } = useEditor((state, query) => {
        const [currentNodeId] = state.events.selected;
        let selected;


        if ( currentNodeId ) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,
                settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
                isDeletable: query.node(currentNodeId).isDeletable()

            };
        }

        return {
            selected
        }
    });

    const [expanded, setExpanded] = useState(true);

    const isFreeCanvas = layout === "free"; //Logica per verificare la modalità del layout


    // Se è selezionato un nodo (tranne il CardTop ed il CardBottom), chiudi la tendina, altrimeti aprila
    useEffect(() => {
        if (selected) {
            setExpanded(false);
            if (selected.name === "CardTop") {
                setExpanded(true);
            } else if (selected.name === "CardBottom") {
                setExpanded(true);
            }
        } else {
            setExpanded(true);
        }
    }, [selected]);



    //Funzione per gestire l'apertura della tendina toolbox
    const handleAccordionChange = (_, newExpanded) => {
        setExpanded(newExpanded);
    };

    //Listener globale alla tastiera per gestire le shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "c") {
                e.preventDefault();
                setExpanded(prev => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    return (
        <Box className="right-panel">
            {/*Menù a tendina per il toolbox*/}
            <Accordion
                sx={{ borderRadius: "20px", overflow: "hidden", width: "15rem"}}
                expanded={expanded}
                onChange={handleAccordionChange}
            >
                <AccordionSummary
                    className="toolbox-summary"
                    expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                    aria-controls="toolbox-content"
                    id="toolbox-header"
                    sx={{
                        backgroundColor: "#140dd7",
                        color: "#ffffff",
                        fontWeight: "bold",
                        borderRadius: "20px",
                        "&.Mui-expanded": {
                            borderBottomLeftRadius: "0px",
                            borderBottomRightRadius: "0px"
                        }
                    }}
                >
                    <WidgetsIcon sx={{ mr: 1}} />
                    <Typography variant="h6">Components</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container direction="column" alignItems="center" rowSpacing={2} mr={1}>

                        <h2 className="custom-typography">Drag to add</h2>

                        {/*Layout a griglia per il toolbox*/}
                        <Grid container className="toolbox-grid" spacing={2} justifyContent="center">
                            <Grid container direction="column" item>
                                <MaterialButton
                                    className="tool-btn"
                                    ref={(ref) => connectors.create(ref, <Button />)}
                                    variant="contained"
                                >
                                    <div className="tool-btn-content">
                                        <SmartButtonIcon />
                                        Button
                                    </div>
                                </MaterialButton>
                            </Grid>

                            <Grid container direction="column" item>
                                <MaterialButton
                                    className="tool-btn"
                                    ref={(ref) => connectors.create(ref, <Text />)}
                                    variant="contained"
                                >
                                    <div className="tool-btn-content">
                                        <TextFieldsIcon />
                                        Text
                                    </div>
                                </MaterialButton>
                            </Grid>

                            <Grid container direction="column" item>
                                <MaterialButton
                                    className="tool-btn"
                                    ref={(ref) =>
                                        connectors.create(
                                            ref,
                                            <Element is={Container} canvas padding={20}>
                                                <Text text="" />
                                            </Element>
                                        )
                                    }
                                    variant="contained"
                                >
                                    <div className="tool-btn-content">
                                        <ViewAgendaIcon />
                                        Container
                                    </div>
                                </MaterialButton>
                            </Grid>

                            <Grid container direction="column" item>
                                <MaterialButton
                                    className="tool-btn"
                                    ref={(ref) => connectors.create(ref, <Card />)}
                                    variant="contained"
                                >
                                    <div className="tool-btn-content">
                                        <ViewDay />
                                        Card
                                    </div>
                                </MaterialButton>
                            </Grid>

                            <Grid container direction="column" item>
                                <MaterialButton
                                    className="tool-btn"
                                    ref={(ref) => connectors.create(ref, <ImageUpload />)}
                                    variant="contained"
                                >
                                    <div className="tool-btn-content">
                                        <ImageIcon />
                                        Image
                                    </div>
                                </MaterialButton>
                            </Grid>

                            {/* Componenti visibili solo in modalità free-canvas */}
                            {isFreeCanvas && (
                                <>
                                    <Grid container direction="column" item>
                                        <MaterialButton
                                            className="tool-btn"
                                            ref={(ref) => connectors.create(ref, <ResizableRect><DraggableChild><Text/></DraggableChild></ResizableRect>)}
                                            variant="contained"
                                        >
                                            <div className="tool-btn-content">
                                                <CropSquareIcon />
                                                Rectangle
                                            </div>
                                        </MaterialButton>
                                    </Grid>


                                    <Grid container direction="column" item>
                                        <MaterialButton
                                            className="tool-btn"
                                            ref={(ref) => connectors.create(ref, <Arrow />)}
                                            variant="contained"
                                        >
                                            <div className="tool-btn-content">
                                                <ArrowRightAltIcon />
                                                Arrow
                                            </div>
                                        </MaterialButton>
                                    </Grid>

                                    <Grid container direction="column" item>
                                        <MaterialButton
                                            className="tool-btn"
                                            ref={(ref) => connectors.create(ref, <Photo />)}
                                            variant="contained"
                                        >
                                            <div className="tool-btn-content">
                                                <PhotoCameraIcon />
                                                Photo
                                            </div>
                                        </MaterialButton>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};
