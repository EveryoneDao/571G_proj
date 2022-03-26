import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
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

const useStyles = makeStyles(theme => ({
    cardStyle:{
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

export default function PollBoard() {
    const classes = useStyles()
    const data = [
        { choice: "A"},
        { choice: "B"},
        { choice: "C"},
        { choice: "D"}
    ]
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
                <Stack spacing = {2}>
                <div id="one">one</div>
                <div id="two">two</div>
                </Stack>
                </Box>
                <Grid item xs={12}>  <div> Remaining # participants to vote </div>  </Grid>
                <Grid container direction="row" alignItems="flex-start">
                
                <Grid item xs={12} sm={6} md={6}>
                <div className="c"> <Button onClick={() =>{ alert("✔️ This works on every component!"); }}>View Results</Button> </div>  
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                <div className="c"> <Button >Back</Button> </div>  
                </Grid>
                 </Grid>
                {data.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={data.indexOf(elem)}>
                        <h1>{elem.choice}</h1>
                        <Button variant="outlined">Select</Button>
                     </Grid>
                ))}
            </Grid>
            <Grid item xs={12}>
            <div className="c"> <Button variant="disabled">Remaining time to show the results</Button> </div>
            </Grid>
            
        </div>
    )
}