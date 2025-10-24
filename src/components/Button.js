import React, { useRef } from "react";
import { FormControl, FormLabel, TextField, Slider, Button } from "@mui/material";
import {useNode} from "@craftjs/core";
import {HexColorPicker} from "react-colorful";
import "../App.css";
import {Stack} from "@mui/system";

export const CraftButton = ({ color = "#0000FF", colorText = "#ffffff",  width = 100, height = 50, children, borderRadius = 8, link, zIndex }) => {
    const {
        connectors: { connect, drag }, id,
        actions: { setProp }, props
    } = useNode((state) => ({
        isSelected: state.events.selected,
    }));

    const ref = useRef(null);

    //Definizione componente bottone
    const buttonEl = (
        <button className="base-btn" id={id}
            ref={(el) => {ref.current = el;
                connect(drag(el));}}
            style={{
                backgroundColor: color,
                color: colorText,
                fontSize: "16px",
                width: `${width}px`,
                height: `${height}px`,
                borderRadius: `${borderRadius}px`,
                cursor: link ? "pointer" : "default",
                zIndex: zIndex,
            }}
                onInput={(e) => setProp((e) => (props.children = e.target.children))}
        >
            {children}
        </button>
    );

    //Bottone con link
    return link ? (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
        >
            {buttonEl}
        </a>
    ) : (
        buttonEl
    )
};


const CraftButtonSettings = () => {
    const { actions: { setProp }, props } = useNode((node) => ({
        props: node.data.props
    }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <FormControl size="small" component="fieldset">
                <FormLabel className="custom-label">Text</FormLabel>
                <TextField
                    defaultValue={props.children}
                    onChange={(e) => setProp((props) => (props.children = e.target.value))}
                    multiline
                    maxRows={2}
                />
            </FormControl>

            {/* Form per gestione link */}
            <FormControl size="small" component="fieldset">
                <FormLabel className="custom-label">Link URL</FormLabel>
                <TextField
                    value={props.link || ""}
                    onChange={(e) => setProp((props) => (props.link = e.target.value))}
                    placeholder="https://example.com"
                />
            </FormControl>
            <FormControl size="small" component="fieldset">
                <FormLabel className="custom-label">Width</FormLabel>
                <Slider
                    defaultValue={props.width}
                    min={100}
                    max={1000}
                    onChange={(_, value) => setProp((props) => (props.width = value))}
                />
            </FormControl>
            <FormControl size="small" component="fieldset">
                <FormLabel className="custom-label">Height</FormLabel>
                <Slider
                    defaultValue={props.width}
                    min={50}
                    max={1000}
                    onChange={(_, value) => setProp((props) => (props.height = value))}
                />
            </FormControl>

            {/* Form per controllo del raggio dei bordi */}
            <FormControl size="small" component="fieldset">
                <FormLabel className="custom-label">Border Radius</FormLabel>
                <Slider
                    defaultValue={props.borderRadius}
                    min={0}
                    max={20}
                    onChange={(_, value) => setProp((props) => (props.borderRadius = value))}
                />
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel className="custom-label">Color</FormLabel>
                <HexColorPicker color={props.color || '#000'} onChange={color => {
                    setProp(props => props.color = color)
                }} />
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel className="custom-label">Font Color</FormLabel>
                <HexColorPicker color={props.colorText || '#000'} onChange={color => {
                    setProp(props => props.colorText = color)
                }} />
            </FormControl>

            <FormControl size="small" component="fieldset">
                {/* TextField per gestire il valore dello zIndex */}
                <FormLabel className="custom-label">Livello</FormLabel>
                <TextField
                    type="number"
                    size="small"
                    value={props.zIndex}
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
        </div>
    );
};

CraftButton.craft = {
    props: {
        color: "#1010f1",
        colorText: "#ffffff",
        fontSize: 16,
        width: 100,
        height: 50,
        children: "Click me",
        zIndex: 1
    },
    related: {
        settings: CraftButtonSettings
    }
};
