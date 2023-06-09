import React, { useState, useEffect } from 'react';

//--PNG imports--
import studentImg from '../assets/student.png';
import teacherImg from '../assets/teacher.png';
import logo2 from '../assets/logo2';
import undefined from '../assets/undefined.jpg'

//--CSS import--
import '../css/SignUp.css';
import { theme, ColorButton } from './Theme';

//--Material UI imports--
import Radio from '@mui/material/Radio';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';

//--Firebase imports--
import { getAuth, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { app } from '../App';
import { useNavigate, Navigate } from 'react-router-dom'

const ProfileSetup = () => {

  const db = getFirestore(app);
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [tutor, setTutor] = useState(false);
  const [flag, setFlag] = useState(false);
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const inputIme = (event) => setIme(event.target.value);
  const inputPrezime = (event) => setPrezime(event.target.value);

  const setup = (event) => {
    let uid = user.uid;
    const dName = ime + ' ' + prezime;
    updateProfile(auth.currentUser, { displayName: dName });
    const tutorFunc = async () => {
      await addDoc(collection(db, 'tutori'), {
        userID: uid,
        ime: ime,
        prezime: prezime,
        fotografija:  user.photoURL,
        bio: "",
        dodatoNa : Timestamp.now(),
      }).then(() => navigate("/"));;
    }

    const ucenikFunc = async () => {
      await addDoc(collection(db, 'ucenici'), {
        userID: uid,
        ime: ime,
        prezime: prezime,
        fotografija: user.photoURL,
        dodatoNa : Timestamp.now(),
      }).then(() => navigate("/"));
    }

    if (tutor) {
      tutorFunc();
    } else {
      ucenikFunc();
    }

  }

  const logout = () =>{
    auth.signOut();
  }


  useEffect(() => {

    const func = async () => {
      const id = user.uid;

      const uRef = collection(db, 'ucenici');
      const uQuery = query(uRef, where("userID", "==", id));
      const uQuerySnapshot = await getDocs(uQuery);

      const tRef = collection(db, 'tutori');
      const tQuery = query(tRef, where("userID", "==", id));
      const tQuerySnapshot = await getDocs(tQuery);

      if (uQuerySnapshot.empty === false) {
        setFlag(true);
      }

      if (tQuerySnapshot.empty === false) {
        setFlag(true);
      }
    }

    onAuthStateChanged(auth, (temp) => {
      setUser(temp);
      func();
    })
  }, []);

  return (
    <div>
      {flag ? <Navigate to="/" /> : null}
      <ThemeProvider theme={theme}>
        <Grid container component="main" display='flex' alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
          <CssBaseline />


          <Grid item xs={12} sm={8} md={4} component={Paper} elevation={12} display='flex' flexDirection='column' alignItems='center' sx={{ my: 12, mx: 8 }}>
            <Grid item style={{ paddingTop: 16 }}>
              <img src={logo2} height="100px" />
            </Grid>

            <Typography color='primary' component="h1" fontWeight='600' variant="h5" >
              Podesite svoj profil!
            </Typography>

            <Box className="glavniBox" component="form" noValidate>
              <TextField margin="normal" required onChange={inputIme} fullWidth label="Ime" autoComplete="email" />

              <TextField margin="normal" required onChange={inputPrezime}  fullWidth label="Prezime" />

              <Box className='avatari' >
                <Box className='avatar' >
                  <Avatar alt="S" src={studentImg} sx={{ width: 100, height: 100 }} />
                  <FormControlLabel value="ucenik" control={<Radio onChange={(event) => setTutor(false)} checked={!tutor} />} label="Učenik" />
                </Box>

                <Box className='avatar'>
                  <Avatar alt="T" src={teacherImg} sx={{ width: 100, height: 100 }} />
                  <FormControlLabel value="tutor" control={<Radio onChange={(event) => setTutor(true)} checked={tutor} />} label="Tutor" />
                </Box>
              </Box>

              <Box style={{  }}>
                <ColorButton onClick={setup} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                  Podesite nalog!
                </ColorButton>

              </Box>

              <Box style={{ marginBottom: 50 }}>
                <ColorButton onClick={logout} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                  Izlogujte se!
                </ColorButton>

              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>

  )
}

export default ProfileSetup;