import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, onSnapshot, query, orderBy, addDoc, Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore'

import { app } from '../App';
import Grid from '@mui/material/Grid';
import { Button, TextField, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ChipCopy } from './Theme';
import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';

const SingleChat = (props) => {

    const skrol = useRef();

    const auth = getAuth(app);
    const db = getFirestore(app);
    const [messages, setMessages] = useState([]);
    const [novaPoruka, setNovaPoruka] = useState('');

    const posaljiPoruku = async () => {
        if (novaPoruka !== '') {
            await addDoc(collection(db, "konverzacije/" + props.sagovornik.idKonvo + "/poruke"), {
                datumVreme: Timestamp.now(),
                od: auth.currentUser.uid,
                poruka: novaPoruka,
                svidjano: false
            });
            setNovaPoruka('');
        }

        skrol.current.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        skrol.current.scrollIntoView({ behavior: 'auto' });
    }, [messages])

    useEffect(() => {
        const porukeRef = query(collection(db, "konverzacije/" + props.sagovornik.idKonvo + "/poruke"), orderBy("datumVreme", "asc"));
        const unsubscribe = onSnapshot(porukeRef, (querySnapshot) => {
            const poruke = [];
            querySnapshot.forEach((doc) => {
                poruke.push(doc.data());
            });
            setMessages(poruke);
        }
        )
    }, [props.sagovornik]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div style={{ padding: "0.5rem", borderBottom: "2px solid dimGray", display: "flex", flexDirection: "row", justifyContent: "flex-start", backgroundColor: "white", height: '8%' }}>
                <Avatar src={props.sagovornik.fotografija} style={{ marginRight: "1rem" }}></Avatar>
                <Typography variant="h4">{props.sagovornik.ime} {props.sagovornik.prezime}</Typography>
            </div>

            <div style={{ height: '80%', overflowY: 'scroll' }}>
                {messages.map((message) => {
                    const date = message['datumVreme'];
                    const dateObject = new Date(date * 1000);
                    const humanDateFormat = dateObject.toLocaleTimeString();
                    if (message['od'] == auth.currentUser.uid) {
                        return (<div style={{ display: "flex", flexDirection: "row-reverse" }}>
                            <Box>
                                <ChipCopy ja={true} poruka={message} vreme={humanDateFormat} boja={"#1f5d78"} />

                            </Box>

                        </div>);

                    } else {

                        return (<div >
                            <Box>
                                <ChipCopy foto={props.sagovornik.fotografija} vreme={humanDateFormat} poruka={message} boja={"gray"} />

                            </Box>
                        </div>);
                    }
                })}
                <div ref={skrol}></div>
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", height: '10%' }}>

                <TextField value={novaPoruka}
                    onChange={(e) => setNovaPoruka(e.target.value)}
                    onKeyPress={e => { if (e.key == "Enter") { posaljiPoruku() } }}
                    style={{ width: '95%' }}></TextField>
                <SendIcon fontSize='large' onClick={posaljiPoruku} style={{ width: '5%' }} />

            </div>
        </div>
    )
}

export default SingleChat;
