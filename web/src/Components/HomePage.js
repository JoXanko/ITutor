import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

//--Material UI imports--
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';


//--Firebase imports--
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs , query,  where } from 'firebase/firestore';

import { app } from '../App.js';

import UserPocetna from './UserPocetna.js';
import TutorPocetna from './TutorPocetna.js';
import ResponsiveAppBar from '../elements/ResponsiveAppBar'
import ProfileSetup from './ProfileSetup.js';
import Futer from '../elements/Footer';


const HomePage = () => {

    const auth = getAuth(app);
    const [isTutor,setIsTutor] = useState(false);
    const [isUcenik,setIsUcenik] = useState(false);
    const [setup,setSetup] = useState(false);
    const db = getFirestore(app);

    useEffect(()  => {

      const func = async () => {

        const uRef = collection(db, 'ucenici');
        const uQuery = query(uRef, where("userID" , "==", auth.currentUser.uid));
        const uQuerySnapshot = await getDocs(uQuery);

        const tRef = collection(db, 'tutori');
        const tQuery = query(tRef, where("userID" , "==", auth.currentUser.uid));
        const tQuerySnapshot = await getDocs(tQuery);
  
        if(uQuerySnapshot.empty == false) {
          setIsUcenik(true);
        }

        if(tQuerySnapshot.empty == false) {
          setIsTutor(true);
        } 

        if(uQuerySnapshot.empty && tQuerySnapshot.empty){
          setSetup(true);
        }
      }
      onAuthStateChanged(auth,(user)=>{
        func();
      });
    },[]);

  return (
    <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between', height:"100%", minHeight:'100vh'}}>
      {setup ? <Navigate to="/setupProfile"/> : null}
        
        <CssBaseline />
        <ResponsiveAppBar user={auth.currentUser}/>
      {isTutor ? <TutorPocetna /> : null}
      {isUcenik ? <UserPocetna /> : null}
    <Futer />
    </div>
  );
}

export default HomePage;