import React from "react";
import { Rnd } from "react-rnd";
import { useNode } from "@craftjs/core";

//Componente Rettangolo
export const ResizableRect = ({ width, height, backgroundColor, x, y }) => {
    const {
        connectors: { connect, drag },
        actions: { setProp }
    } = useNode();

    return (
        <Rnd
            size={{ width, height }}
            position={{ x, y }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setProp(props => {
                    props.width = ref.offsetWidth;
                    props.height = ref.offsetHeight;
                    props.x = position.x;
                    props.y = position.y;
                });
            }}
            onDragStop={(e, d) => {
                setProp(props => {
                    props.x = d.x;
                    props.y = d.y;
                });
            }}
            style={{
                backgroundColor,
                border: "1px solid black"
            }}
        >
            <div
                ref={(ref) => connect(drag(ref))} // Collegamento di solo un nodo DOM
                style={{ width: "100%", height: "100%" }}
            />
        </Rnd>
    );
};

ResizableRect.craft = {
    props: {
        width: 100,
        height: 100,
        backgroundColor: "#ccc",
        x: 0,
        y: 0
    }
};
