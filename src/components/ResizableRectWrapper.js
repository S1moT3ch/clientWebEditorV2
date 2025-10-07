import React from "react";
import { useNode } from "@craftjs/core";
import { ResizableRect } from "./ResizableRect";

export const ResizableRectWrapper = ({ x = 0, y = 0, children }) => {
    const { connectors } = useNode();

    return (
        <div ref={(ref) => connectors.connect(ref)}>
            <ResizableRect x={x} y={y}>
                {children}
            </ResizableRect>
        </div>
    );
};

ResizableRectWrapper.craft = {
    props: {
        x: 0,
        y: 0
    }
};
