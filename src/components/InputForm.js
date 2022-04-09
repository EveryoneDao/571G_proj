import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { CardActions } from 'material-ui';
import PollCreationModal from './PollCreationModal.js';
import { useEffect, useState } from "react";

export default function AddressForm() {
    const [showModal, setShowModal] = useState(false);

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