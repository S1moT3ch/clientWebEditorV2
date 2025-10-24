import React from "react";
import { useEditor } from "@craftjs/core";
import { Stack, Typography, TextField, Paper } from "@mui/material";

export const ZIndexStack = () => {
    const { actions, selected, query, nodesArray } = useEditor((state) => {
        const [currentNodeId] = state.events.selected;
        let selectedNode;


        if ( currentNodeId ) {
            selectedNode = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,

            };
        }

        //Ottenimento di tutti i nodi con zIndex
        const nodesArray = Object.values(state.nodes)
            .filter((node) => node.data.name !== "br" && node.data.name !== "CardTop"&& node.data.name !== "CardBottom")
            .sort((a, b) => (b.data.props.zIndex || 0) - (a.data.props.zIndex || 0));

        return {
            selected: selectedNode,
            actions: state.actions,
            query: state.query,
            nodesArray,
        };
    });




    return (
        <Paper sx={{ p: 2 }}>
            <Typography className="custom-typography">Livello</Typography>
            <Stack spacing={1}>
                {nodesArray.map((node) => {
                    return (
                        <Stack
                            key={node.id}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                p: 0.5,
                                borderRadius: 1,
                                bgcolor: selected?.id === node.id ? "primary.light" : "grey.100"
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ flex: 1,}}>
                                {node.data.name}
                            </Typography>

                            <Typography
                                size="small"
                                sx={{ width: 55 }}
                            >
                                {node.data.props.zIndex ?? 1}
                            </Typography>
                        </Stack>
                    );
                })}
            </Stack>
        </Paper>
    );
};
