import React from "react";
import { useEditor } from "@craftjs/core";
import { Stack, Typography, Paper } from "@mui/material";

export const ZIndexStack = () => {
    const { actions, selected, nodesArray } = useEditor((state) => {
        const [currentNodeId] = state.events.selected;
        let selectedNode;

        if (currentNodeId) {
            selectedNode = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,
            };
        }

        // Ottenimento di tutti i nodi con zIndex
        const nodesArray = Object.values(state.nodes)
            .filter(
                (node) =>
                    node.data.name !== "br" &&
                    node.data.name !== "CardTop" &&
                    node.data.name !== "CardBottom"
            )
            .sort(
                (a, b) => (b.data.props.zIndex || 0) - (a.data.props.zIndex || 0)
            );

        return {
            selected: selectedNode,
            nodesArray,
        };
    });

    // Funzione per selezionare un elemento dallo stack
    const handleSelect = (id) => {
        actions.selectNode(id);
    };

    return (
        <Paper sx={{ p: 2, backgroundColor: "#dedcdc" }} >
            <Typography className="custom-typography">Levels</Typography>
            <Stack spacing={1}>
                {nodesArray.map((node) => {
                    const isSelected = selected?.id === node.id;

                    return (
                        <Stack
                            className="level-stack"
                            key={node.id}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            onClick={() => handleSelect(node.id)}
                            sx={{
                                p: 0.5,
                                borderRadius: 1,
                                cursor: "pointer",
                                bgcolor: isSelected ? "#a7afd2" : "grey.100",
                                "&:hover": {
                                    bgcolor: isSelected ? "primary.main" : "grey.200",
                                },
                            }}
                        >
                            <Typography variant="body2" sx={{ flex: 1 }}>
                                {node.data.name}
                            </Typography>

                            <Typography size="small" sx={{ width: 55 }}>
                                {node.data.props.zIndex ?? 1}
                            </Typography>
                        </Stack>
                    );
                })}
            </Stack>
        </Paper>
    );
};
