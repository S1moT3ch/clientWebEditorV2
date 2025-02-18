import React, {useRef} from "react";
import {FormControl, Paper, Slider, FormLabel} from "@mui/material";
import {useNode} from "@craftjs/core";
import {HexColorPicker} from "react-colorful";




// componente container ( che contiene tutti gli altri) è sostanzialmente la tela , permette all utente di modificare colore dello sfondo e padding
// padding indica lo spazio tra il bordo del container e il contenuto , mentre margin indica lo spazio tra il bordo del container e il suo contenitore 5px (top e bottom) e 0px (left e right)
export const Container = ({background, padding = 0, children}) => {
    const {connectors : {connect, drag}} = useNode();
    const ref = useRef(null);
    return (
        <Paper ref = {el =>{
            ref.current = el;
            connect(drag(el))}}
               style={{margin: "5px 0", background, padding: `${padding}px`}}>
            {children}
        </Paper>
    )
};

export const ContainerSettings = () => {
    const { background, padding, actions: {setProp} } = useNode((node) => ({
        background: node.data.props.background,
        padding: node.data.props.padding
    }));

    return (
        <div>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend">Background</FormLabel>
                <HexColorPicker color={background || '#000'} onChange={color => {
                    setProp(props => props.background = color)
                }} />
            </FormControl>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend">Padding</FormLabel>
                <Slider defaultValue={padding} onChange={(_, value) => setProp(props => props.padding = value)} />
            </FormControl>
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