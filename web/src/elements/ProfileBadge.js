import { React, useState, useEffect } from 'react';

//--CSS imports--
import '../css/App.css'

import { Navigate, useNavigate } from 'react-router-dom';

//--Material UI imports--
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Avatar } from '@mui/material';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

//--firebase imports--

import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";

import { app } from '../App.js';
import Button from '@mui/material/Button';

const ProfileBadge = (props) => {

    const db = getFirestore(app);
    const navigate = useNavigate();

    const [tu, setTu] = useState({});
    
    useEffect(() => {
        const getTutora = async () => {
            const q = query(collection(db, 'tutori'), where("userID", "==", props.tutor));
            const snapshot = await getDocs(q);
            snapshot.docs.forEach(e => setTu(e.data()))
        }
        getTutora();

    }, [])

    const doTutora = () =>{
        navigate('/tutorProfil/'+tu.userID);
    }

    return (
        <Button onClick={doTutora} sx={{border:"2px solid #012A4A", borderRadius:"25px"}}>
            <Grid sx={{ display: "flex", flexDirection: "row",  alignItems: "center" }}>
                <Avatar alt="U" src={tu.fotografija} />
                <Typography fontWeight="600" sx={{ ml: 1.5 }}>
                    {tu.ime} {tu.prezime}
                </Typography>
            </Grid>
        </Button>
    )
}

export default ProfileBadge;