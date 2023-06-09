//--CSS imports--
import './css/App.css';

//--Component imports--
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import HomePage from './Components/HomePage';
import Profile from './Components/Profile';
import NotFound from './Components/NotFound';
import ProfileSetup from './Components/ProfileSetup';
import Chat from './Components/Chat';
import Ocene from './Components/Ocene';
import UserPretraga from './Components/UserPretraga';
import TutorProfil from './Components/TutorProfil';

//--Firebase imports--
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword } from "firebase/auth"

import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { getFirestore } from 'firebase/firestore';
import { ThemeProvider } from '@emotion/react';
import { theme } from './Components/Theme';

//--Firebase configuration--
const firebaseConfig = {

  apiKey: "AIzaSyD2p28xTEXysFkXUcHxA6cUjE3QtPsxq6A",
  authDomain: "itutor-6659e.firebaseapp.com",
  projectId: "itutor-6659e",
  storageBucket: "itutor-6659e.appspot.com",
  messagingSenderId: "349737232952",
  appId: "1:349737232952:web:36416adaf0adc40851d4cd",
  measurementId: "G-G0Q2MKM7HD"

};

export const app = initializeApp(firebaseConfig);

const App = () =>{

  const auth = getAuth(app);
  const [user,setUser] = useState({});

  useEffect(()=>{
    auth.setPersistence(browserLocalPersistence).then(()=>{
      onAuthStateChanged(auth,(user)=>{
        setUser(user);
      })
    })
    
  },[]);

  return (
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path='*' element={<NotFound />} />
            <Route path='/' element={ user ? <HomePage /> : <Navigate to="/login" />}> </Route>
            <Route path='/profile' element={ user ? <Profile /> : <Navigate to="/login" />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/signup' element={<SignUp />}></Route>
            <Route path='/userPretraga' element={ user? <UserPretraga /> :  <Navigate to="/login" />}></Route>
            <Route path='/chat' element={user? <Chat /> :  <Navigate to="/login" />}></Route>
            <Route path='/tutorProfil/:id' element={user? <TutorProfil /> :  <Navigate to="/login" />}></Route>
            <Route path='/setupProfile' element={ user ? <ProfileSetup /> : <Navigate to="/login" />}></Route>
            <Route path='/ocene' element={<Ocene />}></Route>
          </Routes>
        </Router>
      </ThemeProvider>
  );
}
export default App;