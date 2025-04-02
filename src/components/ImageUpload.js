import React, { useState, useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";
import { Box, Button } from "@mui/material";
import { Resizable } from "re-resizable";

// Placeholder + image upload
export const ImageUpload = ({ src, width = 200, height = 200 }) => {
    const {
        connectors: { connect, drag }, id,
        actions: { setProp },
        selected,
    } = useNode();

    const [imageSrc, setImageSrc] = useState(src || ""); // Inizializza con l'immagine passata
    const [dimensions, setDimensions] = useState({ width, height });
    const [imageLoaded, setImageLoaded] = useState(false); // Stato per il caricamento dell'immagine
    const imgRef = useRef(null); // Riferimento per l'immagine
    const [dragging, setDragging] = useState(false); // Stato per determinare se si sta draggando

    // Funzione per gestire il caricamento dell'immagine tramite file input
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target.result); // Imposto l'immagine selezionata
                setProp((props) => (props.src = e.target.result)); // Salvo l'immagine nell'editor
            };
            reader.readAsDataURL(file);
        }
    };

    // Effetto per il caricamento dell'immagine
    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.onload = () => {
                setImageLoaded(true);
                const imgWidth = imgRef.current.naturalWidth;
                const imgHeight = imgRef.current.naturalHeight;

                const maxDimension = 500;
                const ratio = Math.min(maxDimension / imgWidth, maxDimension / imgHeight);

                setDimensions({
                    width: imgWidth * ratio,
                    height: imgHeight * ratio,
                });

                setProp((props) => {
                    props.width = imgWidth * ratio;
                    props.height = imgHeight * ratio;
                });
            };
        }
    }, [imageSrc]);

    return (
        <Resizable
            size={{ width: dimensions.width, height: dimensions.height }}
            minWidth={50}
            minHeight={50}
            enable={{
                bottomRight: true,
            }}
            onResizeStop={(e, direction, ref, d) => {
                // Calcoliamo la nuova dimensione basata sul lato
                const newWidth = ref.offsetWidth;
                const newHeight = ref.offsetHeight;

                // Mantieni il rapporto di aspetto dell'immagine durante il ridimensionamento
                const aspectRatio = dimensions.width / dimensions.height;
                const newHeightBasedOnWidth = newWidth / aspectRatio;
                const newWidthBasedOnHeight = newHeight * aspectRatio;

                // Se il nuovo valore di larghezza è maggiore della larghezza originale, aggiorna la dimensione
                if (newHeightBasedOnWidth <= newHeight) {
                    setDimensions({
                        width: newWidth,
                        height: newHeightBasedOnWidth, // Mantieni il rapporto
                    });

                    setProp((props) => {
                        props.width = newWidth;
                        props.height = newHeightBasedOnWidth;
                    });
                } else {
                    setDimensions({
                        width: newWidthBasedOnHeight, // Mantieni la stessa altezza
                        height: newHeight,
                    });

                    setProp((props) => {
                        props.width = newWidthBasedOnHeight;
                        props.height = newHeight;
                    });
                }
            }}
            style={{
                zIndex: 1,
                position: "relative",
                cursor: dragging ? "move" : "default", // Cambia il cursore quando si trascina
                boxShadow: dragging ? "0 0 0 2px rgba(0, 0, 0, 0.2)" : "none", // Aggiungi una guida visiva durante il drag
            }}
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
        >
            <Box
                ref={(el) => connect(drag(el))}
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    position: "relative",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {imageSrc ? (
                    <img
                        id={id}
                        ref={imgRef}
                        src={imageSrc}
                        alt="Uploaded"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain", // Mantieni l'immagine intera senza ritagliarla
                            zIndex:0,
                        }}
                    />
                ) : (
                    <Button
                        variant="contained"
                        component="label"
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#eee",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <span style={{ fontSize: "24px", color: "#aaa" }}>+</span>
                        <input
                            type="file"
                            hidden
                            onChange={handleImageUpload}
                        />
                    </Button>
                )}

                {/* Mostra l'handle di ridimensionamento solo quando l'immagine è selezionata */}
                {selected && imageLoaded && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: "15px",
                            height: "15px",
                            background: "blue",
                            cursor: "nwse-resize",
                        }}
                    />
                )}
            </Box>
        </Resizable>
    );
};

ImageUpload.craft = {
    props: { src: "", width: 200, height: 200 },
    related: {},
};
