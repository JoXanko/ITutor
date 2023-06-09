import React, { useState } from 'react';

//--image imports--
import googleImg from '../assets/google.png';
import logo2 from '../assets/logo2'

//--CSS imports--
import '../css/Login.css';
import { ColorButton } from './Theme';

//--Material UI imports--
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/ReactToastify.min.css";

//--Firebase imports--
import { signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';

import { app } from '../App.js';
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loaded, setLoaded] = useState("");
  const auth = getAuth(app);
  const navigate = useNavigate();

  const inputEmail = (event) => {
    setEmail(event.target.value);

  };
  const inputPassword = (event) => setPassword(event.target.value);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider).then((userCredentail) => {
      navigate("/");
    });

  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setPersistence(auth, browserLocalPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigate("/");
        }).catch((e) => {
          if (e.code == 'auth/invalid-email') {
            toast.error("Unesite validan email!");
          } else if (e.code == 'auth/internal-error') {
            toast.error("Unesite lozinku!");
          } else if (e.code == 'auth/user-not-found') {
            toast.error("Ne postoji nalog!");
          } else if (e.code == 'auth/wrong-password') {
            toast.error("Neispravna lozinka!");
          } else if (e.code == 'auth/too-many-requests') {
            toast.error("Pokušajte ponovo!");
          }

        });
    });

  }

  return (
    <div>
      
      <Grid container component="main" display='flex' alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
        <CssBaseline />


        <Grid item xs={24} sm={8} md={4} component={Paper} elevation={12} display='flex' flexDirection='column' alignItems='center'>
          <Grid item style={{ paddingTop: 16 }}>
            <img src={logo2} style={{ maxHeight: 100, }} />
          </Grid>

          <Typography color='primary' component="h1" fontWeight='600' variant="h5" >
            Prijava
          </Typography>

          <Box className="glavniBox" component="form" noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" helperText={errors.email} required onChange={inputEmail} onKeyPress={e => { if (e.key == "Enter") { handleSubmit(e) } }} fullWidth id="email" label="Email Adresa" name="email" autoComplete="email" />

            <TextField margin="normal" required onChange={inputPassword} fullWidth onKeyPress={e => { if (e.key == "Enter") { handleSubmit(e) } }} name="password" label="Lozinka" type="password" id="password" autoComplete="current-password" />
            <Box>
              <ColorButton fullWidth onClick={handleSubmit} variant="contained" sx={{ mt: 3, mb: 2, height: '40px' }} >
                Prijavite se
              </ColorButton>

              <Grid container display='flex' alignItems="center" justifyContent="center">
                <Grid item >
                  <Link href="/signup" variant="body2">
                    {"Nemate nalog? Napravite ga!"}
                  </Link>
                </Grid>
              </Grid>
            </Box>

            <ColorButton variant="contained" fullWidth color="primary" className="Login" onClick={signInWithGoogle} sx={{ mt: 4, mb: 3, height: '40px' }} >
              <span>
                <img src={googleImg} height="25px" width="25px" />
              </span>
              <span>
                <span>
                  Prijavite se preko Google-a
                </span>
              </span>
            </ColorButton>

          </Box>
        </Grid>
      </Grid>
      <ToastContainer position="top-center" hideProgressBar={true} newestOnTop />


    </div>
  )
}

export default Login;