import React, {useEffect, useState} from 'react';
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton } from "@mui/material";
import "../App.css"


export const Topbar = () => {

    const [check, setCheck] = useState(false)


    const handleCheck = () => {
        setCheck(!check);
    }

    useEffect(()=>{
        document.documentElement.style.setProperty('--flex-direction', check? "row" : "column")
    }, [check])

    /*const handleCheck = () => {
        const newCheck = !check
        setCheck(newCheck)
        document.documentElement.style.setProperty('--flex-direction', newCheck? "row" : "column")
        console.log(check)
    }*/


    return (
        <Box px={1} py={1} mt={3} mb={1} bgcolor={"rgba(0, 0, 0, 0.1)"}>
            <Grid container alignItems="center">
                <Grid item xs>
                    <FormControlLabel control={<Switch onChange={handleCheck} checked={check}/>} label={check? "Horizontal" : "Vertical" }/>
                </Grid>
                {/*<Grid item>
                    <MaterialButton size="small" variant="outlined" color="secondary">Save</MaterialButton>
                </Grid>*/}
            </Grid>
        </Box>
    )
}