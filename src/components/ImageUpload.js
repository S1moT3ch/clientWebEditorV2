import React, {useState} from "react"
import {useNode} from "@craftjs/core"
import {Box, Button} from "@mui/material"
import {Resizable} from "re-resizable"

export const ImageUpload = ({ src, width = 200, height = 200 }) => {
    const {connectors : {connect, drag}, actions} = useNode();
    const[imageSrc,setImageSrc] = useState("");
    const[size, setSize] = useState({width, height});



    return (
        <Box ref={ref => connect(drag(ref))}>
            {imageSrc && <img src={imageSrc} alt="Uploaded" style={{width, height}} />}
        </Box>
    )
};

ImageUpload.craft = {
    props: { src: '', width: 200, height: 200 },
    related: {},
};


