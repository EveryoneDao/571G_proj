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
import CardActions from '@mui/material/CardActions';
import AddCircleIcon from '@mui/icons-material/AddCircle';
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
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={12}>  <div class="c"> Poll Name </div>  </Grid>
                <Grid item xs={12} position="center">  
                <div class="a">
                <Card >
                    <CardHeader title={'Poll Description'} />
                    <CardContent>
                        <Typography variant="h5" gutterBottom> Poll Description </Typography>
                    </CardContent>
                    <CardActions> <Button size="small">Join</Button>  </CardActions>
                </Card> 
                </div>
                
                </Grid>
                <Grid item xs={12}>  <div> Remaining # participants to vote </div>  </Grid>
                {data.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={data.indexOf(elem)}>
                        <h1>{elem.choice}</h1>
                        <Button variant="outlined">Select</Button>
                     </Grid>
                ))}
            </Grid>
            <Grid item xs={12}>
            <div class="c"> <Button variant="disabled">Remaining time to show the results</Button> </div>
            </Grid>
            
        </div>
    )
}