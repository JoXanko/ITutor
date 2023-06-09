import React, { useState, useEffect } from 'react'
import { getFirestore,query,collection,where,getDocs } from 'firebase/firestore';
import { app } from '../App'; 
import { Avatar, Typography } from '@mui/material';

function ProfilBadge(props) {

    const [ime,setIme] = useState("");
    const [prezime,setPrezime] = useState("");
    const [foto,setFoto] = useState("");
    const db = getFirestore(app);

    useEffect(()=>{
        getDocs(query(collection(db,"ucenici"),where("userID","==",props.korisnikID))).then((value)=>{
            value.docs.forEach((el)=>{
                let t = el.data();
                setIme(t.ime);
                setPrezime(t.prezime);
                setFoto(t.foto);
            })
        })
    },[props.korisnikID]);

    return (
        <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-start', alignItems:'center'}}>
            <Avatar src={foto} sizes={"small"} sx={{mr:'1rem'}}/>
            <Typography>{ime + ' ' + prezime}</Typography>
        </div>
    )
}

export default ProfilBadge;
