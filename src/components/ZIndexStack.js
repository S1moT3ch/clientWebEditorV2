import React, {useEffect} from "react";
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

        // Ottenimento di tutti i nodi e il relativo zIndex
        const nodesArray = Object.values(state.nodes)
            .filter(
                (node) =>
                    node.data.name !== "br" &&
                    node.data.name !== "CardTop" &&
                    node.data.name !== "CardBottom" &&
                    node.data.name !== "DraggableChild"
            )
            .sort((a, b) => (b.data.props.zIndex || 0) - (a.data.props.zIndex || 0));

        return {
            selected: selectedNode,
            nodesArray,
        };
    });

    // Funzione per selezionare un elemento dallo stack
    const handleSelect = (id) => {
        actions.selectNode(id);
    };

    // Funzione per ottenere un'anteprima del testo contenuto in ogni nodo in modo ricorsivo
    const getTextFromNode = (node, state) => {
        const { props, nodes } = node.data;

        let textParts = [];
        if (node.id === "ROOT") return "";
        if (typeof props.text === "string") textParts.push(props.text);
        if (typeof props.content === "string") textParts.push(props.content);

        if (typeof props.children === "string") {
            textParts.push(props.children);
        }

        if (node.data.nodes && node.data.nodes.length > 0) {
            node.data.nodes.forEach((childId) => {
                const childNode = state.nodes[childId];
                if (childNode) {
                    textParts.push(getTextFromNode(childNode, state));
                }
            });
        }

        return textParts.join(" ").trim().replace(/\s+/g, " ");
    };

    const { query } = useEditor();

    // Funzione per generare una breve anteprima testuale
    const getTextPreview = (node, state) => {
        const text = getTextFromNode(node, state);
        if (!text) return "";
        return text.length > 7 ? text.substring(0, 7) + "..." : text;
    };

    // Uso delle frecce su e giù per modificare lo zIndex del nodo selezionato
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selected?.id) return;

            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();

                const state = query.getState();
                const node = state.nodes[selected.id];
                const currentZ = node?.data?.props?.zIndex ?? 1;

                let newZ = currentZ;
                if (e.key === "ArrowUp") newZ = currentZ + 1;
                if (e.key === "ArrowDown") newZ = Math.max(0, currentZ - 1);

                actions.setProp(selected.id, (props) => {
                    props.zIndex = newZ;
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selected, actions, query]);

    return (
        <Paper sx={{ p: 2, backgroundColor: "#dedcdc" }}>
            <Typography className="custom-typography">Levels</Typography>
            <Stack spacing={1}>
                {nodesArray.map((node) => {
                    const isSelected = selected?.id === node.id;
                    const state = query.getState();
                    const previewText = getTextPreview(node, state);

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
                                {previewText && (
                                    <Typography
                                        variant="caption"
                                        sx={{ ml:1, color: "text.secondary" }}
                                    >
                                        {`(${previewText})`}
                                    </Typography>
                                )}
                            </Typography>

                            <Typography size="small" sx={{ width: 55, textAlign: "right" }}>
                                {node.data.props.zIndex ?? 1}
                            </Typography>
                        </Stack>
                    );
                })}
            </Stack>
        </Paper>
    );
};
