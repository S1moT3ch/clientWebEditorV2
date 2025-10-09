import React, {useRef} from "react";
import { Rnd } from "react-rnd";
import { useNode } from "@craftjs/core";
import {FormControl, FormLabel, Slider, TextField} from "@mui/material";
import {HexColorPicker} from "react-colorful";

//Componente Rettangolo. Esso è ridimensionabile e ruotabile
export const ResizableRect = ({ width, height, backgroundColor, borderRadius, borderWidth, borderColor, x, y, children}) => {
    const {
        connectors: { connect, drag },
        actions: { setProp }
    } = useNode();

    return (
        //Uso di React-rnd
        <Rnd
            data-type="ResizableRect"
            size={{ width, height }}
            position={{ x, y }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setProp(props => {
                    props.width = ref.offsetWidth;
                    props.height = ref.offsetHeight;
                    props.x = position.x;
                    props.y = position.y;
                });
            }}
            onDragStop={(e, d) => {
                setProp(props => {
                    props.x = d.x;
                    props.y = d.y;
                });
            }}
            style={{
                backgroundColor,
                borderRadius: `${borderRadius}px`,
                border: `${borderWidth}px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

            }}
        >
            <div
                ref={(ref) => connect(drag(ref))} // Collegamento di solo un nodo DOM
                style={{ width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                }}
            >
                {children} {/* Il rettangolo può contenere figli */}
            </div>
        </Rnd>
    );
};

const ResizableRectSettings = () => {
    const { actions: { setProp }, props } = useNode((node) => ({
        props: node.data.props
    }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {/* Form per controllo del colore del blocco */}
            <FormControl component="fieldset">
                <FormLabel className="custom-label">Color</FormLabel>
                <HexColorPicker color={props.backgroundColor || '#000'} onChange={color => {
                    setProp(props => props.backgroundColor = color)
                }} />
            </FormControl>
            {/* Form per controllo del raggio dei bordi */}
            <FormControl size="small" component="fieldset">
                <FormLabel className="custom-label">Border Radius</FormLabel>
                <Slider
                    defaultValue={props.borderRadius}
                    min={0}
                    max={70}
                    onChange={(_, value) => setProp((props) => (props.borderRadius = value))}
                />
            </FormControl>
            {/* Form per controllo dello spessore del bordo */}
            <FormControl size="small" component="fieldset">
                <FormLabel className="custom-label">Border Width</FormLabel>
                <Slider
                    value={props.borderWidth || 1}
                    min={0}
                    max={20}
                    onChange={(_, value) => setProp(props => props.borderWidth = value)}
                />
            </FormControl>

            {/* Form per controllo del colore del bordo */}
            <FormControl component="fieldset">
                <FormLabel className="custom-label">Border Color</FormLabel>
                <HexColorPicker
                    color={props.borderColor || "#000"}
                    onChange={color => setProp(props => props.borderColor = color)}
                />
            </FormControl>
        </div>
    );
};

ResizableRect.craft = {
    props: {
        width: 200,
        height: 100,
        backgroundColor: "#ccc",
        borderRadius: 0,
        borderWidth: 1,
        borderColor: "#000",
        x: 0,
        y: 0
    },
    related: {
        settings: ResizableRectSettings
    }
};
