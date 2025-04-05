import React  from "react";
import { Text } from "./Text";
import { Button } from "./Button";
import {Container, ContainerDefaultProps, ContainerSettings} from "./Container";
import { Element } from "@craftjs/core";
import { useNode } from "@craftjs/core";
import "../App.css"

// questo componente sarà composto dal componente container
//e presenterà delle regioni dove potremo droppare gli altri componenti

//non ho bisogno di modificare il componente card in quanto è composto dei componenti  a cui abbiamo applicato già i connettori
export const CardTop = ({children}) => {
    const ref = useNode(null)
    const { connectors: {connect} } = useNode();
    return (
        <div ref = {el => {
             ref.current = el;
             connect(el)}}
             className="text-only"
             >
             {children ? children : <Text text=" "/>}
        </div>
    )
}

CardTop.craft = {
    rules: {
        // Only accept Text
        canMoveIn: (incomingNodes) => incomingNodes.every(incomingNode => incomingNode.data.type === Text)
    }
}

export const CardBottom = ({children}) => {
    const ref = useNode(null)
    const { connectors: {connect} } = useNode();
    return (
        <div ref = {el => {
             ref.current = el;
             connect(el)}}
             className="button-only">
             {children ? children : " "}
        </div>
    )
}

CardBottom.craft = {
    rules: {
        // Only accept Buttons
        canMoveIn : (incomingNodes) => incomingNodes.every(incomingNode => incomingNode.data.type === Button)
    }
}

export const Card = ({backgroundColor, padding = 20, margin = 0}) => {
    return (
            <Container backgroundColor={backgroundColor} padding={padding} margin={margin} style={{flexDirection:"column"}} >
                <Element id="text" is={CardTop} canvas> //Canvas è un container che permette di droppare elementi al suo interno in questo caso solo testo
                    <Text text="Title" fontSize={20} />
                    <Text text="Subtitle" fontSize={15} />
                </Element>
                <Element id="button" is={CardBottom} canvas> //Canvas è un container che permette di droppare elementi al suo interno in questo caso solo bottoni
                    <Button size="medium" variant="contained" children="Learn more" />
                </Element>
            </Container>

    )
}

Card.craft = {
    related: {
        settings: ContainerSettings,
        props: ContainerDefaultProps
    }
}