import React, { useState, useEffect } from 'react'
import { getFirestore, collection, getDocs, query, where, doc, deleteDoc, add, addDoc } from 'firebase/firestore';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { ButtonGroup, Typography, TextField, Box, Checkbox, FormControlLabel } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

import { app } from '../App';

export default function Kategorije() {

    const [kategorije, setKategorije] = useState([]);
    const [naziv, setNaziv] = useState("");

    const [osnovna,setOsnovna] = useState(false);
    const [srednja,setSrednja] = useState(false);
    const [faks,setFaks] = useState(false);

    const db = getFirestore(app);

    const handleObrisi = (id) => {
        deleteDoc(doc(db, "kategorije", id)).then(() => loadData());
    }

    const handleDodaj = (event) =>{
        let stepeni = [];

        if(osnovna)
            stepeni.push("Nivo osnovne škole");
        
        if(srednja)
            stepeni.push("Nivo srednje škole");

        if(faks)
            stepeni.push("Nivo fakulteta");

        addDoc(collection(db,"kategorije"),{nazivKategorije:naziv,stepen:stepeni}).then(()=>{loadData()});
    }

    const loadData = async () => {
        let temp = [];
        await getDocs(collection(db, "kategorije")).then((value) => {
            value.forEach((el) => {
                let t = el.data();
                t.docID = el.id;
                temp.push(t);
            });
        }).then((el) => {
            setKategorije(temp);
        });
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Grid container overflow={"scroll"}>
            <Grid item md={12} padding={"1rem"}>
                <Typography variant={"h4"} sx={{mb:"1rem"}}>Kategorije</Typography>
                <Grid width={"50%"}>
                    <Typography sx={{mb:"0.5rem"}} variant={"h6"}>Dodajte kategoriju</Typography>
                    <TextField sx={{mb:"0.5rem"}} variant={"outlined"} value={naziv} onChange={(event) => setNaziv(event.target.value)} fullWidth />
                    <FormControlLabel
                        control={
                            <Checkbox checked={osnovna} onChange={(event) => setOsnovna(event.target.checked)}/>
                        }
                        label="Nivo osnovne škole"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={srednja} onChange={(event) => setSrednja(event.target.checked)}/>
                        }
                        label="Nivo srednje škole"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={faks} onChange={(event) => setFaks(event.target.checked)}/>
                        }
                        label="Nivo fakulteta"
                    />
                    <Button variant={"contained"} color={"success"} onClick={(event) => handleDodaj()}>Dodaj</Button>
                </Grid>
            </Grid>
            <Grid item md={12} padding={"1rem"}>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} >
                        <TableHead>
                            <TableRow>
                                <TableCell>Kategorija</TableCell>
                                <TableCell>Nivo osnovne škole</TableCell>
                                <TableCell>Nivo srednje škole</TableCell>
                                <TableCell>Nivo fakulteta</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {kategorije.map((row) => (
                                <TableRow
                                    key={row.docID}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{row.nazivKategorije}</TableCell>
                                    <TableCell>{row.stepen.includes("Nivo osnovne škole") ? <DoneIcon /> : null}</TableCell>
                                    <TableCell>{row.stepen.includes("Nivo srednje škole") ? <DoneIcon /> : null}</TableCell>
                                    <TableCell>{row.stepen.includes("Nivo fakulteta") ? <DoneIcon /> : null}</TableCell>
                                    <TableCell align={"right"}>
                                        <ButtonGroup>
                                            <Button color={"error"} onClick={(event) => handleObrisi(row.docID)}> Obriši</Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}
