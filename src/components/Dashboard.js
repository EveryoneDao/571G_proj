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
    getCurrentWalletConnected,
    viewResult,
    filterPolls
} from "../util/interact.js"
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ResultModal from './ResultModal.js';
import "./index.css";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';

const Dashboard = (props) => {
    const [events, setEvents] = useState([]);
    const [walletAddress, setWallet] = useState();
    const [result, setResult] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState("Show status here");
    const [filters, setFilters] = React.useState([]);

    //called only once
    useEffect(() => { //TODO: implement
        addViewAllEventsListener();
        addResultViewListener();
        addParticipateAnEventsListener();
        addNewEventCreatedListener();
        viewFilterPollsListener();
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

    const onCreatePollPressed = async () => {
        console.log("onCreatePollPressed");
        console.log(walletAddress)
        // TODO: create pull -> copy paste this part to the first page
        // This one is just a fake creation we need to grab information from the firstpage.js and then create
        const pollDescription = "on chain fake event select A if you are happy to day, select B if you feel mad today, select C if you feel sad today";
        const pollName = "Fake Chain Poll 1";
        const pollDuration = 259200;
        const isBlind = false;
        const isAboutDao = false;
        const options = [1, 2, 3];
        const optionDescription = ["A", "B", "C"];
        const { status2 } = await createFakeEvent(walletAddress, pollName, pollDescription, pollDuration, isBlind, isAboutDao, options, optionDescription);
        setStatus(status2);
        console.log("on create poll finished");
        console.log(status2);
    };

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

    const handleChange = async (event) => {
        console.log("before" + filters);
        const {
            target: { value },
        } = event;
        console.log("mid" + value);
        console.log("mid type" + value.includes("About Dao"));
        let isByMe = value.includes("Created By Me")? true: false;
        let isAboutDao = value.includes("About Dao")? 1:0;
        isAboutDao = value.includes("Not About Dao")? 2: isAboutDao;
        let isBlind = value.includes("Blind Vote")? 1:0;
        isBlind = value.includes("Non-Blind Vote")? 2:isBlind;
        if(value.includes("All")){
            isByMe = false;
            isAboutDao = 0;
            isBlind = 0;
        }
        setFilters(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        await filterPolls(walletAddress, isByMe, isAboutDao, isBlind);
    };

    function viewFilterPollsListener() {
        console.log("viewFilterPollsListener");
        pollContract.events.pollsViewed({}, (error, data) => {
            console.log("entered viewAllPollsListener");
            if (error) {
                console.log("polls viewed failed with error" + error);
                alert("Error message: " + error);
            } else {
                console.log("viewed filteredPolls successfully");
                console.log(data);
            }
        });
    }

    function getStyles(selection, filters, theme) {
        return {
          fontWeight:
          filters.indexOf(selection) === -1
              ? theme.typography.fontWeightRegular
              : theme.typography.fontWeightMedium,
        };
      }

    const classes = useStyles();
    const data = events;
    const selections = [
        'All',
        'About Dao',
        'Not About Dao',
        'Blind Vote',
        'Non-Blind Vote',
        'Created By Me'
    ];
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    
    const theme = useTheme();

    return (
        <div className={classes.root}>
            <div><ResultModal result={result} status={showModal} handleModalClose={handleModalClose} /></div>
            <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="stretch"
            >
                <Grid item xs={12} >
                    <Link className="btn btn-create" to={{ pathname: '/PollFeature' }}>Create a <span>New Poll</span></Link>
                </Grid>
                <Grid item xs={12} >
                    <div position="absolute" top="0" >
                        <a href="https://faucet.egorfine.com/" target='_blank' className="linkToFaucet" >Get more <span >testnet tokens</span></a>
                    </div>
                    <div className="dropDown">
                        <Box sx={{ minWidth: 130, maxWidth: 200, ml: "80%", borderColor: 'primary.main' }} >
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="multiple-filter-label">Filter</InputLabel>
                                <Select
                                    labelId="multiple-filter-label"
                                    id="multiple-filter"
                                    multiple
                                    value={filters}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Filter" />}
                                    MenuProps={MenuProps}
                                >
                                    {selections.map((selection) => (
                                        <MenuItem
                                            key={selection}
                                            value={selection}
                                            style={getStyles(selection, filters, theme)}
                                        >
                                            {selection}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
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