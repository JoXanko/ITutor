import React from 'react'

//--Material UI imports--
import { Box } from '@mui/material'
import { Container } from '@mui/material'
import { Grid } from '@mui/material'
import { Link } from '@mui/material'
import { Typography } from '@mui/material'
import AndroidSharpIcon from '@mui/icons-material/AndroidSharp'
import InstagramIcon from '@mui/icons-material/Instagram'

import { theme } from '../Components/Theme'

import "../css/App.css"

const style ={
    
    height:"8%"
}

const Futer = () => {
    return (
           <Box display={"flex"} flexDirection="row" justifyContent={"center"} backgroundColor={"#1f5d78"} width={"100%"} padding={"auto"}>
                <h4 style={{color:'#FFFFFF'}}>Copyright : JAiL team © 2022</h4>
           </Box>
    )

}
export default Futer;