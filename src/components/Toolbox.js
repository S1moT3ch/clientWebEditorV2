//questo toolbox permetterà all'utente di creare nuove istanze dei componenti definiti
//mediante drag and drop
//ci aiuteranno i componenti predefiniti di material ui come grid

import React from "react";
import { Box, Typography, Grid, Button as MaterialButton} from  "@mui/material";
import {useEditor, Element} from "@craftjs/core";

import {Button} from "./Button";
import {Text} from "./Text";
import {Container} from "./Container";
import {Card} from "./Card";

//ora vado ad implementare la toolbox , che creerà nuove istanze dei componenti definiti

export const Toolbox = () => {
    const { connectors, query } = useEditor();
    return (
        <Box px={2} py={2}>
            <Grid container direction = "column" alignItems="center" justify="center" spacing={2}>
                <Box>
                    <Typography>Drag to add</Typography>
                </Box>
            <Grid container direction="column" item>
                <MaterialButton ref={ref => connectors.create(ref, <Button />)} variant="contained">Button</MaterialButton>
            </Grid>
            <Grid container direction="column" item>
                <MaterialButton ref={ref => connectors.create(ref, <Text />)} variant="contained">Text</MaterialButton>
            </Grid>
            <Grid container direction="column" item>
                <MaterialButton ref={ref => connectors.create(ref, <Container padding={30} background="#eee" canvas/>)} variant="contained">Container</MaterialButton>
            </Grid>
            <Grid container direction="column" item>
                <MaterialButton ref={ref => connectors.create(ref, <Card />)} variant="contained">Card</MaterialButton>
            </Grid>
            </Grid>
        </Box>
    )
}