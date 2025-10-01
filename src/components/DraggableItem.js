import React from "react"
import { useNode } from "@craftjs/core";

export  const DraggableItem =({ children }) => {
    const { connectors: { drag} } = useNode();

    return (
        <div
            ref={drag}
            style={{
                position: 'absolute',
                cursor: "move"
            }}>
            {children}
        </div>
    );
};