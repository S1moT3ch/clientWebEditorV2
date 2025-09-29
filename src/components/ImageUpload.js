import React, { useState, useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";
import { Box, Button } from "@mui/material";
import { Resizable } from "re-resizable";

// Placeholder + image upload
export const ImageUpload = ({ src, width = 200, height = 200, aspectRatio = 1 }) => {
    const {
        connectors: { connect, drag }, id,
        actions: { setProp },
        selected,
    } = useNode();

    const [imageSrc, setImageSrc] = useState(src || ""); // Inizializza con l'immagine passata
    const [dimensions, setDimensions] = useState({ width, height }); //Stato delle dimensione dell'immagine
    const [aspectRatioState, setAspectRatioState] = useState(aspectRatio || width / height); //Rapporto d'aspetto
    const [imageLoaded, setImageLoaded] = useState(false); // Stato per il caricamento dell'immagine
    const imgRef = useRef(null); // Riferimento per l'immagine
    const [dragging, setDragging] = useState(false); // Stato per determinare se si sta draggando

    const prevSrc = useRef(src);

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

    // Sincronizzazione delle props di larghezza, altezza e rapporto d'aspetto delle immagini
    // ogni qualvolta esse cambiano (neceserrario per la deserializzazione e per undo/redo)
    useEffect(() => {
        setDimensions({ width, height });
        if (aspectRatio) {
            setAspectRatioState(aspectRatio);
        } else {
            setAspectRatioState(width / height);
        }
    }, [aspectRatio, width, height]);

    // Effetto per il caricamento dell'immagine
    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.onload = () => {
                setImageLoaded(true);

                // Se si tratta di una nuova immagine, vengono ricalcolate le dimensioni
                if (src !== prevSrc.current) {
                    const imgWidth = imgRef.current.naturalWidth;
                    const imgHeight = imgRef.current.naturalHeight;

                    const maxDimension = 500;
                    const ratio = Math.min(maxDimension / imgWidth, maxDimension / imgHeight);

                    const newDims = {
                        width: imgWidth * ratio,
                        height: imgHeight * ratio,
                    }

                    setDimensions(newDims);
                    setAspectRatioState(imgWidth/ imgHeight); //rapporto tra le dimensioni originali dell'immagine

                    setProp((props) => {
                        props.width = imgWidth * ratio;
                        props.height = imgHeight * ratio;
                    });
                }
            };
        }
    }, [imageSrc, setProp]);

    useEffect(() => {
        setImageSrc(src || "")
    },[src]);

    const isFreeCanvas = document.getElementById("ROOT").classList.contains("free-canvas");
    const isGridCanvas = document.getElementById("ROOT").style.display === "grid";



    return (
        <Resizable
            id={id}
            size={{ width: dimensions.width, height: dimensions.height }}
            minWidth={50}
            minHeight={50}
            lockAspectRatio={aspectRatioState} // Mantiene il rapporto durante il ridimensionamento
            enable={{
                bottomRight: true,
            }}
            onResizeStop={(e, direction, ref, d) => {
                // Calcoliamo la nuova dimensione basata sul lato
                const newWidth = ref.offsetWidth;
                const newHeight = ref.offsetHeight;

                // Mantieni il rapporto di aspetto dell'immagine durante il ridimensionamento
                const newHeightBasedOnWidth = newWidth / aspectRatioState;
                const newWidthBasedOnHeight = newHeight * aspectRatioState;

                let newDims; //array per contenere le nuove dimensioni

                // Se il nuovo valore di larghezza è maggiore della larghezza originale, aggiorna la dimensione,
                // altrimenti basa il ridimensionamento sulla base del nuovo valore di altezza
                if (newHeightBasedOnWidth <= newHeight) {
                    newDims = { width: newWidth, height: newHeightBasedOnWidth}
                } else {
                    newDims = { width: newWidthBasedOnHeight, height: newHeight}
                }

                setDimensions(newDims);

                setProp((props) => {
                    props.width = newDims.width;
                    props.height = newDims.height;
                    props.aspectRatio = aspectRatioState;
                })
            }}
            style={{
                zIndex: 0,
                position: "relative",
                cursor: dragging ? "move" : "default", // Cambia il cursore quando si trascina
                boxShadow: dragging ? "0 0 0 2px rgba(0, 0, 0, 0.2)" : "none", // Aggiungi una guida visiva durante il drag
            }}
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
        >
            <Box
                ref={(el) => connect(drag(el))}
                id={(isFreeCanvas || isGridCanvas) ? id : null} // Aggiungi l'id solo se il container è free canvas
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    position: isFreeCanvas ? "absolute" : "relative", // Cambia posizione in base al layout
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {imageSrc ? (
                    <img
                        id={(isFreeCanvas || isGridCanvas) ? id : null}
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
                            accept="image/"
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

//Settings per il componente ImageUpload
const ImageUploadSettings = () => {
    const {
        actions: { setProp },
        src
    } = useNode(node => ({
        src: node.data.props.src
    }));

    //Funzione caricamento nuova immagine
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProp((props) => (props.src = e.target.result)); // Salvo l'immagine nell'editor
            };
            reader.readAsDataURL(file);
        }
    };

    //pannello Settings
    return (
        <div style={{ padding: "10px" }}>
            <input
                type="file"
                accept="image/"
                style={{ display: "none" }}
                id="img-upload-settings-input"
                onChange={handleImageChange}
            />
            <label htmlFor="img-upload-settings-input">
                <Button variant="contained" component="span">
                    Upload a new image
                </Button>
            </label>
        </div>
    )
}
ImageUpload.craft = {
    props: { src: "", width: 200, height: 200, aspectRatio: null },
    related: { settings: ImageUploadSettings},
};
