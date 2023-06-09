import React, { useState, useEffect } from "react";

//--CSS imports--
import '../css/Chat.css'

//--Material UI imports--
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box'

//--firebase imports--
import { getFirestore, collection, query, getDocs, where, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import ResponsiveAppBar from "../elements/ResponsiveAppBar.js";
import Footer from "../elements/Footer.js";

import { app } from '../App.js';
import { Paper, Rating, TextField, Typography } from "@mui/material";

const Ocene = () => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const [tutor, setTutor] = useState([]);
    const [ocene, setOcene] = useState([]);
    const [ucenik, setUcenik] = useState([]);
    const ucenikRef = collection(db, "ucenici");
    const tutoriRef = collection(db, 'tutori');

    useEffect(() => {
        const getTutora = async () => {
            const q = query(tutoriRef, where("userID", "==", auth.currentUser.uid));
            const snapshot = await getDocs(q);
            snapshot.docs.forEach(e => setTutor(e.data()));
        }
        getTutora();
        const getOcena = async (idO) => {
            const q = doc(db, "ocene", idO);
            const snapshot = await getDoc(q);
            setOcene(ocene => [...ocene, snapshot.data()]);
            
            const kid = snapshot.data().korisnikID;
            const q2 = query(ucenikRef, where("userID", "==", kid));
            const snapshot2 = await getDocs(q2);

            snapshot2.docs.forEach(e => setUcenik(ucenik => [...ucenik, e.data()]));
        }
        tutor.ocene.map((ocena) => {
            getOcena(ocena.id)
        })
    }, [])
    return (
        <div>
            <ResponsiveAppBar />
            <Grid item xs={12} md={6} padding={"3rem"} style={{ width: '70%' }} sx={{ padding: '5rem' }} margin={"auto"}>
                {ocene.map((ocena,index) => {
                    return (
                        <Grid display='flex' flexDirection="column" component={Paper} elevation={10} padding={"3rem"} margin={'2rem'}>
                            <Box >
                                <Typography color='primary' component="h1" fontWeight='600' variant="h6" >
                                    Ime: {  /*ucenik.at(index).ime     //iz nekog razloga nece                */}
                                </Typography>

                                <Typography color='primary' component="h1" fontWeight='600' variant="h6" >
                                    <Rating name="read-only" precision={0.1} value={ocena.ocena} readOnly />
                                </Typography>

                                <Typography color='primary' component="h1" fontWeight='600' variant="h6" >
                                    Datum: {Date(ocena.datum * 1000)}
                                </Typography>

                                <Typography color='primary' component="h1" fontWeight='600' variant="h5" >
                                    Komentar:
                                </Typography>
                                <TextField value={ocena.komentar} margin="normal" fullWidth name="opis" id="opis" multiline={true} rows={4} />
                            </Box>
                        </Grid>
                    )
                })}
            </Grid>

            <Footer />
        </div>
    )
}

export default Ocene;