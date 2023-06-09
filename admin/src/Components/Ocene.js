import React, { useState, useEffect } from 'react'
import { getFirestore, collection, getDocs, query, where, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';



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
import ProfileBadge from './ProfilBadge';

import { app } from '../App';

export default function Ocene() {

  const [ocene, setOcene] = useState([]);
  const db = getFirestore(app);

  const handleOk = (id) => {
    updateDoc(doc(db, "ocene", id), { oznacena: false }).then(() => loadData());

  }

  const handleObrisi = (id) => {
    deleteDoc(doc(db, "ocene", id)).then(() => loadData());
  }

  const loadData = async () => {
    let temp = [];
    await getDocs(query(collection(db, "ocene"), where("oznacena", "==", true))).then((value) => {
      value.forEach((el) => {
        let t = el.data();
        t['docID'] = el.id;
        temp.push(t);
      });
    }).then(() => {
      setOcene(temp);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Grid container  overflow={"scroll"}>
      <Grid item md={12} padding={"1rem"}>
        <Box width={"30%"}>
          <Typography variant={"h4"}>Prijavljene ocene</Typography>
        </Box>
      </Grid>
      <Grid item md={12} padding={"1rem"}>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Korisnik</TableCell>
                <TableCell>ID usluge</TableCell>
                <TableCell>Komentar</TableCell>
                <TableCell>Ocena</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ocene.map((row) => (
                <TableRow
                  key={row.docID}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell><ProfileBadge korisnikID={row.korisnikID}/></TableCell>
                  <TableCell>{row.uslugaID}</TableCell>
                  <TableCell>{row.komentar}</TableCell>
                  <TableCell>{row.ocena}</TableCell>
                  <TableCell align={"right"}>
                    <ButtonGroup>
                      <Button color={"success"} onClick={(event) => handleOk(row.docID)}>Odobri</Button>
                      <Button color={"error"} onClick={(event) => handleObrisi(row.docID)}>Izbrisi</Button>
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
