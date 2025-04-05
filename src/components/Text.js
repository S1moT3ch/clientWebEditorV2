import React, { useEffect, useRef } from "react";
import { useNode } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import { FormControl, FormControlLabel, FormLabel, Slider, Switch } from "@mui/material";
import { HexColorPicker } from "react-colorful";

export const Text = ({ text, fontSize, color, editable }) => {
    const {
        connectors: { connect, drag }, id,
        actions: { setProp }, isSelected
    } = useNode((state)=>({
        isSelected: state.events.selected
    }));

    const ref = useRef(null);

    // Funzione per gestire l'editabilità del componente
    useEffect(() => {
        // Se l'editabilità cambia, possiamo fare qualcosa in più se necessario
    }, [editable]);

    return (
        <div ref={el => {
            ref.current = el;
            connect(drag(el))
        }} className="text-comp" id={id} style={{outline: isSelected ? "2px solid blue" : "none"}}>
            <ContentEditable
                html={text}
                onChange={(e) => {
                    setProp(props => props.text = e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Evita il comportamento predefinito
                        setProp(props => props.text += "\n"); // Aggiungi una nuova riga
                    }
                }}
                style={{ fontSize: `${fontSize}px`, color, whiteSpace: "pre-line"}}
                disabled={!editable} // Disabilita ContentEditable se non è in modalità editabile
            />
        </div>
    );
}

// Settings per il componente Text
const TextSettings = () => {
    const {
        actions: { setProp }, fontSize, fontWeight, editable
    } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        fontWeight: node.data.props.fontWeight,
        editable: node.data.props.editable // Otteniamo la proprietà editable dal nodo
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
        </>
    );
}

Text.craft = {
    props: {
        text: "Default text",
        fontSize: 20,
        color: "#000",
        editable: false // La proprietà editabile di default è false
    },
    related: {
        settings: TextSettings
    }
};
