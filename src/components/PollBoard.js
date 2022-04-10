import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useEffect, useState } from "react";
import {
    Grid,
} from '@material-ui/core/'
import Button from '@mui/material/Button';
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import "./index.css";
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
    pollContract,
    selectAnOption,
    viewResult,
    getCurrentWalletConnected
} from "../util/interact.js"
import ResultModal from './ResultModal.js';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    }
}))

// TODO: further potential update: display user's current choice as a text msg on this page in "status" state
export default function PollBoard() {
    let loc = useLocation();
    // for current page
    const [status, setStatus] = useState("Hello Please Vote");
    const [pollID, setPollID] = useState(0);
    const [name, setName] = useState(0);
    const [description, setPollDescription] = useState("Please select a poll from the dashboard");
    const [data, setData] = useState([]);
    const [walletAddress, setWalletAddress] = useState("");

    // For pop up modal
    const [result, setResult] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        async function fetchData() {
            if (loc.state !== undefined) {
                console.log("loc state is not undefined");
                console.log(loc.state);
                setPollID(loc.state.id);
                setName(loc.state.name);
                setPollDescription(loc.state.description);
                setData(loc.state.ops);
                const { address, status } = await getCurrentWalletConnected();
                setWalletAddress(address);
                setShowModal(false);
                addSelectListener();
                addViewResultListener();
            }else{
                console.log("loc state undefined");
            }
        }
        fetchData();
        // console.log("setData");
        // console.log(data);
        // console.log(pollID);
        // console.log(walletAddress);
    }, []);

    // TODO: Uncomment and test
    // Expected behavior: 1. gas fee. 2. select message update(for further functionality)
    const onSelectPressed = async (optionIndex) => {
        alert("Option " + optionIndex + " Selected");
        let selection = optionIndex + 1;
        const { status } = await selectAnOption(walletAddress, pollID, selection);
        setStatus("You have selected optionIndex Please wait");
        setLoading(true);
    };

    //TODO: test
    // Expected behavior: 1. select message update(for further functionality)
    function addSelectListener() {
        pollContract.events.voteDone({}, (error, data) => {
            setLoading(false);
            if (error) {
                console.log("error");
                setStatus("😥 " + error.message);
            } else {
                console.log("what");
                setStatus("🎉 You have voted successfully");
            }
        });
    }

    // TODO: Uncomment and test
    // Expected behavior: 1. gas fee. 2. pop up window as triggered by the contract event
    const onViewResultsPressed = async () => { //TODO: test
        console.log(pollID);
        const { status } = await viewResult(walletAddress, pollID);
        setLoading(true);
    };

    // Expected behavior: when results is returned show it in the pop up window
    // return value by the contract event:
    // event resultViewed(bool tie, Selection[] result, State state, bool blind);
    function addViewResultListener() {
        pollContract.events.resultViewed({}, (error, data) => {
            setLoading(false);
            if (error) {
                console.log("error");
            } else {
                console.log("result data is: " + JSON.stringify(data.returnValues));
                const votingState = data.returnValues.state;
                const possibleSelection = ["DEFAULT", "A", "B", "C", "D", "E", "F", "G", "H"];
                if(votingState == 0){
                    setResult("Voting in progress, please check back later");
                }else{
                    const votingResult = data.returnValues.result;
                    const isTie = data.returnValues.tie;
                    if(isTie){
                        let resultMsg = "Tie Between options: "
                        for (let i = 0; i < votingResult.length; i++) {
                            resultMsg += possibleSelection[votingResult[i]] + ", ";
                        }
                        setResult(resultMsg);
                    }else{
                        if(votingResult.length == 0){
                            setResult("No one voted.");
                        }else{
                            setResult("Most participate voted: " + possibleSelection[votingResult[0]]);
                        }
                    }
                }
                setShowModal(true);
                console.log("Results logged successfully");
            }
        });
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    const classes = useStyles()
    return (
        <div className={classes.root}>
            <div><ResultModal result={result} status={showModal} handleModalClose={handleModalClose} /></div>
            <Box sx={{ width: '100%', height: '100%'}}>
                    <Stack spacing={2} height = "40vh" >
                        <div id="one">{name}</div>
                        <span id="two">{description}</span>
                    </Stack>
                </Box>
            <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                height= "80vh"
            > 
                <Grid container direction="row" alignItems="flex-start">
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="c"> <Button onClick={onViewResultsPressed} style={{ fontSize: '1vw', color:'#778899' }}>View Results</Button> </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="c"> <Button ><Link to='/Dashboard' style={{ fontSize: '1vw', color:'#778899'}}> Back </Link></Button> </div>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <div className="c"> <Button variant="disabled" style={{ fontSize: '2rem' }}>Status Message Here</Button> </div>
                    <div>
                {loading && <div><CircularProgress color="inherit" /><span className="spinningInfo">Information Retrieving in progress</span></div>}
            </div>
                </Grid>
                {data.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={data.indexOf(elem)}>
                        <h1 className = "cut-text-poll ">{elem}</h1>
                        <Button variant="outlined" onClick
                            ={() => onSelectPressed(data.indexOf(elem))}
                            style={{ fontSize: '1rem' }}>Select</Button>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}