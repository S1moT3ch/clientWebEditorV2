import React, {useEffect, useRef, useState} from "react";
import {FormControl, Paper, Slider, FormLabel, FormControlLabel, Switch} from "@mui/material";
import Element from "@craftjs/core";
import {useNode} from "@craftjs/core";
import {HexColorPicker} from "react-colorful";
import "../App.css"




// componente container ( che contiene tutti gli altri) è sostanzialmente la tela , permette all utente di modificare colore dello sfondo e padding
// padding indica lo spazio tra il bordo del container e il contenuto , mentre margin indica lo spazio tra il bordo del container e il suo contenitore 5px (top e bottom) e 0px (left e right)
export const Container = ({background, padding = 0, margin = 1, children}) => {
    const {connectors : {connect, drag}, id,
           actions: {setProp}, isSelected} = useNode((state) => ({
            isSelected : state.events.selected
    }));

    const ref = useRef(null);




    return (
        <Paper  className="new-container" id={id}   ref = {el =>{
            ref.current = el;
            connect(drag(el))}}
                style={{margin: `${margin}px`, background, padding: `${padding}px`, minWidth:"150px", outline: isSelected ? "2px solid blue" : "none"}}>
            {children}
        </Paper>
    )
};



export const ContainerSettings = () => {
    const { background, margin, padding, flexDirection, id, data, actions: {setProp} } = useNode((node) => ({
        background: node.data.props.background,
        padding: node.data.props.padding,
        margin: node.data.props.margin,
        flexDirection: node.data.props.flexDirection,
        id: node.id,
        data: node.data
    }));

    const [check, setCheck] = useState(flexDirection === "row");


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
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend" className="custom-label">Background</FormLabel>
                <HexColorPicker color={background || '#000'} onChange={color => {
                    setProp(props => props.background = color)
                }} />
            </FormControl>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend"  className="custom-label" >Padding</FormLabel>
                <Slider defaultValue={padding} onChange={(_, value) => setProp(props => props.padding = value)} />
            </FormControl>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend"  className="custom-label" >Margin</FormLabel>
                <Slider defaultValue={margin} onChange={(_, value) => setProp(props => props.margin = value)} />
            </FormControl>
            {id !== "ROOT" && data.type.name !== "Card" && <FormControlLabel control={<Switch onChange={handleCheck} checked={check}/>} label={check? "Horizontal" : "Vertical" }/>}
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
    background: "#fff",
    padding: 0,
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