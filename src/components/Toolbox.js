import React from "react";
import { Box, Typography, Grid, Button as MaterialButton } from "@mui/material";
import {Element} from "@craftjs/core"
import { useEditor } from "@craftjs/core";
import { ImageUpload } from "./ImageUpload";
import { Button } from "./Button";
import { Text } from "./Text";
import { Container } from "./Container";
import { Card } from "./Card";
import "../App.css";

export const Toolbox = () => {
    const { connectors, actions, query } = useEditor();

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageElement = <ImageUpload src={e.target.result} width={200} height={200} />;
                const nodeTree = query.parseReactElement(imageElement);
                actions.addNodeTree(nodeTree); // Inserisce il nodo in cima a tutti
            };
            reader.readAsDataURL(file);
            console.log(file)

        }
    };


    return (
        <Box className="right-panel" >
            <Grid container direction="column" alignItems="center" rowSpacing={2}>
                <h2 className="custom-typography" >Drag to add</h2>
                <Grid container direction="column" item>
                    <MaterialButton className="tool-btn" ref={(ref) => connectors.create(ref, <Button />)} fullWidth variant="contained">
                        Button
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton className="tool-btn" ref={(ref) => connectors.create(ref, <Text />)} fullWidth variant="contained">
                        Text
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton  className="tool-btn" ref={(ref) => connectors.create(ref, <Element is={Container} padding={30} background="#eee" canvas />)} fullWidth variant="contained">
                        Container
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton className="tool-btn" ref={(ref) => connectors.create(ref, <Card />)} fullWidth variant="contained">
                        Card
                    </MaterialButton>
                </Grid>
            </Grid>
        </Box>
    );
};
