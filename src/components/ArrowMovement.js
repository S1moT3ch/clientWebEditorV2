import React, {useEffect, useRef, useState} from "react";
import { useNode } from "@craftjs/core";

export const ArrowMovement = ({
                                  width,
                                  height,
                                  rotation,
                                  onResize,
                                  onRotate,
                                  onResizeStart,
                                  onResizeStop,
                                  onRotateStart,
                                  onRotateStop,
                                  zoomable = "e",
                                  rotatable = true
                              }) => {
    const { connectors: { connect } } = useNode();

    const ref = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [startRotation, setStartRotation] = useState(rotation);

    // Funzioni per gestire il resize e il rotate
    const handleMouseDownResize = (e) => {
        e.stopPropagation();
        setIsResizing(true);
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMoveResize = (e) => {
        if (!isResizing) return;
        const dx = e.clientX - startPos.x;
        onResize({ width: Math.max(20, width + dx) });
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUpResize = () => {
        setIsResizing(false);
        if (onResizeStop) onResizeStop();
    };

    const handleMouseDownRotate = (e) => {
        e.stopPropagation();
        setIsRotating(true);
        setStartPos({ x: e.clientX, y: e.clientY });
        setStartRotation(rotation);
    };

    const handleMouseMoveRotate = (e) => {
        if (!isRotating) return;
        const dx = e.clientX - startPos.x;
        const newRotation = startRotation + dx;
        onRotate(newRotation);
        if (onRotateStart) onRotateStart();
    };

    const handleMouseUpRotate = () => {
        setIsRotating(false);
        if (onRotateStop) onRotateStop();
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMoveResize);
        window.addEventListener("mouseup", handleMouseUpResize);

        window.addEventListener("mousemove", handleMouseMoveRotate);
        window.addEventListener("mouseup", handleMouseUpRotate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMoveResize);
            window.removeEventListener("mouseup", handleMouseUpResize);

            window.removeEventListener("mousemove", handleMouseMoveRotate);
            window.removeEventListener("mouseup", handleMouseUpRotate);
        };
    });

    return (
        <div
            ref={ref}
            style={{
                position: "absolute",
                width,
                height,
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "left center",
                pointerEvents: isResizing || isRotating ? "none" : "auto"
            }}
        >
            {/* Rettangolo tratteggiato solidale alla freccia */}
            <div
                style={{
                    position: "absolute",
                    width: width,
                    height: height,
                    border: "1px dashed gray",
                    transformOrigin: "left center",
                }}
            >
                {/* Ridimensionamento */}
                {zoomable.includes("e") && (
                    <div
                        style={{
                            position: "absolute",
                            right: -5,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 10,
                            height: 10,
                            background: "red",
                            cursor: "ew-resize",
                            pointerEvents: "all"
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setIsResizing(true);
                            onResizeStart && onResizeStart();
                            setStartPos({ x: e.clientX, y: e.clientY });
                        }}
                    />
                )}

                {/* Rotazione */}
                {rotatable && (
                    <div
                        style={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            transform: "translateX(-50%)",
                            width: 20,
                            height: 20,
                            background: "blue",
                            borderRadius: "50%",
                            cursor: "grab",
                            pointerEvents: "all"
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setIsRotating(true);
                            onRotateStart && onRotateStart();
                            setStartPos({ x: e.clientX, y: e.clientY });
                            setStartRotation(rotation);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

ArrowMovement.craft = {
    props: {
        width: 100,
        height: 50,
        rotation: 0,
        zoomable: "e",
        rotatable: true
    }
};
