import React, {useEffect, useRef, useState} from "react";
import { Rnd } from "react-rnd";
import { useNode } from "@craftjs/core";

//Componente DraggableChild per gestire il drag and drop del testo nel rettangolo
export const DraggableChild = ({ x = 0, y = 0, width = 100, height = 30, children }) => {
    const {
        actions: { setProp },
    } = useNode();

    const [position, setPosition] = useState({ x: x ?? 0, y: y ?? 0 });
    const rndRef = useRef(null);

    // Viene calcolata la posizione iniziale centrata solo se x e y non sono già definiti
    useEffect(() => {
        if ((x === 0 && y === 0) || (x == null && y == null)) {
            const parent = rndRef.current?.resizableElement?.current?.parentElement;
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                const centerX = (parentRect.width - width) / 2;
                const centerY = (parentRect.height - height) / 2;

                setProp((props) => {
                    props.x = centerX;
                    props.y = centerY;
                });
                setPosition({ x: centerX, y: centerY });
            }
        }
    }, [width, height, x, y, setProp]);

    return (
        <Rnd
            ref={rndRef}
            bounds="parent" // Il draggableItem non può uscire dal rettangolo padre
            size={{ width, height }}
            position={{ x, y }}
            onMouseDown={(e) => e.stopPropagation()}
            onDragStop={(e, d) => {
                setPosition({ x: d.x, y: d.y });
                setProp((props) => {
                    props.x = d.x;
                    props.y = d.y;
                })
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setPosition({ x: position.x, y: position.y });
                setProp((props) => {
                    props.width = ref.offsetWidth;
                    props.height = ref.offsetHeight;
                    props.x = position.x;
                    props.y = position.y;
                })
            }}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "move",
            }}
        >
            {children}
        </Rnd>
    );
};

DraggableChild.craft = {
    props: {
        width: 100,
        height: 30,
        x: 0,
        y: 0,
    },
};
