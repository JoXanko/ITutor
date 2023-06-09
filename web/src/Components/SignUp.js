import React, { useState } from 'react';

//--PNG imports--
import googleImg from '../assets/google.png';
import studentImg from '../assets/student.png';
import teacherImg from '../assets/teacher.png';
import logo2 from '../assets/logo2'

//--CSS import--
import '../css/SignUp.css';
import { ColorButton } from './Theme';

//--Material UI imports--
import Radio from '@mui/material/Radio';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';

//--Firebase imports--
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../App';
import { useNavigate } from 'react-router-dom'

const SignUp = () => {

  const db = getFirestore(app);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sign, setSignUp] = useState(false);

  const auth = getAuth(app);
  const navigate = useNavigate();

  const inputEmail = (event) => setEmail(event.target.value);
  const inputPassword = (event) => setPassword(event.target.value);

  const signUp = (event) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userData => {
        navigate("/");
      }).catch(e => console.log(e));
  }

  return (
    <Grid container display='flex' alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
      <CssBaseline />


      <Grid item xs={12} sm={9} md={4} component={Paper} elevation={12} display='flex' flexDirection='column' alignItems='center'>
        <Grid item style={{ paddingTop: 16 }}>
          <img src={logo2} height="100px" />
        </Grid>

        <Typography color='primary' component="h1" fontWeight='600' variant="h5" >
          Napravite novi nalog
        </Typography>

        <Box className="glavniBox" component="form" noValidate>
          <TextField margin="normal" required onChange={inputEmail} onKeyPress={e => { if (e.key == "Enter") { signUp() } }} fullWidth id="email" label="Email Adresa" name="email" autoComplete="email" />

          <TextField margin="normal" required onChange={inputPassword} onKeyPress={e => { if (e.key == "Enter") { signUp() } }} fullWidth name="password" label="Lozinka" type="password" id="password" autoComplete="current-password" />

          <Box style={{ marginBottom: 50 }}>
            <ColorButton fullWidth onClick={signUp} variant="contained" sx={{ mt: 3, mb: 2 }} >
              Napravite nalog
            </ColorButton>

            <Grid container display='flex' alignItems="center" justifyContent="center">
              <Grid item >
                <Link href="/login" variant="body2">
                  {"Već imate nalog? Prijavite se!"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>

  )
}

export default SignUp;