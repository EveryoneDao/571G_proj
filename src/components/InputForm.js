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
    useEffect(() => { 
      addNewEventCreatedListener();
      async function fetchData() {  
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
    const onCreatePollPressed = async() => {
      console.log("onCreatePollPressed");
      console.log(walletAddress);
      var num = document.getElementById("numberofChoice").value;
      console.log(num);
      for (let i = 0; i < num; ++i){
          console.log(i);
      }
      // TODO: Change into real options instead of fake ones

      const pollName = document.getElementById("pollName").value;
      const pollDescription = document.getElementById("pollDescription").value;
      const pollDuration = document.getElementById("pollDuration").value * 60;
      const isBlind = document.getElementById("blindVote").checked;
      const isAboutDao = document.getElementById("aboutDao").checked;
      const options = [1, 2, 3];
      const optionDescription = ["A", "B", "C"];
      await createFakeEvent(walletAddress, pollName, pollDescription, pollDuration, isBlind, isAboutDao, options, optionDescription);
      // const { status2 } = await createFakeEvent(address, walletAddress, pollName, pollDescription,pollDuration, isBlind, isAboutDao, options, optionDescription);
      // setStatus(status2);
      console.log("on create poll finished");
      // console.log(status2);
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
              setShowModal(true);
              console.log("created successfully");
              console.log(data.returnValues); // TODO: Print this into warning or modal 
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
            label="Poll Duration (in minutes)"
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
        <button onClick={() => onCreatePollPressed()}> Submit </button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}