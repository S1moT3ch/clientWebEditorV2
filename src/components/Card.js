import React  from "react";
import { Text } from "./Text";
import { Button } from "./Button";
import { Container } from "./Container";
import {display} from "@mui/system";

// questo componente sarà composto dal componente container
//e presenterà delle regioni dove potremo droppare gli altri componenti

//non ho bisogno di modificare il componente card in quanto è composto dei componenti  a cui abbiamo applicato già i connettori
export const Card = ({background, padding = 20}) => {
    return (
        <Container background={background} padding={padding} >
            <div className="text-only">
                <Text text="Titolo" fontSize={16}/>
                <Text text="Paragrafo" fontSize={10}/>
            </div>
            <div className="button-only">
                <Button size="small" color="primary" variant="contained">Clicca Qui</Button>
            </div>
        </Container>
    )
}