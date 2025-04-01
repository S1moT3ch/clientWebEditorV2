import React, {useEffect, useState, useRef} from "react";
//rendo l'elemento draggable e droppable tramite l'useNode hook di craftjs
import {useNode} from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import {textAlign} from "@mui/system";
import {FormControl, FormLabel, Slider} from "@mui/material";
import {HexColorPicker} from "react-colorful";

export const Text = ({text, fontSize, color}) => {
    //al connectors passiamo le funzioni :
    //connect specifica l'area droppable solo se il nodo corrispondente al componente è un nodo canvas
    //drag aggiunge i gestori del drag al DOM e se il componente relativo al nodo è un immediate child di un Canvas,
    //allora l'elemento sarà draggable

    //The useNode hook accepts a collector function which can be used to retrieve
    //state information related to the corresponding Node

    const {
        connectors: {connect, drag}, id,
        hasSelectedNode,
        actions: {setProp}} = useNode((state) => ({
        hasSelectedNode: state.events.selected,
        hasDraggedNode: state.events.dragged
    }));

    const ref = useRef(null);

    const [editable, setEditable] = useState(false);

    //se non ho selezionato nessun nodo imposta editable a false quindi non posso modificare nulla
    //triggero l'effetto ogni volta che cambia hasSelectedNode

    useEffect(() => {
        !hasSelectedNode && setEditable(!editable);
    }, [hasSelectedNode]);


    return (
        <div ref={el => {
            ref.current = el;
            connect(drag(el))
        }} className="text-comp" id={id}>
            <ContentEditable
                html={text}
                onChange={(e) => {
                    setProp(props => props.text = e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Evita il comportamento predefinito
                        setProp(props => props.text += "\n" +
                            "");// Aggiunge un line break
                    }
                }}
                style={{ fontSize: `${fontSize}px`, color, textAlign, whiteSpace: "pre-line" }} // "pre-line" mantiene i \n
            />

        </div>
    )
}
//Related Node che condivide le stesse proprietà del nodo text, può quindi usare l'hook useNode
//inoltre un related component è associato al componente di un nodo e perciò possiamo renderizzare questo extra setting per il testo in un pannello a parte
//che sarà proprio la toolbox

    const TextSettings = () => {
        const {actions: {setProp}, fontSize} = useNode((node) => ({
            fontSize: node.data.props.fontSize
        }));

        return (
            <>
                <FormControl size="small" component="fieldset">
                    <FormLabel component="legend" className="custom-label">Font Size</FormLabel>
                    <Slider
                        value={fontSize || 7}
                        step={7}
                        min={8}
                        max={50}
                        onChange={(_, value) => {
                            setProp(props => props.fontSize = value);
                        }}
                    />
                </FormControl>
                <FormControl fullWidth={true} margin="normal" component="fieldset">
                    <FormLabel component="legend" className="custom-label">Font Color</FormLabel>
                    <HexColorPicker defaultValue={"#000"} onChange={color => {
                        setProp(props => props.color = color)
                    }} />
                </FormControl>
            </>
        )
    }


Text.craft = {
    //default props
    props: {
        text: "Default text",
        fontSize: 20,
        color: "#000"
    },
    related: {
        settings: TextSettings
    }
}