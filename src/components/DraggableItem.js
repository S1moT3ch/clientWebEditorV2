import React, { useEffect, useRef } from "react";

export const DraggableItem = ({ id, initialPosition, children }) => {
    const ref = useRef();

    useEffect(() => {
        if (ref.current && initialPosition) {
            ref.current.style.position = "absolute";
            ref.current.style.left = `${initialPosition.x}px`;
            ref.current.style.top = `${initialPosition.y}px`;
        }
    }, [initialPosition]);

    return (
        <div id={id} ref={ref} style={{ position: "absolute" }}>
            {children}
        </div>
    );
};
