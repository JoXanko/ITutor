import { React, useState, useEffect } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';

import studying from '../assets/studying.jpg';
import prirodne from '../assets/prirodne.jpg'
import jezici from '../assets/jezici.jpg'
import drustvene from '../assets/drustvene.png'

//--Material UI imports--
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import Chip from '@mui/material/Chip';
import { FormControlLabel, Radio } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

//--firebase imports--
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";

import { app } from '../App.js';
import { ColorButton } from './Theme';


const current = new Date();

const day = current.getDay();
const month = current.getMonth();
const date = current.getDate();

const dani = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Cetvrtak', 'Petak', 'Subota'];
const meseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];

const UserPocetna = () => {

    const navigate = useNavigate();
    const auth = getAuth(app);

    const klikPretraga = () => {
        navigate('/userPretraga')
    }


    return (
        <div>
            <Grid container flexDirection='column' alignItems='center'>
                <Grid item component={Paper} elevation={10} sm={12} md={8} sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <Card sx={{ display: 'flex' }} >
                        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <Typography component="h1" variant="h4" >
                                Zdravo {auth.currentUser.displayName},
                            </Typography>
                            <Typography component="h1" variant="h5" >
                                Dobro došli na ITutor!
                            </Typography>
                            <Typography variant="h6" color="text.secondary" >
                                {dani[day]}, {meseci[month]} {date}
                            </Typography>
                        </CardContent>
                        <CardMedia component="img" sx={{ width: 250, display: { xs: 'none', sm: 'block' } }} image={studying} />
                    </Card>
                </Grid>

                <Box width="40%" mb="2rem" >
                    <Typography variant="h3" align="center" marginBottom="2rem" fontWeight="700" borderBottom="2px solid gray">Pretražite sve usluge!</Typography>
                    <ColorButton align="center" fullWidth onClick={klikPretraga} startIcon={<SearchIcon/>}>
                        Pretraga
                    </ColorButton>
                </Box>
                
                <Grid component={Paper} elevation={10} sm={12} md={8} display="flex" flexDirection={"column"} marginBottom="2rem" padding="1rem" alignItems={"center"}>
                    <Grid item xs={12} display="flex" flexDirection={"row"} flexWrap={'wrap'}>
                        <Box component={Paper} elevation={1} sx={{flex:'1',minWidth:'261px',marginRight:'5px',marginLeft:'5px', marginBottom:"1rem"}}>
                            <Card >
                                <CardMedia component="img" height="180" image={prirodne} />
                                <CardContent>
                                    <Typography component="h1" variant="h6" >
                                        Časovi prirodnih nauka
                                    </Typography>
                                </CardContent>

                            </Card>
                        </Box>
                        <Box component={Paper} elevation={1} sx={{flex:'1',minWidth:'261px',marginRight:'5px',marginLeft:'5px', marginBottom:"1rem"}}>
                            <Card >
                                <CardMedia component="img" height="180" image={drustvene} />
                                <CardContent>
                                    <Typography component="h1" variant="h6" >
                                        Časovi društvenih nauka
                                    </Typography>
                                </CardContent>

                            </Card>
                        </Box>
                        <Box component={Paper} elevation={1} sx={{flex:'1',minWidth:'261px',marginRight:'5px',marginLeft:'5px', marginBottom:"1rem"}}>
                            <Card >
                                <CardMedia component="img" height="180" image={jezici} />
                                <CardContent>
                                    <Typography component="h1" variant="h6" >
                                        Časovi stranih jezika
                                    </Typography>
                                </CardContent>

                            </Card>
                        </Box>
                        
                    </Grid>

                    <Grid item elevation={3} sx={{  marginTop: '1rem' }} >
                        <Typography component="h1" variant="h5" sx={{ marginRight:"auto", marginLeft:"auto"}}>
                            Kao i mnoštvo drugih kategorija.
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ marginRight:"auto", marginLeft:"auto"}}>
                            Pronađite pravog tutora za Vas!
                        </Typography>
                    </Grid>
                    


                </Grid>
                
                
            </Grid>
        </div>
    )



}

export default UserPocetna;