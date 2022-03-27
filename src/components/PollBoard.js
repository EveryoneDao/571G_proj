import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useEffect, useState } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardHeader
} from '@material-ui/core/'
import Button from '@mui/material/Button';
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import "./index.css";
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
    pollContract,
    selectAnOption
} from "../util/interact.js"

const useStyles = makeStyles(theme => ({
    cardStyle: {
        display: 'block',
        width: '30vw',
        transitionDuration: '0.3s',
        height: '17vw'
    },
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    }
}))

export default function PollBoard(props) {
    let loc = useLocation();
    let pollID = loc.state.id;
    let name = loc.state.name;
    let description = loc.state.description;
    const data = loc.state.options;
    const walletAddress = loc.state.wallet;
    console.log(walletAddress);
    const [status, setStatus] = useState("Hello Please Vote");
    const [selection, setSelection] = useState("");

    useEffect(() => { //TODO: implement
        async function fetchData() {
        }
        fetchData();
    }, []);

    function addSelectListener() { //TODO: test
        console.log("addViewAllEventsListener");
        pollContract.events.voteDone({}, (error, data) => {
            console.log("entered");
            if (error) {
                console.log("error");
                setStatus("😥 " + error.message);
            } else {
                console.log("what");
                setStatus("🎉 You have voted successfully");
            }
        });
    }

    const onSelectPressed = async () => { //TODO: test
        const { status } = await selectAnOption(walletAddress, pollID, selection);
        setStatus(status);
    };

    const onViewResultsPressed = async () => { //TODO: test
        const { status } = await viewPollResult(walletAddress, pollID);
        setStatus(status);
    };

    function addViewResultListener() { //TODO: test
        console.log("addViewAllEventsListener");
        pollContract.events.resultViewed({}, (error, data) => {
            console.log("entered");
            if (error) {
                console.log("error");
                setStatus("😥 " + error.message);
            } else {
                console.log("what");
                setStatus("🎉 You have voted successfully");
            }
        });
    }


    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
            >
                <Box sx={{ width: '100%' }}>
                    <Stack spacing={2}>
                        <div id="one">{name}</div>
                        <div id="two">{description}</div>
                    </Stack>
                </Box>
                <Grid container direction="row" alignItems="flex-start">

                    <Grid item xs={12} sm={6} md={6}>
                        <div className="c"> <Button onClick={() => { alert("✔️ This works on every component!"); }}>View Results</Button> </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="c"> <Button ><Link to='/Dashboard' target='_blank'> Back </Link></Button> </div>
                    </Grid>
                </Grid>
                {data.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={data.indexOf(elem)}>
                        <h1>{elem}</h1>
                        <Button variant="outlined" onClick={onUpdatePressed()}>Select</Button>
                    </Grid>
                ))}
            </Grid>
            <Grid item xs={12}>
                <div className="c"> <Button variant="disabled">Remaining time to show the results</Button> </div>
            </Grid>

        </div>
    )
}