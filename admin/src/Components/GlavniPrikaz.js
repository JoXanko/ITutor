import { useEffect, useState } from "react"
import { getFirestore, getDocs, query, where, collection, Timestamp } from "firebase/firestore"
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { app } from '../App'
import React from 'react'
import { Grid, Typography } from "@mui/material";

export default function GlavniPrikaz() {

  const db = getFirestore(app);

  const [dataKategorije, setDatakategorije] = useState({
    labels: [],
    datasets: [{
      backgroundColor: ['rgba(0,10,220,0.5)'],
      label: 'Po kategoriji',
      data: [],
    },
    ]
  });

  const [dataLokacije, setDataLokacije] = useState({
    labels: [],
    datasets: [{
      backgroundColor: 'rgba(220,0,10,0.5)',
      label: 'Po lokaciji',
      data: [],
    },
    ]
  });

  const [brojUcenika,setUcenici] = useState(0);
  const [brojTutora,setTutori] = useState(0);

  const vratiKategorijeData = () => {
    let data = {
      labels: [],
      datasets: [{
        backgroundColor: ['rgba(0,10,220,0.5)'],
        label: 'Po kategoriji',
        data: [],
      },
      ]
    };

    getDocs(collection(db, "kategorije")).then((values) => {
      values.docs.forEach((val) => {
        data.labels.push(val.data()['nazivKategorije']);
      });
    }).then(() => {
      data.labels.forEach((value, index) => {
        getDocs(query(collection(db, "usluge"), where("kategorija", "==", value))).then((values) => {
          data.datasets[0].data.splice(index, 0, values.size);
        })
      })
    }).then(() => setDatakategorije(data));
  }

  const vratiLokacijeData = () => {
    let data = {
      labels: [],
      datasets: [{
        backgroundColor: 'rgba(220,0,10,0.5)',
        label: 'Po lokaciji',
        data: [],
      },
      ]
    };

    getDocs(collection(db, "lokacija")).then((values) => {
      values.docs.forEach((val) => {
        data.labels.push(val.data()['grad']);
      });
    }).then(() => {
      data.labels.forEach((value, index) => {
        getDocs(query(collection(db, "usluge"), where("lokacija", "==", value))).then((values) => {
          data.datasets[0].data.splice(index, 0, values.size);
        })
      })
    }).then(() => setDataLokacije(data));
  }


  const vratiBrojeve = () =>{
    let t = 0;
    let u = 0;
    getDocs(collection(db,"tutori")).then((values)=>{
      t = values.size;
    }).then(()=>{
      getDocs(collection(db,"ucenici")).then((ele)=>{
        u = ele.size;
      }).then(()=>{
          setUcenici(u);
          setTutori(t);
      })
    })
  }
  
  useEffect(() => {
    vratiKategorijeData();
    vratiLokacijeData();
    vratiBrojeve();
  }, [])



  return (
    <Grid container sx={{height:"100%"}}>
      <Grid item xs={12} padding={"1rem"} sx={{height:"40%"}}>
        <Typography variant={"h4"} sx={{mb:"1rem"}}>Broj tutora na platformi : {brojTutora}</Typography>
        <Typography variant={"h4"} sx={{mb:"1rem"}}>Broj ucenika na platformi : {brojUcenika}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Bar data={dataKategorije} />
      </Grid>
      <Grid item xs={6}>
        <Bar data={dataLokacije} />
      </Grid>
    </Grid>
  )
}
