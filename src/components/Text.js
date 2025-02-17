import React, {useRef} from "react";
//rendo l'elemento draggable e droppable tramite l'useNode hook di craftjs
import {useNode} from "@craftjs/core";

export const Text = ({text, fontSize, color}) => {
    //al connectors passiamo le funzioni :
    //connect specifica l'area droppable solo se il nodo corrispondente al componente è un nodo canvas
    //drag aggiunge i gestori del drag al DOM e se il componente relativo al nodo è un immediate child di un Canvas,
    //allora l'elemento sarà draggable
    const {connectors: {connect,drag}, isHovering, isDroppable} = useNode();
    const ref = useRef(null);
    return (
        <div ref = {el =>{
            ref.current = el;
            connect(drag(el))}} className={`craft-node ${isHovering && !isDroppable ? "drop-not-allowed" : ""}`}
        >
            <p style={{fontSize, color}}>{text}</p>
        </div>
    )
}