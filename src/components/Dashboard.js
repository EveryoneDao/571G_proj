import React from 'react'
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles'
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardHeader
} from '@material-ui/core/'
import {
    pollContract,
    loadAllEvents
} from "../util/interact.js"
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./index.css";

const Dashboard = (props) => {
    const [events, setEvents] = useState([]);
    const [walletAddress, setWallet] = useState();

    //called only once
    useEffect(() => { //TODO: implement
        async function fetchData() {
            const events = await loadAllEvents();
            // TODO: just a place holder need to keep an eye on wallet address
            const address = "0x5fA0932eFBeDdDeFE15D7b9165AE361033DFaE04";
            setWallet(address);
            console.log("events retrived");
            console.log(events);
            setEvents(events);
            addViewAllEventsListener();
            // console.log(events);
            // setEvent(events);
        }
        fetchData();
    }, []);

    useEffect(() => {
        setWallet(props);
    }, [props.walletAddress]);

    // watch for contract's pollCreated event
    // and update our UI when new event added 
    function addViewAllEventsListener() { //TODO Test
        console.log("addViewAllEventsListener");
        pollContract.events.pollsViewed({}, (error, data) => {
            console.log("entered");
            if (error) {
                console.log("error");
                // setStatus("😥 " + error.message);
            } else {
                // setEvents(data.returnValues[0]);
                console.log("what");
                // setStatus("🎉 Events load successfully");
            }
        });
    }

    const onParticipatePressed = async () => { //TODO: implement
        const { status } = await viewAnEvent(walletAddress, pollID);
        // setStatus(status);
    };

    // watch for contract's pollCreated event
    // and update our UI when new event added 
    function addParticipateAnEventsListener() {
        console.log("addParticipateAnEventsListener");
        pollContract.events.pollViewed({}, (error, data) => {
            console.log("entered addParticipateAnEventsListener");
            if (error) {
                console.log("error");
                // setStatus("😥 " + error.message);
            } else {
                // setEvents(data.returnValues[0]);
                console.log("what");
                // setStatus("🎉 Events load successfully");
            }
        });
    }

    const useStyles = makeStyles(theme => ({
        largeIcon: {
            '& svg': {
                fontSize: 60
            }
        },
        root: {
            flexGrow: 1,
            padding: theme.spacing(2)
        },
        cardEle: {
            height: "100%",
            margin: "1rem",
        },
        cardText: {
            fontSize: "2vi",
        }
    }))
    const classes = useStyles()
    const data = events
    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="stretch"
            >
                <Grid item xs={12}>
                    <a href="/PollBoard" className="btn btn-create">Create a <span>New Poll</span></a>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={classes.cardEle}>
                        <CardHeader title={`Poll : 0`} subheader={`Participants: 0`} />
                        <CardContent>
                            <Typography className="cut-text" gutterBottom>
                                Just a template, please create a new poll.
                            </Typography>
                        </CardContent>
                        <CardActions position="center">
                            <Grid item xs={6}>
                                <Link to={{ pathname: '/PollBoard', state: { id: 1, name: 'sabaoon', shirt: 'green' } }} >Test</Link>
                            </Grid>
                            <Grid item xs={6}><Button size="small" onClick={() => { alert("✔️ Please add a new event or join an existing event!"); }}>View Results</Button>
                            </Grid>
                        </CardActions>
                    </Card>
                </Grid>
                {data.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={data.indexOf(elem)}>
                        <Card className={classes.cardEle}>
                            <CardHeader
                                title={`Poll : ${elem.name}`}
                                subheader={`Participants: ${elem.participants}`}
                            />
                            <CardContent>
                                <Typography className="cut-text" gutterBottom>
                                    {elem.description}
                                </Typography>
                            </CardContent>
                            <CardActions >
                                <Grid item xs={6}>
                                    <Link to={{ pathname: '/PollBoard', state: { id: elem.participants, description: elem.description, name: elem.name, options: elem.options, wallet: walletAddress } }} >PARTICIPATE</Link>
                                </Grid>
                                <Grid item xs={6}><Button size="small" >View Results</Button>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};
export default Dashboard;