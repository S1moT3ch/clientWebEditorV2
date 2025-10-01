import React from "react";
import { useNode } from "@craftjs/core";

//Componente freccia
export const Arrow = ({ color, strokeWidth }) => {
    const { connectors: { connect, drag } } = useNode();

    return (
        <svg
            ref={(ref) => connect(drag(ref))}
            width="100"
            height="50"
            viewBox="0 0 100 50"
        >
            <line
                x1="0"
                y1="25"
                x2="80"
                y2="25"
                stroke={color}
                strokeWidth={strokeWidth}
            />
            <polygon points="80,15 100,25 80,35" fill={color} />
        </svg>
    );
};

Arrow.craft = {
    props: {
        color: "#000",
        strokeWidth: 2
    }
};
