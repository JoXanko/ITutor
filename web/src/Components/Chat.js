import React, { useState, useEffect } from "react";

//--CSS imports--
import '../css/Chat.css'
import { ColorButton, theme } from './Theme';
import undf from '../assets/undefined.jpg';

//--Material UI imports--
import Grid from '@mui/material/Grid';
import { Stack, Autocomplete, Chip } from "@mui/material";
import Box from '@mui/material/Box'
import { Avatar } from "@mui/material";
import { Typography, Paper, TextField } from "@mui/material";

//--firebase imports--
import { getFirestore, collection, query, where, orderBy, limit, onSnapshot, getDocs, addDoc } from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import ResponsiveAppBar from "../elements/ResponsiveAppBar.js";
import Futer from "../elements/Footer.js";

import { app } from '../App.js';
import SingleChat from './SingleChat';
import { fontWeight } from "@mui/system";

const Chat = () => {

    const auth = getAuth(app);
    const db = getFirestore(app);
    const [listaKorisnika, setListaKorisnika] = useState([]);
    const [prikaz, setPrikaz] = useState({});
    const [tutori, setTutori] = useState([]);
    const [ucenici, setUcenici] = useState([]);
    const [fieldValue, setFieldValue] = useState({});
    const [filter, setFilter] = useState("");
    const tutoriRef = collection(db, "tutori");
    const uceniciRef = collection(db, "ucenici");
    const [filtrirano, setFiltrirano] = useState([]);

    useEffect(() => {
        let temp = listaKorisnika.filter(e => (e.ime + " " + e.prezime).includes(filter));
        setFiltrirano(temp);
    }, [filter]);

    const otvoriChat = (event, obj) => {
        let temp = {};
        const func = async () => {
            await getDocs(query(collection(db, 'konverzacije')
                , where('korisnici', 'array-contains', auth.currentUser.uid)
            )).then((val) => {
                let flag = false;
                val.docs.forEach((doc) => {
                    if (doc.data().korisnici.includes(obj.userID)) {
                        flag = true;
                        temp = doc.data();
                        temp['idKonvo'] = doc.id;
                    }
                })
                if (flag !== true) {
                    addDoc(collection(db, 'konverzacije'), {
                        korisnici: [obj.userID, auth.currentUser.uid]
                    }).then((ref) => {
                        temp = ref.data();
                    });
                }
            });
        }
        if (auth.currentUser !== null && obj !== null)
            func().then(() => {
                setPrikaz(temp);
            });
    }

    useEffect(() => {

        let temp = [];

        const getKonverzacije = async () => {
            const konverzacijeRef = collection(db, 'konverzacije');

            const q1 = query(konverzacijeRef, where("korisnici", "array-contains", auth.currentUser.uid));
            const querySnapshot1 = await getDocs(q1);

            querySnapshot1.docs.forEach((document) => {
                const data = document.data();
                const idDrugi = data['korisnici'][0] === auth.currentUser.uid ? data['korisnici'][1] : data['korisnici'][0];
                const Ucenik = async (idDrugi) => {
                    const qUcenik = await getDocs(query(collection(db, 'ucenici'), where("userID", "==", idDrugi)));
                    qUcenik.docs.forEach((el) => {
                        const podatak = el.data();
                        podatak['idKonvo'] = document.id;
                        temp.push(podatak);
                    });
                }

                const Tutor = async (idDrugi) => {
                    const qUcenik = await getDocs(query(collection(db, 'tutori'), where("userID", "==", idDrugi)));
                    qUcenik.docs.forEach((el) => {
                        const podatak = el.data();
                        podatak['idKonvo'] = document.id;
                        temp.push(podatak);
                    });
                }

                Ucenik(idDrugi).then(() => {
                    Tutor(idDrugi).then(() => {
                        setListaKorisnika(temp);
                        setFiltrirano(temp);
                    });
                })
            })
        }
        getKonverzacije();
    }, [auth.currentUser, db]);

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", overflow: 'hidden' }}>

            <div style={{ height: '10%' }}>
                <ResponsiveAppBar user={auth.currentUser} />
            </div>

            <Grid container style={{height:"82%"}}>

                <Grid item className="leviItem" xs={12} sm={12} md={3}  sx={{ xs:{height:"200px"},md:{height: "100%" }}}>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField label="Pretraga" fullWidth value={filter} onChange={(event) => setFilter(event.target.value)} variant="outlined" />
                    </Grid>
                    {filtrirano.map((korisnik) => (
                        <Grid  item xs={12} sm={12} md={12} mt="1rem">
                            <div className="contact" onClick={(event) => { setPrikaz(korisnik) }}>
                                <Avatar alt={undf} margin="auto" src={korisnik.fotografija} />
                                <Typography margin="auto" align="center" sx={{ ml: 1.5 }}>
                                    {korisnik.ime} {korisnik.prezime}
                                </Typography>
                                {korisnik.neprocitane > 0 ? <Chip label={korisnik.neprocitane} color="error"></Chip> : null}

                            </div>
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={12} sm={12} md={9} style={{height:"100%"}}>
                    {Object.keys(prikaz).length != 0 ? <SingleChat sagovornik={prikaz} /> : null}
                </Grid>
            </Grid>
            <Futer />         
        </div>
    )
}

export default Chat;