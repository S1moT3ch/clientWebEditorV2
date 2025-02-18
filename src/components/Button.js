import React, {useRef} from "react";
import {Button as MaterialButton, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio} from "@mui/material";
import {useNode} from "@craftjs/core";

//variant di material-ui può essere : "text", "outlined", "contained"
//ho sostituito childreno con text che sono la stessa cosa

export const Button = ({size, color, variant, children}) => {
    const {connectors : {connect, drag}, isHovering, isDroppable} = useNode();
    const ref = useRef(null);
    return (
        <MaterialButton ref = {el =>{
            ref.current = el;
            connect(drag(el))}}
            size={size} color={color} variant={variant}
                        className={`craft-node ${isHovering && !isDroppable ? "drop-not-allowed" : ""}`}
            >{children}</MaterialButton>
    )
}


//come per text andiamo a definire il componente associato al nodo button che rappresenta il pannello di setting personalizzato per il button
const ButtonSettings = () => {
    const{actions: {setProp}, props} = useNode((node) => ({
        props: node.data.props
    }));

    return (
        <div>
            <FormControl size="small" component="fieldset">
                <FormLabel component="legend">Size</FormLabel>
                <RadioGroup defaultValue={props.size} onChange={(e) => setProp(props => props.size = e.target.value )}>
                    <FormControlLabel label="Small" value="small" control={<Radio size="small" color="primary" />} />
                    <FormControlLabel label="Medium" value="medium" control={<Radio size="small" color="primary" />} />
                    <FormControlLabel label="Large" value="large" control={<Radio size="small" color="primary" />} />
                </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel component="legend">Variant</FormLabel>
                <RadioGroup defaultValue={props.variant} onChange={(e) => setProp(props => props.variant = e.target.value )}>
                    <FormControlLabel label="Text" value="text" control={<Radio size="small" color="primary" />} />
                    <FormControlLabel label="Outlined" value="outlined" control={<Radio size="small" color="primary" />} />
                    <FormControlLabel label="Contained" value="contained" control={<Radio size="small" color="primary" />} />
                </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel component="legend">Color</FormLabel>
                <RadioGroup defaultValue={props.color} onChange={(e) => setProp(props => props.color = e.target.value )}>
                    <FormControlLabel label="Default" value="default" control={<Radio size="small" color="default" />} />
                    <FormControlLabel label="Primary" value="primary" control={<Radio size="small" color="primary" />} />
                    <FormControlLabel label="Seconday" value="secondary" control={<Radio size="small" color="primary" />} />
                </RadioGroup>
            </FormControl>
        </div>
    )
};


Button.craft = {
    related: {
        settings: ButtonSettings
    }
}


