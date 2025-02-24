import React from "react";
import { Box, Typography, Grid, Button as MaterialButton } from "@mui/material";
import {Element} from "@craftjs/core"
import { useEditor } from "@craftjs/core";
import { ImageUpload } from "./ImageUpload";
import { Button } from "./Button";
import { Text } from "./Text";
import { Container } from "./Container";
import { Card } from "./Card";

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
            <Grid container direction="column" alignItems="center" spacing={2} mt={2}>
                <Typography>Drag to add</Typography>
                <Grid container direction="column" item>
                    <MaterialButton ref={(ref) => connectors.create(ref, <Button />)} variant="contained">
                        Button
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton ref={(ref) => connectors.create(ref, <Text />)} variant="contained">
                        Text
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton
                        ref={(ref) =>
                            connectors.create(ref, <Element is={Container} padding={30} background="#eee" canvas />)
                        }
                        variant="contained"
                    >
                        Container
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton ref={(ref) => connectors.create(ref, <Card />)} variant="contained">
                        Card
                    </MaterialButton>
                </Grid>
                {/* Pulsante per l'upload dell'immagine */}
                <Grid container direction="column" item>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                        id="image-upload"
                    />
                    <label htmlFor="image-upload">
                        <MaterialButton component="span" variant="contained" fullWidth>
                            Upload Image
                        </MaterialButton>
                    </label>
                </Grid>
            </Grid>
        </Box>
    );
};
