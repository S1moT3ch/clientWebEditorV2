import React, {useRef} from "react";
import {Button as MaterialButton} from "@mui/material";
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