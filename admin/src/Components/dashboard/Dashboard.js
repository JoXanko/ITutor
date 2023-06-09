import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ClassIcon from '@mui/icons-material/Class';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import logo from '../assets/logo4.png';


//Komponente
import GlavniPrikaz from '../GlavniPrikaz';
import Tutori from '../Tutori';
import Ucenici from '../Ucenici';
import Ocene from '../Ocene';
import Kategorije from '../Kategorije';
import Lokacije from '../Lokacije';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Sva prava rezervisana © '}

      ITutor,JAiL{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent(props) {
  const [open, setOpen] = useState(true);
  const [prikaz, setPrikaz] = useState(0);


  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    toggleDrawer();
  },[]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} sx={{backgroundColor:"#1f5d78"}}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <img src={logo} height='40' />
            
            <IconButton color="inherit">
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <React.Fragment>
              <ListItemButton onClick={(event) => setPrikaz(0)}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Glavna stranica" />
              </ListItemButton>
              <ListItemButton onClick={(event) => setPrikaz(1)}>
                <ListItemIcon>
                  <CoPresentIcon />
                </ListItemIcon>
                <ListItemText primary="Tutori" />
              </ListItemButton>
              <ListItemButton onClick={(event) => setPrikaz(2)}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Učenici" />
              </ListItemButton>
              <ListItemButton onClick={(event) => setPrikaz(3)}>
                <ListItemIcon>
                  <ThumbsUpDownIcon />
                </ListItemIcon>
                <ListItemText primary="Prijavljene ocene" />
              </ListItemButton>
              <ListItemButton onClick={(event) => setPrikaz(4)}>
                <ListItemIcon>
                  <ClassIcon />
                </ListItemIcon>
                <ListItemText primary="Kategorije"/>
              </ListItemButton>
              <ListItemButton onClick={(event) => setPrikaz(5)}>
                <ListItemIcon>
                  <LocationCityIcon />
                </ListItemIcon>
                <ListItemText primary="Lokacije"/>
              </ListItemButton>
              <ListItemButton onClick={(event) => props.logout()}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Izlogujte se"/>
              </ListItemButton>
            </React.Fragment>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection:'column',
            justifyContent:'space-between',
            alignItems:'center',
          }}
        >
          <Toolbar />

          <Box  sx={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-start'}} overflow={"hidden"}>
          {
            {
              0: <GlavniPrikaz />,
              1: <Tutori />,
              2: <Ucenici />,
              3: <Ocene />,
              4: <Kategorije />,
              5: <Lokacije />
            }[prikaz]
          }
          </Box>

          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard(props) {
  return <DashboardContent logout={props.logout}/>;
}
