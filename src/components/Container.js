import React, {useRef} from "react";
import {Paper} from "@mui/material";
import {useNode} from "@craftjs/core";




// componente container ( che contiene tutti gli altri) è sostanzialmente la tela , permette all utente di modificare colore dello sfondo e padding
// padding indica lo spazio tra il bordo del container e il contenuto , mentre margin indica lo spazio tra il bordo del container e il suo contenitore 5px (top e bottom) e 0px (left e right)
export const Container = ({background, padding = 0, children}) => {
    const {connectors : {connect, drag}} = useNode();
    const ref = useRef(null);
    return (
        <Paper ref = {el =>{
            ref.current = el;
            connect(drag(el))}}
               style={{margin: "5px 0", background, padding: `${padding}px`}}>
            {children}
        </Paper>
    )
};



//padding interno || margin esterno

/*
    (5px margin sopra)
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜  [████████████████████]  ⬜
⬜  |   (px padding)     |  ⬜
⬜  | Testo nel container|  ⬜
⬜  |   (px padding)     |  ⬜
⬜  [████████████████████]  ⬜
    (5px margin sotto)
 */