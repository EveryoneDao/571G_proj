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
    loadAllEvents,
    createFakeEvent,
    getCurrentWalletConnected
} from "../util/interact.js"
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ResultModal from './ResultModal.js';
import "./index.css";

const Dashboard = (props) => {
    const [events, setEvents] = useState([]);
    const [walletAddress, setWallet] = useState();
    const [result, setResult] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState("Show status here");

    //called only once
    useEffect(() => { //TODO: implement
        addViewAllEventsListener();
        addResultViewListener();
        addParticipateAnEventsListener();
        addNewEventCreatedListener();
        async function fetchData() {  
            const events = await loadAllEvents();
            // // TODO: just a place holder need to keep an eye on wallet address
            // const address = "0x5fA0932eFBeDdDeFE15D7b9165AE361033DFaE04";
            const { address, status } = await getCurrentWalletConnected();
            console.log(address);
            setWallet(address);
            console.log("events retrieved");
            console.log(events);
            setEvents(events);
            // console.log(events);
        }
        fetchData();
    }, []);

    //TODO: uncomment address and test
    // Expected behavior: 1. Gas Fee
    // PRIORITY: level 1 (basic functionality -> must work)

    // Participate one event: in contract view one event
    // we are not relying on the contract event to retrieve the poll detail
    // but need the function here to ask for gas fee (could be discussed further)
    const onParticipatePressed = async (pollID) => {
        console.log("onParticipatePressed");
        console.log(pollID);
        // uncomment this line when address is ready
        // const { status } = await viewAnEvent(walletAddress, pollID);
    };

    // return a poll object polls[pollId]
    // Should work as just to display the error message
    function addParticipateAnEventsListener() {
        console.log("addParticipateAnEventsListener");
        pollContract.events.pollViewed({}, (error, data) => {
            console.log("entered addParticipateAnEventsListener");
            if (error) {
                alert("Error message: " + error);
            } else {
                console.log("Participated successfully");
            }
        });
    }

    //TODO: test
    // Expected behavior: 1. gas fee. 2. Display the result in pop up modal
    const onViewResultsPressed = async (pollID) => {
        console.log(pollID);
        const { status } = await viewResult(walletAddress, pollID);
    };

    // Expected behavior: when results is returned show it in the pop up window
    // return value by the contract event:
    // event resultViewed(bool tie, Selection[] result, State state, bool blind);
    function addResultViewListener() {
        console.log("addResultViewListener");
        pollContract.events.resultViewed({}, (error, data) => {
            console.log("entered addParticipateAnEventsListener");
            if (error) {
                console.log("error");
            } else {
                const possibleSelection = ["DEFAULT", "A", "B", "C", "D", "E", "F", "G", "H"];
                if (data[2] == 0) {
                    setResult("Voting in progress, please check back later");
                } else {
                    let res = data[1];
                    if (data[0] == true) {
                        let resultMsg = "Tie Between options: "
                        for (let i = 0; i < data[1].length; i++) {
                            resultMsg += possibleSelection[res[i]] + ", ";
                        }
                        setResult(resultMsg);
                    } else {
                        if (res[0] == 0) {
                            setResult("No one voted.");
                        } else {
                            setResult("Most participate voted: " + possibleSelection[res[0]]);
                        }
                    }
                }
                setShowModal(true);
                console.log("Results logged successfully");
            }
        });
    }

    // TODO: delete it if no edge case handling needed
    // PRIORITY: level 3 (extra work todo)
    // Called when wallet address changed
    useEffect(() => {
        setWallet(props);
    }, [props.walletAddress]);

    // TODO: delete it if we don't need to sync it between users in real time
    // PRIORITY: level 3 (extra work todo)
    // watch for contract's pollCreated event
    // and update our UI when new event added 
    function addViewAllEventsListener() {
        console.log("addViewAllEventsListener");
        pollContract.events.pollsViewed({}, (error, data) => {
            console.log("entered");
            if (error) {
                console.log("error");
            } else {
                // data handling here: potential option: change events state
                // by performing the same action as in util/interact.js: loadAllEvents
                console.log("Events load successfully");
            }
        });
    }


    // return a poll object polls[pollId]
    // Should work as just to display the error message
    function addNewEventCreatedListener() {
        console.log("addNewEventCreatedListener");
        pollContract.events.pollCreated({}, (error, data) => {
            console.log("entered addNewEventCreatedListener");
            if (error) {
                console.log("created failed with error" + error);
                alert("Error message: " + error);
            } else {
                console.log("created successfully");
                console.log(data);
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

    const handleModalClose = () => {
        setShowModal(false);
    }

    const classes = useStyles();
    const data = events;

    return (
        <div className={classes.root}>
            <div><ResultModal result={result} status={showModal} handleModalClose={handleModalClose}/></div>
            <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="stretch"
            >
                <Grid item xs={12}>
                    <Link className="btn btn-create" to={{ pathname: '/PollFeature'}}>Create a <span>New Poll</span></Link>
                    <div position="absolute" top="0">
                    <a href="https://faucet.egorfine.com/"  target='_blank' >Get more <span>testnet tokens</span></a>
            </div>
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
                                    <Link to={{ pathname: '/PollBoard', state: { id: elem.id, description: elem.description, name: elem.name, options: elem.selections, wallet: walletAddress } }} onClick
                                        ={() => onParticipatePressed(elem.id)}>PARTICIPATE</Link>
                                </Grid>
                                <Grid item xs={6}><Button size="small" onClick
                                    ={() => onViewResultsPressed(elem.id)}>View Results</Button>
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