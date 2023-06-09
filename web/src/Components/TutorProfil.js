import { React, useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/ReactToastify.min.css";

import slikaUsluga from '../assets/slikaUsluga.jpg'

//--CSS imports--
import '../css/App.css'

//--Material UI imports--
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Card, CardMedia, CardContent, CardActions } from '@mui/material';
import Typography from '@mui/material/Typography';
import MailIcon from '@mui/icons-material/Mail';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

//--firebase imports--

import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";

import { app } from '../App.js';
import ResponsiveAppBar from '../elements/ResponsiveAppBar';
import Footer from '../elements/Footer';
import undf from '../assets/undefined.jpg'
import { ThemeProvider } from '@emotion/react';
import { async } from '@firebase/util';
import { theme, ColorButton, PopupDialog, PopupDialogTitle } from './Theme';
import { Avatar, Rating } from '@mui/material';


const TutorProfil = (props) => {

    const navigate = useNavigate();
    let { id } = useParams();

    const auth = getAuth(app);
    const db = getFirestore(app);
    const [tu, setTu] = useState({});
    const [izabrani, setIzabrani] = useState({});
    const [usluge, setUsluge] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [komentar, setKomentar] = useState("");
    const [ocenjeno, setOcenjeno] = useState({});

    const doPoruka = () => {
        const func = async () => {
            await getDocs(query(collection(db, 'konverzacije')
                , where('korisnici', 'array-contains', auth.currentUser.uid)
            )).then((val) => {
                let flag = false;
                val.docs.forEach((doc) => {
                    if (doc.data().korisnici.includes(tu.userID)) flag = true;
                })
                if (flag !== true) {
                    addDoc(collection(db, 'konverzacije'), {
                        korisnici: [tu.userID, auth.currentUser.uid],
                    });
                }
            }).then(() => navigate('/chat'));
        }
        if (auth.currentUser !== null)
            func();
    }

    const prikaziVise = (obj) => {
        setIzabrani(obj);

        const func = async () => {
            const ref = query(collection(db, 'ocene'), where("uslugaID", '==', obj.idUsluge), where("korisnikID", '==', auth.currentUser.uid));
            const snapshot = await getDocs(ref);
            if (snapshot.size > 0) {
                setOcenjeno(snapshot.docs[0].data());
            } else {
                setOcenjeno({});
            }
        }

        func().then(() => setOpen(true));
    }

    const iskljuci = () => {
        setOpen(false);
    }

    const add = () => {
        const dodajRating = async () => {
            await addDoc(collection(db, 'ocene'), {
                datum: Timestamp.now(),
                komentar: komentar,
                korisnikID: auth.currentUser.uid,
                ocena: value,
                uslugaID: izabrani.idUsluge,
                nova: true,
                oznacena:false
            }).then(e => {
                setKomentar("");
                setValue(0);
            });
        }
        const azurirajSrednjuOcenu = async () => {
            const snapshot = doc(db, 'usluge', izabrani.idUsluge);
            let snap = await getDoc(snapshot);
            let temp = snap.data();

            updateDoc(snapshot, { srednjaOcena: ((temp.srednjaOcena * temp.brojOcena) + value) / (temp.brojOcena + 1), brojOcena: temp.brojOcena + 1, nova: true });
            toast.success("Uspešno dodata ocena !");
        }


        dodajRating().then(() => { azurirajSrednjuOcenu(); setOpen(false); });

    }

    useEffect(() => {
        let temp = [];

        const getTutora = async () => {
            const q = query(collection(db, 'tutori'), where("userID", "==", id));
            const snapshot = await getDocs(q);
            snapshot.docs.forEach(e => setTu(e.data()));
        }
        getTutora();

        const getUsluge = async () => {
            const niz = [];
            const q = query(collection(db, 'usluge'), where("tutor", "==", id));
            const snapshot = await getDocs(q);
            snapshot.docs.forEach(e => {
                let obj = e.data();
                obj['idUsluge'] = e.id;
                niz.push(obj);
            });
            setUsluge(niz);

        }
        getUsluge();
    }, [])

    return (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"} height={"100%"}>
            <ResponsiveAppBar user={auth.currentUser} />
            <Grid container display={'flex'} flexDirection="column" alignItems="center">
                <Grid item container xs={12} sm={12} md={9} component={Paper} display='flex' flexDirection='column' alignItems="center" padding="2rem" style={{marginTop:15}}>
                    <Avatar src={tu.fotografija} alt="U" sx={{ width: "200px", height: "200px" }} />
                    <Typography variant="h4" fontWeight="700" marginBottom="2rem" borderBottom="2px solid gray">{tu.ime} {tu.prezime}</Typography>
                    <ColorButton onClick={doPoruka} >Pošaljite poruku  <MailIcon fontSize='large' style={{ width: '25%' }} /></ColorButton>
                </Grid>
                <Grid item container xs={12} sm={12} md={9} component={Paper} display='flex' flexDirection='column' padding="2rem" style={{marginTop:15,marginBottom:15}}>
                    <Typography variant="h5" fontWeight="600" borderBottom="1px solid gray">Biografija:</Typography>
                    <Typography variant="h6" fontWeight="500" >{tu.bio} </Typography>
                </Grid>
                <Grid item container xs={12} sm={12} md={9} component={Paper} display='flex' flexDirection='column' padding="2rem" style={{marginBottom:15}}>
                    <Typography variant="h5" fontWeight="600" marginBottom="1rem" borderBottom="1px solid gray">Usluge</Typography>
                    <Grid item container spacing={5}  >
                        {usluge.map((e) => {
                            return (
                                <Grid item md={4} sm={6} xs={12}>
                                    <Card >
                                       {e.fotografija ? <CardMedia component="img" height="180" image={e.fotografija} /> : <CardMedia component="img" height="180" image={slikaUsluga} />}
                                        <CardContent>
                                            <Typography component="h1" variant="h6" >
                                                {e.nazivUsluge}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ display: "flex", flexDirection: "row-reverse" }}>
                                            <ColorButton size="small" onClick={(event) => prikaziVise(e)}>Saznajte više</ColorButton>
                                            <Rating name="read-only" precision={0.5} value={e.srednjaOcena} readOnly sx={{ mr: 1 }} />
                                            <PopupDialog
                                                onClose={iskljuci}
                                                aria-labelledby="customized-dialog-title"
                                                open={open}
                                            >
                                                <PopupDialogTitle id="customized-dialog-title" onClose={iskljuci}>
                                                    {izabrani.nazivUsluge}
                                                </PopupDialogTitle>
                                                <DialogContent dividers>
                                                    <Typography gutterBottom>
                                                        <Box fontWeight='800' display='inline'>Kategotrija: </Box>
                                                        {izabrani.kategorija}
                                                    </Typography>

                                                    <Typography gutterBottom component='div'>
                                                        <Box fontWeight='800' display='inline'>Opis: </Box>
                                                        {izabrani.opis}
                                                    </Typography>
                                                    <Typography gutterBottom>

                                                    </Typography>
                                                    <Typography gutterBottom>
                                                        <Box fontWeight='800' display='inline'>Lokacija: </Box>
                                                        {izabrani.lokacija}
                                                    </Typography>

                                                    {ocenjeno.ocena !== undefined ?
                                                        <Box>
                                                            <Rating value={ocenjeno.ocena} readOnly />
                                                            <Typography>{ocenjeno.komentar}</Typography>
                                                        </Box>
                                                        :
                                                        <Box display="flex" flexDirection="column">
                                                            <Rating
                                                                name="simple-controlled"
                                                                value={value}
                                                                onChange={(event, newValue) => {
                                                                    setValue(newValue);
                                                                }}
                                                            />

                                                            <TextField value={komentar} onChange={(e) => setKomentar(e.target.value)}></TextField>
                                                            <ColorButton onClick={add} mt="2rem">Ocenite</ColorButton>

                                                        </Box>}
                                                </DialogContent>
                                            </PopupDialog>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )
                        }
                        )
                        }
                    </Grid>
                </Grid>
            </Grid>
                <Box display={"flex"} flexDirection="row" justifyContent={"center"} sx={{ background:"#2C7DA0"}} width={"100%"} margin={"auto"} padding={"auto"}>
                        <h4 style={{color:'#FFFFFF'}}>Copyright : JAiL team © 2022</h4>
                </Box>
        </Box>
    )
}

export default TutorProfil;