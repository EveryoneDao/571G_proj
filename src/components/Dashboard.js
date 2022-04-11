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
    filterPolls,
    viewAnEvent
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
import CircularProgress from '@mui/material/CircularProgress';

import { useHistory } from "react-router-dom";

let tmp;
const Dashboard = (props) => {
    const possibleSelection = ["DEFAULT", "A", "B", "C", "D", "E", "F", "G", "H"];
    const [events, setEvents] = useState([]);
    const [initialAllEvents, setInitialAllEvents] = useState([]);
    const [walletAddress, setWallet] = useState();
    const [result, setResult] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState("Show status here");
    const [filters, setFilters] = React.useState([]);
    const history = useHistory();
    const [loading, setLoading] = React.useState(false);


    //called only once
    useEffect(() => { //TODO: implement
        addViewBlindResultFailListener();
        addResultViewListener();
        // participateEventListener(); // TODO: change into view
        async function fetchData() {
            const { address, status } = await getCurrentWalletConnected();
            if(typeof(status) == "string" && status.includes("Rejected")) {
                alert(status);
                location.href = "/";
            }else{
                const events = await loadAllEvents(address);
                setWallet(address);
                setEvents(events);
                setInitialAllEvents(events);
            }
        }
        fetchData();
    }, []);

    // Participate one event: in contract view one event
    const onParticipatePressed = async (pollID) => {
        const thisPoll = await viewAnEvent(walletAddress, pollID);
        console.log(thisPoll);

        let pollName = thisPoll.name;
        let pollDescription = thisPoll.description;
        let choseFrom = thisPoll.choseFrom;
        let optionsDescription = thisPoll.optionDesc;
        console.log("optionsDescription " + optionsDescription);
        console.log("choseFrom " + choseFrom);
        let optionsDisplay = [];
        const testStr = "this is a very long string just be here to test selection display";
        for (let i = 0; i < choseFrom.length; i++) {
            optionsDisplay.push(possibleSelection[choseFrom[i]] + ": " + optionsDescription[i]);
        }
        console.log("options " + optionsDisplay);
        history.push({ pathname: '/PollBoard', state: { id: pollID, description: pollDescription, name: pollName, ops: optionsDisplay, wallet: walletAddress } });
    };

    // Expected behavior: 1. gas fee. 2. Display the result in pop up modal
    const onViewResultsPressed = async (pollID) => {
        const res = await viewResult(walletAddress, pollID);
        setLoading(true);
        console.log("onViewResultsPressed "+ typeof(res));
        if(typeof(res) === "string" && res.includes("rejected")){
            setLoading(false);
        }
    };

    // Expected behavior: when results is returned show it in the pop up window
    // return value by the contract event:
    // event resultViewed(bool tie, Selection[] result, State state, bool blind);
    function addResultViewListener() {
        pollContract.events.resultViewed({}, (error, data) => {
            setLoading(false);
            if (error) {
                console.log("error");
            } else {
                let resultMsg = "";
                if (data.returnValues.blind) {
                    resultMsg += "Blind ";
                } else {
                    resultMsg += "Real time ";
                }
                if (data.returnValues.state == 0) {
                    resultMsg += "poll in progress. "
                } else {
                    resultMsg += "poll ended. "
                }

                const votingResult = data.returnValues.result;
                const isTie = data.returnValues.tie;
                if (isTie) {
                    resultMsg += "Tie Between options: ";
                    for (let i = 0; i < votingResult.length; i++) {
                        resultMsg += possibleSelection[votingResult[i]] + ", ";
                    }
                } else {
                    if (votingResult.length == 0) {
                        resultMsg += "No one voted.";
                    } else {
                        resultMsg += "Most participate voted: " + possibleSelection[votingResult[0]];
                    }
                }
                setResult(resultMsg);
                setShowModal(true);
                console.log("Results logged successfully");
            }
        });
    }

    function addViewBlindResultFailListener() {
        pollContract.events.blindResultViewedFailed({}, (error, data) => {
            setLoading(false);
            if (error) {
                console.log("error");
            } else {
                const remainingMinutes = +data.returnValues.remainingSeconds/ 60;
                setResult("The poll is blind and will end in "+ Math.ceil(remainingMinutes)  + " minutes. Come back later.");
                setShowModal(true);
                console.log("Results cannot view logged successfully");
            }
        });
    }


    // TODO: delete it if no edge case handling needed
    // PRIORITY: level 3 (extra work todo)
    // Called when wallet address changed
    useEffect(() => {
        setWallet(props);
    }, [props.walletAddress]);


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

    // 'All', 'About Dao', 'Not About Dao', 'Blind Vote', 'Non-Blind Vote', 'Created By Me', 'Not Created By Me',
    // TODO: Need Test
    const handleChange = async (event) => {
        let {
            target: { value },
        } = event;
        console.log("on filter change " + JSON.stringify(initialAllEvents));
        const filterToDisplay = value;
        if (value.includes("All") || value.length == 0) {
            setEvents(initialAllEvents);
            setFilters([]);
            return;
        }

        let isByMe = value.includes("Created By Me") ? true : false;
        let isAboutDao = 0;
        let isBlind = 0;

        value = preprocessFilters(value);
        if (value.length == 0) {
            setEvents(initialAllEvents);
            setFilters(
                // On autofill we get a stringified value.
                typeof filterToDisplay === 'string' ? filterToDisplay.split(',') : filterToDisplay,
            );
            return;
        }
        // Default 0, true: 1, false: 2
        isAboutDao = value.includes("About Dao") ? 1 : 0;
        isAboutDao = value.includes("Not About Dao") ? 2 : isAboutDao;

        isBlind = value.includes("Blind Vote") ? 1 : 0;
        isBlind = value.includes("Non-Blind Vote") ? 2 : isBlind;

        isByMe = value.includes("Created By Me") ? 1 : 0;
        isByMe = value.includes("Not Created By Me") ? 2 : isByMe;

        setFilters(
            // On autofill we get a stringified value.
            typeof filterToDisplay === 'string' ? filterToDisplay.split(',') : filterToDisplay,
        );
        pollsLocalFilter(walletAddress, isByMe, isAboutDao, isBlind);
    };

    function preprocessFilters(value) {
        // Preprocess walletResponse
        if (value.includes("About Dao") && value.includes("Not About Dao")) {
            value = value.filter(function (string) { return (string != "About Dao" && string != "Not About Dao"); });
        };

        if (value.includes("Blind Vote") && value.includes("Non-Blind Vote")) {
            value = value.filter(function (string) { return (string != "Blind Vote" && string != "Non-Blind Vote"); });
        };

        if (value.includes("Created By Me") && value.includes("Not Created By Me")) {
            value = value.filter(function (string) { return (string != "Created By Me" && string != "Not Created By Me"); });
        };
        return value;
    }

    function satisfyFilterConstrain(event, aboutDAO, isBlind, isByMe, address) {
        if (isBlind == 1 && !event.isBlind) return false;
        if (isBlind == 2 && event.isBlind) return false;

        if (aboutDAO == 1 && !event.isAboutDao) return false;
        if (aboutDAO == 2 && event.isAboutDao) return false;

        // want create by me but not
        if (isByMe == 1 && event.creator != address) return false;
        // want not create by me but yes
        if (isByMe == 2 && event.creator == address) return false;
        return true;
    };

    function pollsLocalFilter(address, isByMe, isAboutDao, isBlind) {
        console.log("is about DAO " + isAboutDao)
        let filterResults = [];
        for (let i = 0; i < events.length; i++) {
            if (satisfyFilterConstrain(events[i], isAboutDao, isBlind, isByMe, address)) {
                filterResults.push(events[i]);
            }
        }
        setEvents(filterResults);
        return filterResults;
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
        'Created By Me',
        'Not Created By Me',
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
                    <div position="absolute">
                    <a href='/' className="backLink" >LOG OUT</a>
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
                                <Link to={{ pathname: '/'}} >Test</Link>
                            </Grid>
                            <Grid item xs={6}><Button id="cardButton" size="small" onClick={() => { alert("Welcome! Please Like our github repo at: \n \n https://github.com/taichenl/571G_proj!"); }}>View Results</Button>
                            </Grid>
                        </CardActions>
                    </Card>
                </Grid>
                {data.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={data.indexOf(elem)}>
                        <Card className={classes.cardEle}>
                            <CardHeader
                                title={`${elem.name}`}
                                subheader={`Participants: ${elem.participants}  `}
                            />
                            <CardContent>
                                <Typography className="cut-text" gutterBottom>
                                    {elem.description}
                                </Typography>
                            </CardContent>
                            <CardActions >
                                <Grid item xs={6}>
                                    <Button id="cardButton" size="small" font-size= "0.7rem" onClick
                                        ={() => onParticipatePressed(elem.id)}>PARTICIPATE</Button>
                                </Grid>
                                <Grid  item xs={6}><Button id="cardButton" size="small" font-size= "0.7rem"onClick
                                    ={() => onViewResultsPressed(elem.id)}>View Results</Button>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

            </Grid>
            <div>
                {loading && <div><CircularProgress color="inherit" /><span className="spinningInfo">Information Retrieving in progress</span></div>}
            </div>
        </div>
    );
};
export default Dashboard;