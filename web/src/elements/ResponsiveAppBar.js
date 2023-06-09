import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

//--PNG imports--
import logo4 from '../assets/logo4.png'

//--Material UI imports--
import AppBar from '@mui/material/AppBar';
import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import GradeIcon from '@mui/icons-material/Grade';

//--firebase imports--
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import { app } from '../App.js';
import Profile from '../Components/Profile';
import UserPocetna from '../Components/UserPocetna';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';




const ResponsiveAppBar = (props) => {

  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [isTutor, setIsTutor] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const func = async () => {
    const db = getFirestore(app);
    const uRef = collection(db, 'ucenici');
    const uQuery = query(uRef, where("userID", "==", props.user?.uid));
    const uQuerySnapshot = await getDocs(uQuery);
    
    if (uQuerySnapshot.empty == false) {
      setIsTutor(false);
    }
    else
      setIsTutor(true);
  }
  func();

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfil = () => {
    navigate("/profile");
  }


  const handleMessage = () => {
    navigate("/chat");
  }

  const handleOdjava = () => {
    signOut(auth)
  }

  return (
    <AppBar position="relative">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", alignItems: 'center', width: '100%' }}>
          <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center'>

            <Link href='/' >
              <img src={logo4} height='40' cs={{ mr: 2 }} />


            </Link>
          </Box>
          <Box sx={{ display: { xs: 'flex' } }}>
            <IconButton size="large" color="inherit" onClick={handleMessage} mr='2'>
              <Badge color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <Box sx={{ ml: 2 }}>
              <Tooltip title="Otvorite podešavanja">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="U" src={props.user?.photoURL} />
                </IconButton>
              </Tooltip>
              <Menu
                className={"navMenu"}
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >

                <MenuItem onClick={handleProfil}>
                  <ListItemIcon>
                    <PersonIcon fontSize="medium" />
                  </ListItemIcon>
                  <Typography textAlign="center">Profil</Typography>
                </MenuItem>
                {isTutor ? (<>
                </>) : (<></>

                )
                }
                <MenuItem onClick={handleOdjava}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="medium" />
                  </ListItemIcon>
                  <Typography textAlign="center">Odjavite se</Typography>
                </MenuItem>


              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
