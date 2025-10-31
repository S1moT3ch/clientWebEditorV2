import React, {useEffect, useRef, useState} from "react";
import { Rnd } from "react-rnd";
import {useEditor, useNode} from "@craftjs/core";
import {Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Slider, TextField} from "@mui/material";
import {HexColorPicker} from "react-colorful";
import {Stack} from "@mui/system";

//Componente Rettangolo. Esso è ridimensionabile e ruotabile
export const ResizableRect = ({ width, height, backgroundColor, src, borderRadius, borderWidth, borderColor, x, y, zIndex, children}) => {
    const {
        connectors: { connect, drag },
        actions: { setProp }
    } = useNode();

    const { connectors, actions, selected } = useEditor((state, query) => {
        const [currentNodeId] = state.events.selected;
        let selected;


        if ( currentNodeId ) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,
            };
        }

        return {
            selected
        }
    });

    const {
        id: nodeId, // ID Craft.js del nodo
    } = useNode();

    const [disableDrag, setDisableDrag] = useState(false);

    // Se è selezionato un nodo di tipo Text rendi il rettangolo non draggabile, altrimenti il contrario
    useEffect(() => {
        if (selected?.name === "Text") {
            setDisableDrag(true);
        } else {
            setDisableDrag(false);
        }
    }, [selected]);

    return (
        //Uso di React-rnd
        <Rnd
            data-craft-node={nodeId}
            disableDragging={disableDrag} //Disabilita il drag se si sta interagebdo con i figli
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
                backgroundImage: `url(${src})`,
                backgroundSize: "100% 100%",
                borderRadius: `${borderRadius}px`,
                border: `${borderWidth}px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: zIndex,

            }}
        >
            <div
                ref={(ref) => connect(ref)} // Collegamento di solo un nodo DOM
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
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

    //Funzione caricamento nuova immagine
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const maxWidth = 500;
                    const maxHeight = 400;
                    let width = img.width;
                    let height = img.height;

                    const ratio = Math.min( maxWidth / width, maxHeight / height, 1);
                    width *= ratio;
                    height *= ratio;

                    setProp((props) => {
                        props.src = e.target.result;
                        props.width = width;
                        props.height = height;
                    }); // Salvo l'immagine nell'editor
                }
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="settings-div">
            <div className="settings-inner-div" style={{ justifyContent: "center", gap: "0.2rem"}}>
                {/* Form per controllo del colore del blocco */}
                <FormControl component="fieldset">
                    <FormLabel className="custom-label">Color</FormLabel>
                    <HexColorPicker className="settings-colorpicker" color={props.backgroundColor || '#000'} onChange={color => {
                        setProp(props => props.backgroundColor = color)
                    }} />
                </FormControl>
                {/* Checkbox per impostare lo sfondo trasparente*/}
                <FormControlLabel
                    className="custom-label"
                    control={
                        <Checkbox
                            checked={props.backgroundColor === "transparent"}
                            onChange={(e) =>
                                setProp((props) => {
                                    props.backgroundColor = e.target.checked
                                        ? "transparent"
                                        : "#ffe181"
                                })
                            }
                        />
                    }
                    label="Sfondo trasparente"
                />
                {/* Buttton per upload dell'immagine di sfondo*/}
                <div style={{ padding: "10px" }}>
                    <input
                        type="file"
                        accept="image/"
                        style={{ display: "none" }}
                        id="img-upload-settings-input"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="img-upload-settings-input">
                        <Button variant="contained" component="span" className="custom-label">
                            Upload a new image
                        </Button>
                    </label>
                </div>
            </div>
            <Box className="setting-slider-box">
                {/* Form per controllo del raggio dei bordi */}
                <FormControl size="small" component="fieldset">
                    <FormLabel className="custom-label">Border Radius</FormLabel>
                    <Slider
                        style={{ marginLeft: "1.3rem" }}
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
                        style={{ marginLeft: "1.3rem" }}
                        value={props.borderWidth || 1}
                        min={0}
                        max={20}
                        onChange={(_, value) => setProp(props => props.borderWidth = value)}
                    />
                </FormControl>
            </Box>

            <div className="settings-bottom-div">
            {/* Form per controllo del colore del bordo */}
            <FormControl component="fieldset">
                <FormLabel className="custom-label">Border Color</FormLabel>
                <HexColorPicker
                    className="settings-colorpicker"
                    color={props.borderColor || "#000"}
                    onChange={color => setProp(props => props.borderColor = color)}
                />
            </FormControl>

                <FormControl size="small" component="fieldset">
                    {/* TextField per gestire il valore dello zIndex */}
                    <FormLabel className="custom-label">Level</FormLabel>
                    <TextField
                        style={{ width: "14.5rem"}}
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
                        className="level-button"
                        variant="outlined"
                        size="small"
                        onClick={() =>
                            setProp((props) => (props.zIndex = Math.max((props.zIndex || 1) - 1, 0)))
                        }
                    >
                        Push downward
                    </Button>

                    <Button
                        className="level-button"
                        variant="outlined"
                        size="small"
                        onClick={() =>
                            setProp((props) => (props.zIndex = (props.zIndex || 1) + 1))
                        }
                    >
                        Push upward
                    </Button>
                </Stack>
            </div>
        </div>
    );
};

ResizableRect.craft = {
    props: {
        width: 200,
        height: 100,
        backgroundColor: "#ffe181",
        src: "",
        borderRadius: 0,
        borderWidth: 1,
        borderColor: "#000",
        x: 0,
        y: 0,
        zIndex: 1,
    },
    related: {
        settings: ResizableRectSettings
    }
};
