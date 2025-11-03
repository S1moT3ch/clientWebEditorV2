import React, {useEffect, useRef, useState} from "react";
import { Rnd } from "react-rnd";
import {useEditor, useNode} from "@craftjs/core";
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    Slider,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box
} from "@mui/material";
import {HexColorPicker} from "react-colorful";
import {Stack} from "@mui/system";
import AddPhoto from '@mui/icons-material/AddAPhoto';
import Brightness1Icon from '@mui/icons-material/Brightness1';

// Componente principale Photo
export const Photo = ({ width, height, backgroundColor, src, borderRadius, borderWidth, borderColor, x, y, zIndex, children, aspectRatio, icon}) => {
    const { connectors: { connect, drag }, actions: { setProp } } = useNode();
    const { selected } = useEditor((state, query) => {
        const [currentNodeId] = state.events.selected;
        if (!currentNodeId) return { selected: null };
        return {
            selected: {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,
            }
        };
    });

    const {
        id: nodeId, // ID Craft.js del nodo
    } = useNode();

    return (
        <Rnd
            data-craft-node={nodeId}
            data-type="Photo"
            size={{ width, height }}
            position={{ x, y }}
            lockAspectRatio={aspectRatio || false}
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
            <div ref={connect} style={{ width: "100%", height: "100%", display: "flex", position: "relative", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                {children}
                {icon}
            </div>
        </Rnd>
    );
};

// Impostazioni del componente Photo
export const PhotoSettings = () => {
    const { actions: { setProp }, props } = useNode(node => ({ props: node.data.props }));

    const [cameraOpen, setCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        // Se non c'è un'immagine, mostra l'icona fotocamera cliccabile
        if (!props.src) {
            setProp(p => {
                p.icon = (
                    <AddPhoto
                        onClick={openCamera}
                        style={{
                            width: "2rem",
                            height: "auto",
                            cursor: "pointer",
                        }}
                    />
                );
            });
        }
    }, [props.src]); // 👈 aggiorna quando cambia la foto


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const maxWidth = 500;
                const maxHeight = 400;
                let width = img.width;
                let height = img.height;
                const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
                width *= ratio;
                height *= ratio;
                setProp(p => {
                    p.src = e.target.result;
                    p.width = width;
                    p.height = height;
                    p.aspectRatio = img.width / img.height;
                    p.borderWidth = 0;
                    p.icon = null;
                });
            }
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const openCamera = async () => {
        try {
            setCameraOpen(true);
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
            setStream(mediaStream);
        } catch (err) {
            console.error("Errore accesso webcam:", err);
        }
    };

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");

        setProp(p => {
            p.src = dataUrl;
            p.width = canvas.width > 500 ? 500 : canvas.width;
            p.height = canvas.height > 400 ? 400 : canvas.height;
            p.aspectRatio = canvas.width / canvas.height;
            p.borderWidth = 0;
            p.icon = null;
        });

        stream.getTracks().forEach(track => track.stop());
        setCameraOpen(false);
    };

    const closeCamera = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        setCameraOpen(false);
    };

    return (
        <div className="settings-div">
            <div className="settings-inner-div" style={{ justifyContent: "center", gap: "0.2rem"}}>
                {/* Buttton per upload dell'immagine di sfondo*/}
                <div>
                    <Stack direction="row" spacing={1} marginBottom={2.5} justifyContent="space-between">
                        <input type="file" accept="image/*" style={{ display: "none" }} id="photo-upload" onChange={handleImageChange} />
                        <label htmlFor="photo-upload">
                            <Button className="level-button" style={{ display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center" }} component="span" variant="outlined" >Upload a photo</Button>
                        </label>
                        <Button className="level-button" variant="outlined" onClick={openCamera}>Take a photo</Button>
                    </Stack>

                    <Dialog open={cameraOpen} onClose={closeCamera} style={{ zIndex:"10000" }}>
                        <DialogTitle>Take a photo</DialogTitle>
                        <DialogContent style={{ overflow:"hidden" }}>
                            <video ref={videoRef} style={{ width: "100%" }} />
                            <Brightness1Icon
                                style={{
                                    width: "4rem",
                                    height: "auto",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, 215%)",
                                    fontSize: 80,
                                    color: "rgba(255,255,255, 1)",
                                    cursor: "pointer",
                                    zIndex: "10001",
                                }}
                                onClick={takePhoto}
                            />
                            <div
                                style={{
                                    width: "34.5rem",
                                    height: "5rem",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, 158%)",
                                    color: "transparent",
                                    backgroundColor: "rgba(0,0,0, 0.4)",
                                    cursor: "pointer",
                                    zIndex: "10000",

                                }}
                            >
                                ok
                            </div>
                            <canvas ref={canvasRef} style={{ display: "none" }} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeCamera}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
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

// Configurazione Craft.js
Photo.craft = {
    props: {
        width: 200,
        height: 200,
        backgroundColor: "transparent",
        src: "",
        borderRadius: 0,
        borderWidth: 1,
        borderColor: "#000",
        x: 0,
        y: 0,
        zIndex: 1,
        aspectRatio: 1,
        icon: null,
    },
    related: {
        settings: PhotoSettings
    }
};