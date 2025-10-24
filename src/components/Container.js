import React, {useEffect, useRef, useState} from "react";
import {FormControl, Paper, Slider, FormLabel, FormControlLabel, Switch, Input, Button, TextField} from "@mui/material";
import Element from "@craftjs/core";
import {useNode} from "@craftjs/core";
import {HexColorPicker} from "react-colorful";
import "../App.css"
import {Stack} from "@mui/system";




// componente container ( che contiene tutti gli altri) è sostanzialmente la tela , permette all utente di modificare colore dello sfondo e padding
// padding indica lo spazio tra il bordo del container e il contenuto , mentre margin indica lo spazio tra il bordo del container e il suo contenitore 5px (top e bottom) e 0px (left e right)
export const Container = ({background, padding = 0, margin = 1, width, height, children, backgroundColor, zIndex}) => {
    const {connectors : {connect, drag}, id,
           actions: {setProp}, isSelected} = useNode((state) => ({
            isSelected : state.events.selected
    }));




    const ref = useRef(null);

    useEffect(() => {
        // Set background size to 'cover' so the image scales with the container
        if (ref.current && background) {
            ref.current.style.backgroundSize = '100% 100%';
            ref.current.style.backgroundPosition = 'center center';
            ref.current.style.backgroundRepeat = 'no-repeat';
        }
    }, [background]);





    return (

        <Paper  className="new-container" id={id}   ref = {el =>{
            ref.current = el;
            connect(drag(el))}}
                style={{margin: `${margin}px`,
                    background: background ? `url(${background})` : backgroundColor,
                    padding: `${padding}px`,
                    outline: isSelected ? "2px solid blue" : "none",
                    width: `${width}px`,
                    height: `${height}px`,
                    display: "flex",
                    zIndex: zIndex,
        }}>
            {children}
        </Paper>
    )
};



export const ContainerSettings = () => {
    const { background, margin, padding, flexDirection, id, data, width, height, backgroundColor, zIndex, actions: {setProp} } = useNode((node) => ({
        background: node.data.props.background,
        backgroundColor: node.data.props.backgroundColor,
        zIndex: node.data.props.zIndex,
        width: node.data.props.width,
        height: node.data.props.height,
        padding: node.data.props.padding,
        margin: node.data.props.margin,
        flexDirection: node.data.props.flexDirection,
        id: node.id,
        data: node.data
    }));


    const [imageDimensions, setImageDimensions] = useState({ width: null, height: null })
    const [check, setCheck] = useState(flexDirection === "row");
    const [imageSrc, setImageSrc] = useState(null); // Stato per l'immagine di sfondo

    const handleImageUpload = (event) => {

        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result; // Il Data URL dell'immagine
                setImageSrc(imageUrl); // Imposto l'immagine selezionata

                // Crea un oggetto Image per ottenere le dimensioni
                const img = new Image();
                img.onload = () => {
                    // Quando l'immagine è completamente caricata, ottieni le sue dimensioni
                    setImageDimensions({
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    });

                    // Imposta le dimensioni del container
                    setProp((props) => (props.background = imageUrl)); // Imposta l'immagine di sfondo
                    setProp((props) => (props.width = img.naturalWidth)); // Imposta la larghezza
                    setProp((props) => (props.height = img.naturalHeight)); // Imposta l'altezza
                };
                img.src = imageUrl; // Imposta l'URL dell'immagine nell'oggetto Image
            };
            reader.readAsDataURL(file); // Leggi il file come Data URL
        }
    };


    //sembrava impossibile ma sono riuscito ad evitare gli aggiornamenti del layout sui click dei container

    const handleCheck = () => {
        setCheck(!check);
        setProp(props => props.flexDirection = check ? "column" : "row");

    }



    useEffect(() => {
        const selectedContainer = document.getElementById(id); // Usa l'ID per trovare il container
        if (selectedContainer.id !== "ROOT") {
            selectedContainer.style.setProperty("--flex-direction", check ? "row" : "column");
        }
    }, [check,id]);




    return (
        <div>
            { id !== "ROOT" && data.type.name !== "Card" && <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend" className="custom-label">Background Image</FormLabel>
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
                    <span style={{fontSize: "24px", color: "#aaa"}}>+</span>
                    <input
                        type="file"
                        hidden
                        onChange={handleImageUpload}
                    />
                </Button>
            </FormControl>}
            {!imageSrc && (
                <FormControl fullWidth={true} margin="normal" component="fieldset">
                    <FormLabel component="legend" className="custom-label">Background Color</FormLabel>
                    <HexColorPicker color={backgroundColor || '#000'} onChange={color => {
                        setProp(props => props.backgroundColor = color)
                    }} />
                </FormControl>
            )}
            { id !== "ROOT" && data.type.name !== "Card" && <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend"  className="custom-label" >Width</FormLabel>
                <Slider defaultValue={ imageSrc ? imageDimensions.width : width } max={5000} onChange={(_, value) => setProp(props => props.width = value)} />
            </FormControl> }
            { id !== "ROOT" && data.type.name !== "Card" && <FormControl fullWidth={true} margin="normal" component="fieldset">
            <FormLabel component="legend"  className="custom-label" >Height</FormLabel>
            <Slider defaultValue={ imageSrc ? imageDimensions.height : height } max={1000} onChange={(_, value) => setProp(props => props.height = value)} />
        </FormControl>
            }
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend"  className="custom-label">Padding</FormLabel>
                <Slider defaultValue={padding} onChange={(_, value) => setProp(props => props.padding = value)} />
            </FormControl>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend"  className="custom-label">Margin</FormLabel>
                <Slider defaultValue={margin} onChange={(_, value) => setProp(props => props.margin = value)} />
            </FormControl>
            {id !== "ROOT" && data.type.name !== "Card" && <FormControlLabel control={<Switch onChange={handleCheck} checked={check}/>} label={check? "Horizontal" : "Vertical" }/>}

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
        </div>
    )
}

//La proprietà craft è una parte di Craft.js che permette di configurare un componente
// in modo che possa interagire correttamente con l'editor.
// In altre parole, è un oggetto che contiene la configurazione per il componente, così che Craft.js possa gestirlo durante l'editing
// (drag-and-drop, modifica delle proprietà, etc.).

//mentre related è un oggetto che può contenere informazioni legate al componente, come una sezione di impostazioni personalizzate
Container.craft = {
    related: {
        settings: ContainerSettings

    }
}

//esporto poichè mi serve in card
export const ContainerDefaultProps = {
    backgroundColor: "#fffff",
    background: null,
    padding: 0,
    zIndex: 1,
}



//padding interno || margin esterno

/*
    (5px margin sopra)
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜  [████████████████████]  ⬜
⬜  |   (px padding)     |  ⬜
⬜  | Testo nel container|  ⬜
⬜  |   (px padding)     |  ⬜
⬜  [████████████████████]  ⬜
    (5px margin sotto)
 */