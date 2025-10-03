import React, {useEffect, useState} from "react";
import {Box, IconButton} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

import {useEditor} from "@craftjs/core";

export const UndoRedo = () => {

    //dichiarazione di useEditor di Craft.js con le variabili per determinare se si può effettuare undo/redo
    const { query,
        actions,
        canUndo,
        canRedo
    } = useEditor(
        (state, query) => ({
            canUndo: query.history.canUndo(),
            canRedo: query.history.canRedo(),
        })
    );

    //Funzione per ripristinare uno stato precedente
    const handleUndo = () => {
        actions.history.undo();
    };

    //Funzione per ripristinare uno stato "futuro"
    const handleRedo = () => {
        actions.history.redo();
    };

    //Listener globale alla tastiera per gestire le shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === "z") {
                e.preventDefault();
                handleUndo();
            }
            if ((e.ctrlKey && e.key.toLowerCase() === "y") || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z")) {
                e.preventDefault();
                handleRedo();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [canUndo, canRedo]);


    return(
        <Box>
            <IconButton onClick={handleUndo} disabled={!canUndo}>
                <UndoIcon />
            </IconButton>
            <IconButton onClick={handleRedo} disabled={!canRedo}>
                <RedoIcon />
            </IconButton>
        </Box>
    );
};
