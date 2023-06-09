import React, { useState, useEffect } from 'react'
import { getFirestore, collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';



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
import { ButtonGroup, Typography, TextField, Box } from '@mui/material';

import { app } from '../App';

export default function Ucenici() {

  const [ucenici, setUcenici] = useState([]);
  const [filter, setFilter] = useState("");
  const [filtrirano, setFiltrirano] = useState([]);
  const db = getFirestore(app);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  }


  const handleReset = (korisnik) =>{
    //brisanje ocena
    getDocs(query(collection(db,"ocene"),where("korisnikID","==",korisnik.userID))).then((value)=>{
      value.docs.forEach((el) =>{
        let t = doc(db,"ocene",el.id);
        deleteDoc(t);
      })
    })

    //brisanje konverzacija
    getDocs(query(collection(db,"konverzacije"),where("korisnici","array-contains",korisnik.userID))).then((value)=>{
      value.docs.forEach((el) =>{
        let t = doc(db,"konverzacije",el.id);
        deleteDoc(t);
      })
    })
    
    //brisanje ucenika
    deleteDoc(doc(db,"ucenici",korisnik.docID));
  }

  useEffect(() => {
    let temp = [];
    getDocs(collection(db, "ucenici")).then((value) => {
      value.forEach((el) => {
        let t = el.data();
        t.docID = el.id;
        temp.push(t);
      });
    }).then((el) => {
      setUcenici(temp);
      setFiltrirano(temp);
    });
  }, []);

  useEffect(() => {
    let temp = [];
    ucenici.forEach((tutor) => {
      if (tutor.ime.includes(filter) || tutor.prezime.includes(filter)) {
        temp.push(tutor);
      }
    });
    setFiltrirano(temp);
  }, [filter]);

  return (
    <Grid container  overflow={"scroll"}>
      <Grid item md={12} padding={"1rem"}>
        <Box width={"30%"}>
          <Typography variant={"h4"} sx={{mb:"1rem"}}>Pregled ucenika</Typography>
          <Typography>Pretraga</Typography>
          <TextField variant={"outlined"} value={filter} onChange={handleFilter} fullWidth />
        </Box>
      </Grid>
      <Grid item md={12} padding={"1rem"}>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Fotografija</TableCell>
                <TableCell>ID korisnika</TableCell>
                <TableCell>ime</TableCell>
                <TableCell>Prezime</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtrirano.map((row) => (
                <TableRow
                  key={row.userID}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell><Avatar src={row.fotografija} /></TableCell>
                  <TableCell>{row.userID}</TableCell>
                  <TableCell>{row.ime}</TableCell>
                  <TableCell>{row.prezime}</TableCell>
                  <TableCell align={"right"}>
                    <ButtonGroup>
                      <Button color={"error"} onClick={(event) => handleReset(row)}>Resetujte</Button>
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
