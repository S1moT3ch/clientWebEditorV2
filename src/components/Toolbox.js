//questo toolbox permetterà all'utente di creare nuove istanze dei componenti definiti
//mediante drag and drop
//ci aiuteranno i componenti predefiniti di material ui come grid

import React from "react";
import { Box, Typography, Grid, Button as MaterialButton} from  "@mui/material";

export const Toolbox = () => {
    return (
        <Box px={2} py={2}>
            <Grid container direction = "column" alignItems="center" justify="center" spacing={2}>
                <Box>
                    <Typography>Drag to add</Typography>
                </Box>
            <Grid container direction="column" item>
                <MaterialButton variant="contained">Button</MaterialButton>
            </Grid>
            <Grid container direction="column" item>
                <MaterialButton variant="contained">Text</MaterialButton>
            </Grid>
            <Grid container direction="column" item>
                <MaterialButton variant="contained">Container</MaterialButton>
            </Grid>
            <Grid container direction="column" item>
                <MaterialButton variant="contained">Card</MaterialButton>
            </Grid>
            </Grid>
        </Box>
    )
}