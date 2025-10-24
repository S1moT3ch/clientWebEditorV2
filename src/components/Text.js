import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNode } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Select,
    Slider,
    Switch,
    TextField
} from "@mui/material";
import { HexColorPicker } from "react-colorful";
import {Stack} from "@mui/system";

// Helper per caricare dinamicamente i font Google
const loadGoogleFont = (fontFamily) => {
    const linkId = `google-font-${fontFamily.replace(/\s+/g, '-')}`;
    if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}&display=swap`;
        document.head.appendChild(link);
    }
};

export const Text = ({ text, fontSize, color, editable, fontFamily, fontWeight, zIndex }) => {
    const { connectors: { connect, drag }, id, actions: { setProp }, isSelected } = useNode((state) => ({
        isSelected: state.events.selected,
    }));

    const ref = useRef(null);
    const contentEditableRef = useRef(null);
    const [size, setSize] = useState({ width:"auto", height:"auto" });
    const [availableFonts, setAvailableFonts] = useState([]);

    //Recupero font da Google Fonts
    useEffect(() => {
        const fetchFonts = async () => {
            try {
                const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCseJTyZMmYqbxk5kpCZU2OvTHJg83KgPk`);
                const data = await response.json();
                setAvailableFonts(data.items.map(f => f.family));
            } catch (error) {
                console.error("Errore nel caricamento dei font Google:", error);
            }
        };
        fetchFonts();
    }, []);

    // Carica dinamicamente il font selezionato
    useEffect(() => {
        if (fontFamily) loadGoogleFont(fontFamily);
    }, [fontFamily]);

    // Aggiorna le dimensioni della casella di testo
    const updateSize = () => {
        if (ref.current) {
            window.requestAnimationFrame(() => {
                const range = document.createRange();
                range.selectNodeContents(ref.current);
                const rect = range.getBoundingClientRect();
                setSize({ width: rect.width, height: rect.height });
            });
        }
    };

    useLayoutEffect(() => {
        updateSize();
    }, [text, fontSize, fontWeight, fontFamily]);

    // Shortcut per toggle modalità editabile
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "e") {
                e.preventDefault();
                if (isSelected) setProp(props => props.editable = !props.editable);
            }
        };
        if (!isSelected) setProp(props => props.editable = false);
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setProp, isSelected]);

    // Focus automatico in modalità edit
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
        <div ref={el => { ref.current = el; connect(drag(el)) }}
             id={id}
             style={{
                 outline: isSelected ? "2px solid blue" : "none",
                 width: size.width,
                 height: size.height,
                 display: "flex",
                 alignItems: "flex-start",
                 justifyContent: "flex-start",
                 padding: "2px",
                 zIndex: zIndex,
             }}>
            <ContentEditable
                innerRef={contentEditableRef}
                html={text}
                onInput={updateSize}
                onChange={(e) => { setProp(props => props.text = e.target.value); updateSize(); }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        setProp(props => props.text += "\n");
                        updateSize();
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
                disabled={!editable}
            />
        </div>
    );
};

//Pannello settings
const TextSettings = () => {
    const { actions: { setProp }, fontSize, fontWeight, editable, fontFamily, zIndex } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        fontWeight: node.data.props.fontWeight ?? "400",
        editable: node.data.props.editable,
        fontFamily: node.data.props.fontFamily,
        zIndex: node.data.props.zIndex,
    }));

    const [availableFonts, setAvailableFonts] = useState([]);

    useEffect(() => {
        const fetchFonts = async () => {
            try {
                const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCseJTyZMmYqbxk5kpCZU2OvTHJg83KgPk`);
                const data = await response.json();
                setAvailableFonts(data.items.map(f => f.family));
            } catch (error) {
                console.error("Errore nel caricamento dei font Google:", error);
            }
        };
        fetchFonts();
    }, []);

    //Caricamento dell font selezionato al momento della selezione
    const handleFontChange = (font) => {
        loadGoogleFont(font);
        setProp(props => props.fontFamily = font);
    };

    return (
        <>
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel component="legend" className="custom-label">Editable</FormLabel>
                <FormControlLabel
                    control={<Switch checked={editable} onChange={(_, checked) => setProp(props => props.editable = checked)} />}
                    label="Enable Editing"
                />
            </FormControl>
            <FormControl size="small" component="fieldset">
                <FormLabel component="legend" className="custom-label">Font Size</FormLabel>
                <Slider value={fontSize || 7} step={1} min={8} max={100}
                        onChange={(_, value) => setProp(props => props.fontSize = value)} />
            </FormControl>
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel className="custom-label">Font Color</FormLabel>
                <HexColorPicker onChange={color => setProp(props => props.color = color)} />
            </FormControl>

            {/* Form per cambiare font della scrittura */}
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel className="custom-label">Font Family</FormLabel>
                <Select value={fontFamily || "Poppins"} onChange={(e) => handleFontChange(e.target.value)}>
                    {availableFonts.map(font => (
                        <MenuItem key={font} value={font}>{font}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Form per gestire font normale o grassetto */}
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel className="custom-label">Font Weight</FormLabel>
                <Select value={fontWeight} onChange={(e) => setProp(props => props.fontWeight = e.target.value)}>
                    <MenuItem value="400">Normal</MenuItem>
                    <MenuItem value="700">Bold</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" component="fieldset">
                {/* TextField per gestire il valore dello zIndex */}
                <FormLabel className="custom-label">Livello</FormLabel>
                <TextField
                    type="number"
                    size="small"
                    value={zIndex || 1}
                    onChange={(e) =>
                        setProp((props) => (props.zIndex = parseInt(e.target.value, 10) || 0))
                    }
                >
                </TextField>
            </FormControl>

            {/* Pulsanti rapidi per gestire lo zIndex */}
            <Stack direction="row" spacing={1} justifyContent="space-between">
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                        setProp((props) => (props.zIndex = Math.max((props.zIndex || 1) - 1, 0)))
                    }
                >
                    Manda indietro
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                        setProp((props) => (props.zIndex = (props.zIndex || 1) + 1))
                    }
                >
                    Porta avanti
                </Button>
            </Stack>
        </>
    );
};

Text.craft = {
    props: {
        text: "Default text",
        fontSize: 20,
        color: "#000",
        editable: false, // La proprietà editabile di default è false
        fontFamily: "Poppins",
        fontWeight: "400"
    },
    related: { settings: TextSettings }
};
