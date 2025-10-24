import React, {useEffect, useRef, useState} from "react";
import { Rnd } from "react-rnd";
import {useEditor, useNode} from "@craftjs/core";
import {Button, Checkbox, FormControl, FormControlLabel, FormLabel, Slider, TextField, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {HexColorPicker} from "react-colorful";
import {Stack} from "@mui/system";

// Componente principale Photo
export const Photo = ({ width, height, backgroundColor, src, borderRadius, borderWidth, borderColor, x, y, zIndex, children}) => {
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

    return (
        <Rnd
            data-type="Photo"
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
            <div ref={connect} style={{ width: "100%", height: "100%", display: "flex", position: "relative", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                {children}
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
        });

        stream.getTracks().forEach(track => track.stop());
        setCameraOpen(false);
    };

    const closeCamera = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        setCameraOpen(false);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <FormControl component="fieldset">
                <FormLabel className="custom-label">Color</FormLabel>
                <HexColorPicker color={props.backgroundColor || '#000'} onChange={color => setProp(p => p.backgroundColor = color)} />
            </FormControl>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={props.backgroundColor === "transparent"}
                        onChange={(e) =>
                            setProp(p => { p.backgroundColor = e.target.checked ? "transparent" : "#ffe181"; })
                        }
                    />
                }
                label="Sfondo trasparente"
            />

            <div style={{ padding: "10px", display: "flex", gap: "10px" }}>
                <input type="file" accept="image/*" style={{ display: "none" }} id="photo-upload" onChange={handleImageChange} />
                <label htmlFor="photo-upload">
                    <Button variant="contained" component="span">Upload</Button>
                </label>
                <Button variant="contained" onClick={openCamera}>Scatta foto</Button>
            </div>

            <Dialog open={cameraOpen} onClose={closeCamera}>
                <DialogTitle>Scatta una foto</DialogTitle>
                <DialogContent>
                    <video ref={videoRef} style={{ width: "100%" }} />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={takePhoto}>Scatta</Button>
                    <Button onClick={closeCamera}>Chiudi</Button>
                </DialogActions>
            </Dialog>

            <FormControl size="small" component="fieldset">
                <FormLabel className="custom-label">Border Radius</FormLabel>
                <Slider defaultValue={props.borderRadius} min={0} max={70} onChange={(_, value) => setProp(p => p.borderRadius = value)} />
            </FormControl>

            <FormControl size="small" component="fieldset">
                <FormLabel className="custom-label">Border Width</FormLabel>
                <Slider value={props.borderWidth || 1} min={0} max={20} onChange={(_, value) => setProp(p => p.borderWidth = value)} />
            </FormControl>

            <FormControl component="fieldset">
                <FormLabel className="custom-label">Border Color</FormLabel>
                <HexColorPicker color={props.borderColor || "#000"} onChange={color => setProp(p => p.borderColor = color)} />
            </FormControl>

            <FormControl size="small" component="fieldset">
                <FormLabel className="custom-label">Livello</FormLabel>
                <TextField type="number" size="small" value={props.zIndex} onChange={(e) => setProp(p => p.zIndex = parseInt(e.target.value, 10) || 0)} />
            </FormControl>
        </div>
    );
};

// Configurazione Craft.js
Photo.craft = {
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
        zIndex: 1
    },
    related: {
        settings: PhotoSettings
    }
};