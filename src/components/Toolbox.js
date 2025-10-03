import React from "react";
import { Box, Grid, Button as MaterialButton } from "@mui/material";
import {Element} from "@craftjs/core"
import { useEditor } from "@craftjs/core";
import { ImageUpload } from "./ImageUpload";
import { Button } from "./Button";
import { Text } from "./Text";
import { Container } from "./Container";
import { Card } from "./Card";
import { ResizableRect } from "./ResizableRect";
import { Arrow } from "./Arrow";
import "../App.css";

export const Toolbox = () => {
    const { connectors } = useEditor();



    return (
        <Box className="right-panel">
            <Grid container direction="column" alignItems="center" rowSpacing={2} mr={1}>
                <h2 className="custom-typography" >Drag to add</h2>
                <Grid container direction="column" item>
                    <MaterialButton className="tool-btn" ref={(ref) => connectors.create(ref, <Button />)} variant="contained">
                        Button
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton className="tool-btn" ref={(ref) => connectors.create(ref, <Text />)} variant="contained">
                        Text
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>{/*Uso di un text vuoto per dare consistenza e visibilità al container*/}
                    <MaterialButton  className="tool-btn" ref={(ref) => connectors.create(ref, <Element is={Container}  canvas padding={20}><Text text=""/></Element>)} variant="contained">
                        Container
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton className="tool-btn" ref={(ref) => connectors.create(ref, <Card />)} variant="contained">
                        Card
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton className="tool-btn" ref={(ref) => connectors.create(ref, <ImageUpload />)} variant="contained">
                        Image
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>{/*Rettangolo con testo all'interno*/}
                    <MaterialButton className="tool-btn" ref={(ref) => connectors.create(ref, <ResizableRect><Text/></ResizableRect>)} variant="contained">
                        Rectangle
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton className="tool-btn" ref={(ref) => connectors.create(ref, <Arrow />)} variant="contained">
                        Arrow
                    </MaterialButton>
                </Grid>
            </Grid>
        </Box>
    );
};
