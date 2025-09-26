import React from "react";
import { Box, Grid, Button as MaterialButton } from "@mui/material";
import {Element} from "@craftjs/core"
import { useEditor } from "@craftjs/core";
import { ImageUpload } from "./ImageUpload";
import { Button } from "./Button";
import { Text } from "./Text";
import { Container } from "./Container";
import { Card } from "./Card";
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
                <Grid container direction="column" item>
                    <MaterialButton  className="tool-btn" ref={(ref) => connectors.create(ref, <Element is={Container}  canvas />)} variant="contained">
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
            </Grid>
        </Box>
    );
};
