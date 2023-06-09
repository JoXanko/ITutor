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
import { Card, CardContent, CardMedia, CardActionArea, Rating } from '@mui/material';
import Chip from '@mui/material/Chip';
import { FormControlLabel, Radio } from '@mui/material';
import { ControlledAccordions } from '../elements/ControlledAccordions';
import SearchIcon from '@mui/icons-material/Search';

//--firebase imports--
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

import { app } from '../App.js';
import { ColorButton } from './Theme';
import ResponsiveAppBar from '../elements/ResponsiveAppBar';
import Futer from '../elements/Footer';

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/ReactToastify.min.css";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const UserPretraga = () => {

    const navigate = useNavigate();

    const auth = getAuth(app);
    const [niz1, setNiz1] = useState([]);
    const [niz2, setNiz2] = useState([]);
    const [oblast, setOblast] = useState('');
    const [grad, setGrad] = useState('');
    const [nivo, setNivo] = useState('');
    const [usluge, setUsluge] = useState([]);

    const db = getFirestore(app);

    const kategorijeRef = collection(db, "kategorije");
    const lokacijeRef = collection(db, "lokacija");
    const uslugeRef = collection(db, "usluge");

    const klikPretraga = () => {
        if (grad !== '' && oblast !== '' && nivo !== '') {
            const func = async () => {
                const us = [];
                const q = query(uslugeRef, where("lokacija", "==", grad), where("kategorija", "==", oblast), where("stepen", "==", nivo));
                const snapshot = await getDocs(q);

                snapshot.forEach((doc) => {
                    us.push(doc.data());
                })
                setUsluge(us);
                if (us.length === 0)
                    toast.error("Nema dostupnih usluga za date parametre!");
            }
            func();
        }

    }

    useEffect(() => {
        const getGradovi = async () => {
            const obl = [];
            const gradovi = [];

            const q1 = query(kategorijeRef, where('stepen', 'array-contains', nivo));
            const querySnapshot1 = await getDocs(q1);
            querySnapshot1.forEach((doc) => obl.push(doc.data().nazivKategorije));
            setNiz1(obl);

            const q2 = query(lokacijeRef);
            const querySnapshot2 = await getDocs(q2);
            querySnapshot2.forEach((doc) => gradovi.push(doc.data().grad));
            setNiz2(gradovi);
        };
        getGradovi();
    }, [nivo])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: '100vh' }}>
            <ResponsiveAppBar user={auth.currentUser} />
            <Grid display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt="1rem">
                <Box>
                    <Typography variant="h4" fontWeight="600" borderBottom="2px solid gray">
                        Pretraga usluga
                    </Typography>
                </Box>
                <Grid item container xs={12} sm={12} md={8} display="flex" flexDirection="column" justifyContent="center" component={Paper} padding={"0.5rem"} elevation={10} sx={{ marginTop: '2rem', marginBottom: '1rem' }}>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-evenly" mb="1rem" mt="1rem">
                        <Typography variant="h6" color="text.secondary" marginBottom={"1rem"}>
                            Stepen obrazovanja
                        </Typography>
                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly">
                            <FormControlLabel value="nivoOsnovne" control={<Radio onChange={(event) => setNivo("Nivo osnovne škole")} checked={nivo === "Nivo osnovne škole"} />} label="Nivo osnovne škole" />
                            <FormControlLabel value="nivoSrednje" control={<Radio onChange={(event) => setNivo("Nivo srednje škole")} checked={nivo === "Nivo srednje škole"} />} label="Nivo srednje škole" />
                            <FormControlLabel value="nivoFakulteta" control={<Radio onChange={(event) => setNivo("Nivo fakulteta")} checked={nivo === "Nivo fakulteta"} />} label="Nivo fakulteta" />
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly" >
                        <Box sx={{ mx: 2 }} width="40%" >
                            <FormControl fullWidth sx={{ mr: 2 }}>
                                <InputLabel id="demo-simple-select-label">Oblast</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Oblast"
                                    renderValue={(value) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>

                                            <Chip key={value} label={value} />
                                            {setOblast(value)}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {niz1.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ my: 5, mx: 3 }} width="40%">
                            <FormControl fullWidth sx={{ mr: 2 }}>
                                <InputLabel id="demo-simple-select-label">Lokacija</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Lokacija"
                                    renderValue={(value) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>

                                            <Chip key={value} label={value} />
                                            {setGrad(value)}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {niz2.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Grid>
                <Grid item display='flex' justifyContent='center' flexDirection='column' sx={{ marginTop: '0.2rem', width: 300 }}>
                    <ColorButton fullWidth onClick={klikPretraga} sx={{ marginTop: '0.2rem', marginBottom: '1rem' }} startIcon={<SearchIcon/>}>
                        Pretraga
                    </ColorButton>
                </Grid>
            </Grid>

            <Grid container justifyContent={"space-around"} mb="1rem">

                <ControlledAccordions usluge={usluge} />
            </Grid>
            <ToastContainer theme="colored" position="top-center" hideProgressBar={true} newestOnTop />
            <Futer />
        </div>
    )

}

export default UserPretraga;