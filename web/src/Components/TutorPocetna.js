import { React, useState, useRef, useEffect } from 'react';
import Tutor from '../assets/Tutor.png';
import slikaUsluga from '../assets/slikaUsluga.jpg';
//--Material UI imports--
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import { ConstructionOutlined, PhotoCamera } from '@mui/icons-material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

//--firebase imports--
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { app } from '../App.js';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { ColorButton, PopupDialog, PopupDialogTitle } from './Theme.js';
import Footer from '../elements/Footer';
import undf from '../assets/undefined.jpg'
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, CardMedia, Chip, DialogContent, Fade, FormControl, FormControlLabel, IconButton, Input, InputLabel, MenuItem, Radio, Rating, Select, Snackbar, TextField, Tooltip } from '@mui/material';
import { Badge } from 'react-bootstrap';


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
const TutorPocetna = () => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    //const [show, setShow] = useState(false);
    const [naslov, setNaslov] = useState("");
    const [opis, setOpis] = useState("");
    const [usluge, setUsluge] = useState([]);
    const [uslugeID, setUslugeID] = useState([]);
    const [niz1, setNiz1] = useState([]);
    const [niz2, setNiz2] = useState([]);
    const [ocene, setOcene] = useState([]);
    const [poruka, setPoruka] = useState('');
    const [slika, setSlika] = useState('');
    const [oblast, setOblast] = useState('');
    const [grad, setGrad] = useState('');
    const [nivo, setNivo] = useState('');
    const [IDzamene, setIDzamene] = useState('');

    const [file, setFile] = useState("");
    const storage = getStorage(app);

    const inputNaslov = (event) => setNaslov(event.target.value);
    const inputOpis = (event) => setOpis(event.target.value);

    const kategorijeRef = collection(db, "kategorije");
    const lokacijeRef = collection(db, "lokacija");
    const uslugeRef = collection(db, "usluge");
    const oceneRef = collection(db, "ocene");

    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);
    const [prikaziUsluge, setPrikaziUsluge] = useState(false);

    const current = new Date();

    const day = current.getDay();
    const month = current.getMonth();
    const date = current.getDate();

    const dani = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Cetvrtak', 'Petak', 'Subota'];
    const meseci = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];



    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setOpen2(false);
        setOpen5(false);
        setOpen6(false);
    }

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleChange2 = async (event) => {
        setFile(event.target.files[0]);
        setOpen6(true);
    }

    const ucitajUsluge = async () => {
        const us = [];
        const usID = [];
        const q = query(uslugeRef, where("tutor", "==", auth.currentUser.uid));
        const snapshot = await getDocs(q);

        snapshot.forEach((doc) => {
            us.push(doc.data());
            usID.push(doc.id);
        })
        setUsluge(us);
        setUslugeID(usID);
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
        ucitajUsluge();

    }, [nivo])
    const dodaj = async (event) => {
        setOpen4(!open4);
        if (IDzamene === '') {
            if (grad !== '' && oblast !== '' && nivo !== '' && naslov !== '' && opis !== '') {
                await addDoc(uslugeRef, { kategorija: oblast, lokacija: grad, nazivUsluge: naslov, opis: opis, stepen: nivo, tutor: auth.currentUser.uid, fotografija: slika, srednjaOcena: 0, brojOcena: 0, });
                ucitajUsluge();
                setPoruka("Usluga je uspešno dodata!");
                setOpen(true);
                setSlika('');
            }
        }
        else {
            if (grad !== '' && oblast !== '' && nivo !== '' && naslov !== '' && opis !== '') {
                const zamenaDoc = doc(db, "usluge", IDzamene)
                await updateDoc(zamenaDoc, { kategorija: oblast, lokacija: grad, nazivUsluge: naslov, opis: opis, stepen: nivo, fotografija: slika });
                setOpen(true);
                setPoruka("Usluga je uspešno promenjena!");
                ucitajUsluge();
                setSlika('');
            }
        }
    }

    async function izmeniUslugu(index) {
        await ucitajUsluge();
        setPadajuci(true);
        /*if (show === false) {
            setShow(!show);
        }*/
        setOpen4(!open4)
        setNivo(usluge.at(index).stepen);
        setOblast(usluge.at(index).kategorija);
        setGrad(usluge.at(index).lokacija);
        setNaslov(usluge.at(index).nazivUsluge);
        setOpis(usluge.at(index).opis);
        setIDzamene(uslugeID.at(index));
        setSlika(usluge.at(index).fotografija);
    }

    async function izbrisiUslugu(id) {
        await deleteDoc(doc(db, "usluge", id));
        setOpen2(true);
        ucitajUsluge();
    }

    async function prijaviOcenu(id) {
        let temp = doc(db, "ocene", id);
        updateDoc(temp, { oznacena: true });
        setOpen5(true);
        console.log(id);
    }

    async function sakriPrikazi() {
        ucitajUsluge();
        setNivo('');
        setOblast('');
        setGrad('');
        setNaslov('');
        setOpis('');
        setIDzamene('');
        setSlika('');
        //setShow(!show);
        setOpen4(true);
    }

    const promeniSliku = async () => {
        if (!file) {
            alert("Molim Vas izaberite fotografiju!");
        }
        const storageRef = ref(storage, `/files/${file.name}`);
        uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(storageRef).then((url) => {
                console.log(url);
                setSlika(url);
            });
        });
    }

    async function promeniOcenu(id) {
        const zamenaDoc = doc(db, "ocene", id)
        await updateDoc(zamenaDoc, { nova: false });
    }

    async function prikaziOcene(id) {
        ucitajUsluge();
        const zamenaDoc = doc(db, "usluge", id)
        await updateDoc(zamenaDoc, { nova: false });
        setOpen3(true);
        setOcene([]);
        const q = query(oceneRef, where("uslugaID", "==", id));
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(e => setOcene(ocene => [...ocene, { ...e.data(), idOcene: e.id }]));

        /*let temp = ocene;
        temp.sort((a, b) => b.datum - a.datum);
        console.log(temp);
        setOcene(temp);*/
    }
    const Input = styled('input')({
        display: 'none',
    });


    const [padajuci, setPadajuci] = useState(false);
    function ucitajPadajuci() {
        return <  >
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly" >
                <Box sx={{ mx: 2 }} width="40%">
                    <FormControl fullWidth sx={{ mr: 2 }}>
                        <InputLabel id="demo-simple-select-label">Oblast</InputLabel>
                        <Select
                            defaultValue={oblast}
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
                <Box sx={{ my: 2, mx: 3 }} width="40%">
                    <FormControl fullWidth sx={{ mr: 2 }}>
                        <InputLabel id="demo-simple-select-label">Lokacija</InputLabel>
                        <Select
                            defaultValue={grad}
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
        </ >

    }

    return (
        <Grid container item sm={12} md={9} sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: 'auto', padding: '5px' }}>
            <div>
                {!prikaziUsluge ? <>
                    <Grid item xs={12} component={Paper} elevation={10} sx={{ marginTop: '2rem', marginBottom: '2rem' }} >
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
                            <CardMedia component="img" sx={{ width: 250, display: { xs: 'none', sm: 'block' }, marginRight: '3rem' }} image={Tutor} />
                        </Card>
                    </Grid>
                </> : null}
                <Box mt="2rem" mb="2rem" >
                    <Typography variant="h3" align="center" marginBottom="2rem" fontWeight="700" borderBottom="2px solid gray">
                        {prikaziUsluge ? "Vaše usluge" : "Prikaži moje usluge"}
                    </Typography>
                    <ColorButton align="center" fullWidth onClick={() => setPrikaziUsluge(!prikaziUsluge)}>
                        {prikaziUsluge ? "Sakrij" : "Prikaži"}
                    </ColorButton>
                </Box>


                {prikaziUsluge ?
                    <Grid>
                        {usluge.map((usluga, index) => {
                            return (<Accordion sx={{ paddingRight: '2rem', paddingLeft: '2rem', paddingTop: '0.3rem', paddingBottom: '0.3rem' }} key={index} expanded={expanded === 'panel' + usluge.indexOf(usluga)} onChange={handleChange("panel" + usluge.indexOf(usluga))}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={"panel" + usluge.indexOf(usluga) + "bh-content"} id={"panel" + usluge.indexOf(usluga) + "bh-header"} >
                                    <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'}>
                                        <Box height='150px' minWidth='300px' display={'flex'} justifyContent={'center'} style={{ backgroundColor: 'lightGray', marginRight: '2rem', marginBottom: '1rem' }}>
                                            {usluga.fotografija ? <img src={usluga.fotografija} style={{ maxHeight: '150px', maxWidth: '300px', objectFit: 'contain' }} /> : <img src={slikaUsluga} style={{ maxHeight: '150px', maxWidth: '300px', objectFit: 'contain' }} />}
                                        </Box>
                                        <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'}>
                                            <Typography sx={{ flexShrink: 0 }} component="h3" fontWeight='700' variant="h5" style={{ marginRight: '2rem' }} >
                                                Naslov: {usluga.nazivUsluge}
                                            </Typography>
                                            <Tooltip title="Prikaži sve ocene za datu uslugu" arrow TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                                                <Typography style={{ display: 'flex', alignItems: 'center' }} component="h3" fontWeight='500' variant="h6" onClick={() => prikaziOcene(uslugeID.at(index))}>
                                                    Srednja ocena:
                                                    <Rating name="read-only" precision={0.1} value={usluga.srednjaOcena} readOnly />
                                                    {usluga.nova ? <Typography style={{ fontSize: 16, color: '#b3b068' }} fontWeight='500' variant="h6" >[Ima novih ocena]</Typography> : null}
                                                </Typography>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography borderTop={'solid gray 1px'} borderBottom={'solid gray 1px'} style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                                        {usluga.opis}
                                    </Typography>
                                    <Box display='flex' flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'}>
                                        <Box display='flex' flexDirection={'column'} style={{ paddingLeft: '1rem' }}>
                                            <Typography component="h3" fontWeight='500' variant="h6" style={{ paddingTop: '1rem' }}>
                                                ○ Lokacija: {usluga.lokacija}
                                            </Typography>
                                            <Typography component="h3" fontWeight='500' variant="h6" >
                                                ○ Stepen: {usluga.stepen}
                                            </Typography>
                                            <Typography component="h3" fontWeight='500' variant="h6" style={{ paddingBottom: '1rem' }}>
                                                ○ Oblast: {usluga.kategorija}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <ColorButton onClick={() => { izmeniUslugu(index) }} variant="contained" startIcon={<BorderColorIcon />} style={{ float: 'right' }}>
                                                Izmeni
                                            </ColorButton>
                                            <ColorButton onClick={() => izbrisiUslugu(uslugeID.at(index))} startIcon={<DeleteIcon />} variant="contained" sx={{ mr: 2 }} style={{ float: 'right' }}>
                                                Izbriši
                                            </ColorButton>
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                                <PopupDialog onClose={() => setOpen3(false)} fullWidth={true} aria-labelledby="customized-dialog-title" open={open3} BackdropProps={{ style: { opacity: '20%' } }}>
                                    <PopupDialogTitle id="customized-dialog-title" onClose={() => setOpen3(false)}>
                                        Ocene
                                    </PopupDialogTitle>
                                    <DialogContent dividers>
                                        <>
                                            {ocene.map((ocena, index) => {
                                                { promeniOcenu(ocena.idOcene) }
                                                return (
                                                    <Grid display='flex' flexDirection="column" flexWrap={'wrap'} component={Paper} elevation={10} margin={'1rem'} style={ocena.nova ? { border: 'double 5px #f2efa7' } : {}} >
                                                        <Box padding={"1rem"} >
                                                            <Box style={{ marginTop: '-30px', marginRight: '-30px', float: 'right' }}>
                                                                {ocena.nova ? <AutoAwesomeOutlinedIcon style={{ fontSize: 35, color: '#b3b068' }} /> : null}

                                                            </Box>
                                                            <Typography gutterBottom style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Box>
                                                                    <Box fontWeight='800' display='inline'>Datum: </Box>
                                                                    {new Date(ocena.datum.seconds * 1000).toLocaleDateString("de-DE", { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                                                                </Box>

                                                            </Typography>

                                                            <Typography gutterBottom style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Box style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Box fontWeight='800' display='inline'>Ocena: </Box>
                                                                    <Rating name="read-only" precision={0.1} value={ocena.ocena} readOnly />
                                                                </Box>
                                                                <ColorButton startIcon={<ReportGmailerrorredIcon />} variant="contained" onClick={() => prijaviOcenu(ocena.idOcene)}>
                                                                    Prijavi
                                                                </ColorButton>
                                                            </Typography>

                                                            <Typography gutterBottom >
                                                                <Box fontWeight='800' display='inline'>Komentar: </Box>
                                                                {ocena.komentar}
                                                            </Typography>

                                                            <Typography gutterBottom >

                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                )
                                            })}
                                        </>
                                    </DialogContent>
                                </PopupDialog>
                            </Accordion>

                            )
                        })}
                        <ColorButton onClick={() => sakriPrikazi()} variant="contained" sx={{ mt: 3, mb: 2, borderRadius: 8 }} style={{ float: 'right', height: '65px', marginRight: '3rem' }}>
                            <AddIcon style={{ fontSize: '2rem' }} />
                        </ColorButton>
                    </Grid>
                    : null}

            </div>
            {
                <PopupDialog onClose={() => setOpen4(false)} maxWidth={'md'} fullWidth={true} aria-labelledby="customized-dialog-title" open={open4} BackdropProps={{ style: { opacity: '60%' } }}>
                    <PopupDialogTitle id="customized-dialog-title" onClose={() => setOpen4(false)}>
                        {IDzamene ? "Izmena usluge" : "Nova usluga"}
                    </PopupDialogTitle>
                    <DialogContent dividers>
                        <Grid paddingLeft={"1rem"} paddingRight={"1rem"} display={'flex'} flexDirection={'column'} >
                            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-around'} alignItems={'center'}>
                                <Box height='150px' minWidth='300px' maxWidth='300px' display={'flex'} justifyContent={'center'} style={{ backgroundColor: 'lightGray' }}>
                                    {slika ? <img src={slika} style={{ maxHeight: '150px', maxWidth: '300px', objectFit: 'contain' }} /> : <img src={slikaUsluga} style={{ maxHeight: '150px', maxWidth: '300px', objectFit: 'contain' }} />}
                                </Box>
                                <Box display={'flex'} flexDirection={'row'} >
                                    <Box style={{ display: "inline" }} paddingTop={'1rem'}>
                                        <Stack direction="row" alignItems="center" spacing={2} style={{ marginBottom: '1rem' }}>
                                            <label htmlFor="contained-button-file">
                                                <Input accept="image/*" id="contained-button-file" type="file" onChange={handleChange2} fullWidth />
                                                <Button variant="contained" startIcon={<UploadIcon />} component="span" fullWidth>
                                                    Dodaj sliku
                                                </Button>
                                            </label>
                                        </Stack>
                                    </Box>
                                    <ColorButton startIcon={<PhotoCameraIcon />} style={{ marginBottom: '1rem', marginTop: '1rem', marginLeft: '0.5rem' }} onClick={promeniSliku}>
                                        Postavi sliku
                                    </ColorButton>
                                </Box>
                                <Box width={'100%'}>
                                    <Typography paddingLeft={'0.5rem'} fontWeight='600' variant="h6">
                                        Naslov
                                    </Typography>
                                    <TextField value={naslov} onChange={inputNaslov} placeholder={"Unestie naslov za usluge koju želite dodati"} fullWidth id="nazivUsluge" name="nazivUsluge" />
                                    <Typography paddingLeft={'0.5rem'} fontWeight='600' variant="h6">
                                        Opis
                                    </Typography>
                                    <TextField value={opis} multiline={true} onChange={inputOpis} placeholder={"Unesite opis usluge koju dodajete"} fullWidth name="opisUsluge" id="opisUsluge" />

                                </Box>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-evenly" mt="1rem">
                                <Typography fontWeight='600' variant="h6" >
                                    Stepen obrazovanja
                                </Typography>
                                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly">
                                    <FormControlLabel value="nivoOsnovne" control={<Radio onChange={(event) => setNivo("Nivo osnovne škole")} checked={nivo === "Nivo osnovne škole"} />} label="Nivo osnovne škole" />
                                    <FormControlLabel value="nivoSrednje" control={<Radio onChange={(event) => setNivo("Nivo srednje škole")} checked={nivo === "Nivo srednje škole"} />} label="Nivo srednje škole" />
                                    <FormControlLabel value="nivoFakulteta" control={<Radio onChange={(event) => setNivo("Nivo fakulteta")} checked={nivo === "Nivo fakulteta"} />} label="Nivo fakulteta" />
                                </Box>
                            </Box>
                            {padajuci ? ucitajPadajuci() : ucitajPadajuci()}
                            <ColorButton onClick={dodaj} startIcon={<SaveIcon />} variant="contained" style={{ alignSelf: 'center' }}>
                                {naslov ? "Sačuvaj" : "Dodaj"}
                            </ColorButton>
                        </Grid>
                    </DialogContent>
                </PopupDialog>
            }
            {prikaziUsluge ? <>

                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        {poruka}
                    </Alert>
                </Snackbar>
                <Snackbar open={open5} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="warning" icon={<PushPinOutlinedIcon />} sx={{ width: '100%' }}>
                        Ocena je označena za pregled
                    </Alert>
                </Snackbar>
                <Snackbar open={open2} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" icon={<DeleteOutlineIcon />} sx={{ width: '100%' }}>
                        Usluga je uspešno obrisana!
                    </Alert>
                </Snackbar>
                <Snackbar open={open6} autoHideDuration={3000} onClose={handleClose}>
                <Alert  onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Slika je uspšno dodata, možete kliknuti na "Postavi sliku"
                </Alert>
            </Snackbar>
            </> : null}


        </Grid >
    )
}

export default TutorPocetna;