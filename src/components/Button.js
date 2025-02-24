import React, {useRef, useState} from "react";
import {Button as MaterialButton, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio, TextField } from "@mui/material";
import {useNode} from "@craftjs/core";
import { Resizable } from "react-resizable";
//variant di material-ui può essere : "text", "outlined", "contained"
//ho sostituito childreno con text che sono la stessa cosa

export const Button = ({size, color, variant, children}) => {
    const {connectors : {connect, drag}} = useNode();
    const ref = useRef(null);

    return (

          <MaterialButton ref = {el =>{
              ref.current = el;
              connect(drag(el))}} size={size} color={color} variant={variant}  >
              {children}
          </MaterialButton>
    )
}

//come per text andiamo a definire il componen  te associato al nodo button che rappresenta il pannello di setting personalizzato per il button
const ButtonSettings = () => {
    const{actions: {setProp}, props} = useNode((node) => ({
        props: node.data.props
    }));

    return (
        <div>
            <FormControl size="small" component="fieldset">
                <FormLabel component="legend">Text</FormLabel>
                <TextField defaultValue={props.children} onChange={(e) => setProp(props => props.children = e.target.value )}/>
            </FormControl>
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
                    <FormControlLabel label="Secondary" value="secondary" control={<Radio size="small" color="primary" />} />
                </RadioGroup>
            </FormControl>
        </div>
    )
};


Button.craft = {
    //dafault values del bottone
        props: {
            size: "small",
            variant: "contained",
            color: "primary",
            children: "Click me"
        },
    related: {
        settings: ButtonSettings
    }
}


