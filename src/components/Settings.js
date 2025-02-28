import React, {useState} from "react";
import {Box, Chip, Grid, Typography, Button as MaterialButton, FormControl, Slider, FormLabel} from "@mui/material";
import {useEditor} from "@craftjs/core";
import "../App.css"


//qui l'utente potrà modificare i componenti definiti


//ora che ho creato i settings personalizzati per ogni componenti, devo gestire la renderizzazione di questi settings
//sul settingpanel , grazie al container che mantiene nel suo stato interno il selected node
//facciamo funzionare anche il tasto delete tramite l'hood di useEditor isDeletable
export const Settings = () => {
    const { actions, selected } = useEditor((state, query) => {
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



    return selected ? (
        <Box className="right-panel">
            <Grid container direction="column" spacing={0}>
                <Grid item>
                    <Box pb={2}>
                        <Grid container p={1} alignItems="center" flexWrap="wrap" >
                            <Typography variant="subtitle1">Selected</Typography>
                            <Box p={1}>
                                <Chip size="small" color="primary" label={selected.name}  />
                            </Box>
                        </Grid>
                    </Box>
                </Grid>
                {
                    selected.settings && React.createElement(selected.settings)
                }
                {
                    selected.isDeletable ? (
                        <MaterialButton style={{marginTop: "30px"}}
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                actions.delete(selected.id);
                            }}
                        >
                            Delete
                        </MaterialButton>
                    ) : null
                }
            </Grid>
        </Box>
    ) : null
}

