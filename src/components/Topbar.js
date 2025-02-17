import React from 'react';
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton } from "@mui/material";



export const Topbar = () => {
    return (
        <Box px={1} py={1} mt={3} mb={1} bgcolor={"rgba(0, 0, 0, 0.1)"}>
            <Grid container alignItems="center">
                <Grid item xs>
                    <FormControlLabel control={<Switch checked={true} />} label="Enable"/>
                </Grid>
                <Grid item>
                    <MaterialButton size="small" variant="outlined" color="secondary">Save</MaterialButton>
                </Grid>
            </Grid>
        </Box>
    )
}