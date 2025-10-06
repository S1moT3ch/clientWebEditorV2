import React from "react";
import {
    Box,
    Grid,
    Button as MaterialButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Element, useEditor } from "@craftjs/core";
import { ImageUpload } from "./ImageUpload";
import { Button } from "./Button";
import { Text } from "./Text";
import { Container } from "./Container";
import { Card } from "./Card";
import { ResizableRect } from "./ResizableRect";
import { Arrow } from "./Arrow";
import "../App.css";

export const Toolbox = ({ layout }) => {
    const { connectors } = useEditor();

    const isFreeCanvas = layout === "free"; //Logica per verificare la modalità del layout

    return (
        <Box className="right-panel">
            {/*Menù a tendina per il toolbox*/}
            <Accordion sx={{ borderRadius: "20px", overflow: "hidden"}}>
                <AccordionSummary
                    className="right-panel"
                    expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                    aria-controls="toolbox-content"
                    id="toolbox-header"
                    sx={{
                        backgroundColor: "#140dd7",
                        color: "#ffffff",
                        fontWeight: "bold",
                        borderRadius: "20px",
                        minHeight: "48px",
                        '&.Mui-expanded': {
                            borderBottomLeftRadius: "0px",
                            borderBottomRightRadius: "0px" }
                    }}
                >
                    <Typography variant="h6">Components</Typography>
                </AccordionSummary>
                <AccordionDetails className="right-panel">
                    <Grid container direction="column" alignItems="center" rowSpacing={2} mr={1}>
                        <h2 className="custom-typography">Drag to add</h2>

                        <Grid container direction="column" item>
                            <MaterialButton
                                className="tool-btn"
                                ref={(ref) => connectors.create(ref, <Button />)}
                                variant="contained"
                            >
                                Button
                            </MaterialButton>
                        </Grid>

                        <Grid container direction="column" item>
                            <MaterialButton
                                className="tool-btn"
                                ref={(ref) => connectors.create(ref, <Text />)}
                                variant="contained"
                            >
                                Text
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
                                Container
                            </MaterialButton>
                        </Grid>

                        <Grid container direction="column" item>
                            <MaterialButton
                                className="tool-btn"
                                ref={(ref) => connectors.create(ref, <Card />)}
                                variant="contained"
                            >
                                Card
                            </MaterialButton>
                        </Grid>

                        <Grid container direction="column" item>
                            <MaterialButton
                                className="tool-btn"
                                ref={(ref) => connectors.create(ref, <ImageUpload />)}
                                variant="contained"
                            >
                                Image
                            </MaterialButton>
                        </Grid>

                        {/* Componenti visibili solo in modalità free-canvas */}
                        {isFreeCanvas && (
                            <>
                                <Grid container direction="column" item>
                                    <MaterialButton
                                        className="tool-btn"
                                        ref={(ref) =>
                                            connectors.create(ref, <ResizableRect><Text /></ResizableRect>)
                                        }
                                        variant="contained"
                                    >
                                        Rectangle
                                    </MaterialButton>
                                </Grid>

                                <Grid container direction="column" item>
                                    <MaterialButton
                                        className="tool-btn"
                                        ref={(ref) => connectors.create(ref, <Arrow />)}
                                        variant="contained"
                                    >
                                        Arrow
                                    </MaterialButton>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};
