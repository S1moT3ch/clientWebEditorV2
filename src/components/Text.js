import React, {useEffect, useState, useRef, useLayoutEffect} from "react";
import { useNode } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import {FormControl, FormControlLabel, FormLabel, MenuItem, Select, Slider, Switch} from "@mui/material";
import { HexColorPicker } from "react-colorful";
import {height, width} from "@mui/system";

export const Text = ({ text, fontSize, color, editable, fontFamily, fontWeight }) => {
    const {
        connectors: { connect, drag }, id,
        actions: { setProp }, isSelected
    } = useNode((state)=>({
        isSelected: state.events.selected,
    }));

    const ref = useRef(null);
    const contentEditableRef = useRef(null);
    const [size, setSize] = useState({ width:"auto", height:"auto" });

    //Funzione per aggionare la dimensione della casella di testo
    const updateSize = () => {
        if (ref.current) {
            window.requestAnimationFrame(() => {
                const range = document.createRange();
                range.selectNodeContents(ref.current);
                const rect = range.getBoundingClientRect();
                setSize({
                    width: rect.width,
                    height: rect.height
                });
            });
        }
    };


    useLayoutEffect(() => {
        updateSize();
    }, [text, fontSize, fontWeight, fontFamily]);

    //Listener globale alla tastiera per gestire le shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "e") {
                e.preventDefault();
                if (isSelected){
                    setProp(props => props.editable = !props.editable);
                }
            }
        };

        if (!isSelected){
            setProp(props => props.editable = false);
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [setProp, isSelected]);

    // Funzione per mettere il focus sul testo e mostrare il cursore se si è in modalità modifica
    useEffect(() => {
        if (editable && contentEditableRef.current) {
            contentEditableRef.current.focus();

            const range = document.createRange();
            range.selectNodeContents(contentEditableRef.current);
            range.collapse(false);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, [editable]);

    return (
        <div ref={el => {
            ref.current = el;
            connect(drag(el))
        }} className="text-comp"
             id={id}
             style={{
                 outline: isSelected ? "2px solid blue" : "none",
                 width: size.width,
                 height: size.height,
                 display: "flex",
                 alignItems: "flex-start",
                 justifyContent: "flex-start",
                 padding: "2px",
            }}>
            <ContentEditable
                innerRef={contentEditableRef}
                html={text}
                onInput={(e) => {
                    updateSize(); // Aggiorna dimensioni mentre viene scritto un nuovo testo
                }}
                onChange={(e) => {
                    setProp(props => props.text = e.target.value);
                    updateSize() //Aggiorna dimensioni
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Evita il comportamento predefinito
                        setProp(props => props.text += "\n"); // Aggiungi una nuova riga
                        updateSize() //Aggiorna dimensioni
                    }
                }}
                style={{
                    fontSize: `${fontSize}px`,
                    color,
                    whiteSpace: "pre",
                    fontFamily: fontFamily || "Poppins",
                    fontWeight: fontWeight || "normal",
                    cursor: editable ? "text" : "default",
                    outline: editable ? "1px dashed gray" : "none",
                }}
                disabled={!editable} // Disabilita ContentEditable se non è in modalità editabile
            />
        </div>
    );
}

// Settings per il componente Text
const TextSettings = () => {
    const {
        actions: { setProp }, fontSize, fontWeight, editable, fontFamily
    } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        fontWeight: node.data.props.fontWeight ?? "400",
        editable: node.data.props.editable, // Ottenimento la proprietà editable dal nodo
        fontFamily: node.data.props.fontFamily, // Ottenimento propietà fontFamily dal nodo
    }));

    return (
        <>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend" className="custom-label">Editable</FormLabel>
                <FormControlLabel
                    control={<Switch checked={editable} onChange={(_, checked) => setProp(props => props.editable = checked)} />}
                    label="Enable Editing"
                />
            </FormControl>
            <FormControl size="small" component="fieldset">
                <FormLabel component="legend" className="custom-label">Font Size</FormLabel>
                <Slider
                    value={fontSize || 7}
                    step={7}
                    min={8}
                    max={50}
                    onChange={(_, value) => {
                        setProp(props => props.fontSize = value);
                    }}
                />
            </FormControl>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend" className="custom-label">Font Color</FormLabel>
                <HexColorPicker defaultValue={"#000"} onChange={color => {
                    setProp(props => props.color = color)
                }} />
            </FormControl>
            {/* Form per cambiare font della scrittura */}
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel className="custom-label">Font Family</FormLabel>
                <Select
                    value={fontFamily || "Poppins"}
                    onChange={(e) =>
                        setProp((props) => (props.fontFamily = e.target.value))
                    }
                >
                    <MenuItem value="Poppins">Poppins</MenuItem>
                    <MenuItem value="Roboto">Roboto</MenuItem>
                    <MenuItem value="Arial">Arial</MenuItem>
                    <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                </Select>
            </FormControl>
            {/* Form per gestire font normale o grassetto */}
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel className="custom-label">Font Weight</FormLabel>
                <Select
                    value={fontWeight}
                    onChange={(e) =>
                        setProp((props) => (props.fontWeight = e.target.value))
                    }
                >
                    <MenuItem value="400">Normal</MenuItem>
                    <MenuItem value="700">Bold</MenuItem>
                </Select>
            </FormControl>
        </>
    );
}

Text.craft = {
    props: {
        text: "Default text",
        fontSize: 20,
        color: "#000",
        editable: false, // La proprietà editabile di default è false
        fontFamily: "Poppins",
        fontWeight: "400"
    },
    related: {
        settings: TextSettings
    }
};
