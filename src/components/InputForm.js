import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { CardActions } from 'material-ui';

export default function AddressForm() {
    function createNewElement() {
        // First create a DIV element.
        var txtNewInputBox = document.createElement('div');
    
        // Then add the content (a new input box) of the element.
        txtNewInputBox.innerHTML = "<input type='text' id='newInputBox'>";
    
        // Finally put it where it is supposed to appear.
        document.getElementById("newElementId").appendChild(txtNewInputBox);
    }

    function displayChoice(){
        var num = document.getElementById("numberofChoice").value;
        console.log(num);
        for (let i = 0; i < num; ++i){
            console.log(i);
        }
    }
  return (
    <React.Fragment>
      {/* <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography> */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
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
        <FormControlLabel
            control={<Checkbox color="secondary" name="blindVost" value="yes" />}
            label="Blind Vote"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <FormControlLabel
            control={<Checkbox color="secondary" name="aboutDao" value="yes" />}
            label="About DAO or Not"
          />
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