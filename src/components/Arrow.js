import React, {useEffect, useRef, useState} from "react";
import { useNode, useEditor } from "@craftjs/core";
import { ArrowMovement} from "./ArrowMovement";
import {FormControl, FormLabel, TextField} from "@mui/material";
import {HexColorPicker} from "react-colorful";
import {Rnd} from "react-rnd"; //componente di resize

//Componente freccia
export const Arrow = ({ color, strokeWidth, length, rotation, x, y, width = 100, height = 50 }) => {
    const { connectors: { connect, drag }, actions: {setProp}, isSelected } = useNode((state) => ({
        isSelected: state.events.selected,
    }));

    const { actions: { setOptions }, query } = useEditor()

    const ref = useRef(null);

    const [isResizing, setIsResizing] = useState(false);
    const [isRotating, setIsRotating] = useState(false);

    //Ref callback:collega condizionalmente il drag solo se non si sta ridimensionando/ruotando
    const handleRef = (el) => {
        ref.current = el;
        if (!el) return;

        if (isResizing || isRotating) {
            connect(el);
        } else {
            connect(drag(el));
        }
    };

    // Riapplicazione del drag quando cambia lo stato isResizing/isRotating


    //Funzione per gestire il drag and drop
    const handleDragEnd = (e) => {
        if (isResizing) return; //Blocca il drag se si sta effettuando il resize
        const container = document.getElementById("ROOT");
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const left = e.clientX - rect.left;
        const top = e.clientY - rect.top;

        setProp((props) => {
            props.x = left;
            props.y = top;
        });
    };

    return (
        <Rnd
            data-type="Arrow"
            bounds="parent"
            size={{ width, height }}
            position={{ x, y }}
            onDragStop={(e, d) => {
                setProp((props) => {
                    props.x = d.x;
                    props.y = d.y;
                });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setProp((props) => {
                    props.width = ref.offsetWidth;
                    props.height = ref.offsetHeight;
                    props.x = position.x;
                    props.y = position.y;
                });
            }}
            style={{
                position: "absolute",
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "center center",
            }}
        >
            <div
                ref={(el) => {
                    ref.current = el;
                    connect(el);
                }}
                style={{
                    transform: `rotate(${rotation}deg)`,
                    left: x,
                    top: y,
                    transformOrigin: "left center",
                    width: length,
                    height: 50,
                    cursor: "move",
                    userSelect: "none"
                }}
            >
                {/* Contenitore comune per SVG freccia e Rettangolo di ridimensionamento e rotazione*/}
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    {/* Freccia */}
                    <svg
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${length} 50`}
                        style={{ position: "absolute", left: 0, top: 0 }}
                    >
                        <line
                            x1="0"
                            y1="25"
                            x2={length - 20}
                            y2="25"
                            stroke={color}
                            strokeWidth={strokeWidth}
                        />
                        <polygon points={`${length - 20},15 ${length},25 ${length - 20},35`} fill={color} />
                    </svg>

                    {/* Rettangolo con controlli */}
                    {isSelected && (
                        <ArrowMovement
                            width={length}
                            height={50}
                            rotation={0}
                            onResizeStart={() => {
                                setIsResizing(true);
                                setOptions((options) => ({ ...options, enabled: false }));
                            }}
                            onResize={({ width }) => setProp(props => (props.length = width))}
                            onResizeStop={() => {
                                setIsResizing(false);
                                setOptions((options) => ({ ...options, enabled: true }));
                            }}
                            onRotateStart={() => {
                                setIsRotating(true);
                                setOptions((options) => ({ ...options, enabled: false }));
                            }}
                            onRotate={(newRotation) => setProp(props => (props.rotation = newRotation))}
                            onRotateStop={() => {
                                setIsRotating(false);
                                setOptions((options) => ({ ...options, enabled: true }));
                            }}
                        />
                    )}
                </div>
            </div>
        </Rnd>
    );
};

const ArrowSettings = () => {
    const { actions: { setProp }, props } = useNode((node) => ({
        props: node.data.props
    }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {/* Form per il controllo del colore */}
            <FormControl component="fieldset">
                <FormLabel className="custom-label">Color</FormLabel>
                <HexColorPicker color={props.color || '#000'} onChange={color => {
                    setProp(props => props.color = color)
                }} />
            </FormControl>
        </div>
    );
};

Arrow.craft = {
    props:  {
        color: "#000",
        strokeWidth: 2,
        length: 100,
        rotation: 0,
        x: 0,
        y: 0,
        width: 100,
        height: 50
    },
    related: {
        settings: ArrowSettings
    }
};
