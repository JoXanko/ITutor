import React,{ useState } from 'react';
import Dashboard from './Components/dashboard/Dashboard';
import SignIn from './SignIn';

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD2p28xTEXysFkXUcHxA6cUjE3QtPsxq6A",
  authDomain: "itutor-6659e.firebaseapp.com",
  projectId: "itutor-6659e",
  storageBucket: "itutor-6659e.appspot.com",
  messagingSenderId: "349737232952",
  appId: "1:349737232952:web:57d6c86745b938a551d4cd",
  measurementId: "G-T20ZBDZZ6T"
};

export const app = initializeApp(firebaseConfig);

const App = () => {

  const [token,setToken] = useState("");

  const tokenAquire = (val) =>{
    localStorage.setItem("token",val);
    setToken(val);
  }

  const logout = () =>{
    localStorage.setItem("token","");
    setToken("");
  }

  return (
    localStorage.getItem("token") != "" ? <Dashboard logout={logout}></Dashboard> : <SignIn tokenCb={tokenAquire}/>
  )
}

export default App;

