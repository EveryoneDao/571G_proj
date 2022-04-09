import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { CardActions } from 'material-ui';
import PollCreationModal from './PollCreationModal.js';
import { useEffect, useState } from "react";
import {
  pollContract,
  createFakeEvent,
  getCurrentWalletConnected
} from "../util/interact.js"

export default function AddressForm() {

    const [walletAddress, setWallet] = useState();
    const [showModal, setShowModal] = useState(false);
    useEffect(() => { //TODO: implement
      addNewEventCreatedListener();
      async function fetchData() {  
        // // TODO: just a place holder need to keep an eye on wallet address
        // const address = "0x5fA0932eFBeDdDeFE15D7b9165AE361033DFaE04";
        const { address, status } = await getCurrentWalletConnected();
        console.log(address);
        setWallet(address);
      }
      fetchData();
    }, []);

    function createNewElement() {
        // First create a DIV element.
        var txtNewInputBox = document.createElement('div');
    
        // Then add the content (a new input box) of the element.
        txtNewInputBox.innerHTML = "<input type='text' id='newInputBox'>";
    
        // Finally put it where it is supposed to appear.
        document.getElementById("newElementId").appendChild(txtNewInputBox);
    }

    function displayChoice(){
        setShowModal(true);
        var num = document.getElementById("numberofChoice").value;
        console.log(num);
        for (let i = 0; i < num; ++i){
            console.log(i);
        }
    }

    const onCreatePollPressed = async () => {
      console.log("onCreatePollPressed");
      console.log(walletAddress);
      // TODO: create pull -> copy paste this part to the first page
      // This one is just a fake creation we need to grab information from the firstpage.js and then create
      const pollDescription = "on chain fake event select A if you are happy to day, select B if you feel mad today, select C if you feel sad today";
      const pollName = "Fake Chain Poll 1";
      const pollDuration = 259200;
      const isBlind = false;
      const isAboutDao = false;
      const options = [1, 2, 3];
      const optionDescription = ["A", "B", "C"];
      const { status2 } = await createFakeEvent(walletAddress, pollName, pollDescription,pollDuration, isBlind, isAboutDao, options, optionDescription);
      setStatus(status2);
      console.log("on create poll finished");
      console.log(status2);
      // uncomment this line when address is ready
      // const { status } = await viewAnEvent(walletAddress, pollID);
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

    const handleModalClose = () => {
      setShowModal(false);
    } 
  return (
    <React.Fragment>
      <div><PollCreationModal status={showModal} handleModalClose={handleModalClose}/></div>
      {/* <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography> */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="pollName"
            name="pollName"
            label="Poll Name"
            fullWidth
            autoComplete="given-name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="pollDuration"
            name="pollDuration"
            label="Poll Duration (in seconds)"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="pollDescription"
            name="pollDescription"
            label="Poll Description"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        {/* <FormControlLabel
            control={<Checkbox color="secondary" name="blindVost" value="yes" />}
            label="Blind Vote"
          /> */}
          Blind Vote <input type = "checkbox" id = "blindVote"/> 
        </Grid>
        <Grid item xs={12} sm={6}>
        {/* <FormControlLabel
            control={<Checkbox color="secondary" name="aboutDao" value="yes" />}
            label="About DAO or Not"
          /> */}
          About DAO or Not<input type = "checkbox" id = "aboutDao"/> 
        </Grid>
        <Grid item xs={12} sm={6}>
        <label>
            Number of Choices:
            <input type="text" id = "numberofChoice" pattern="[0-9]*"/>
        </label>
        <button onClick={displayChoice}> Submit </button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}