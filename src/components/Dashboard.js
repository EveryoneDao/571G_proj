import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Card, CardContent, Typography, CardHeader } from '@material-ui/core/'
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import "./index.css";
const useStyles = makeStyles(theme => ({
    largeIcon: {
        '& svg': {
            fontSize: 60
          }
    },
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    }
}))

export default function Dashboard() {
    const classes = useStyles()
    const data = [
        { pollNumber: 1, participants: 13000 },
        { pollNumber: 2, participants: 16500 },
        { pollNumber: 3, participants: 14250 },
        { pollNumber: 4, participants: 19000 }
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
                 <Grid item xs={12}>
                 <div class="c">
                <IconButton className={classes.largeIcon} aria-label="add" color="primary" onClick={() =>{ alert("✔️ This works on every component!"); }}>
                    
                    <AddCircleIcon fontSize="large" />
                </IconButton>
                </div>
                     </Grid>
                {data.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={data.indexOf(elem)}>
                        <Card>
                            <CardHeader
                                title={`Poll : ${elem.pollNumber}`}
                                subheader={`Participants Number : ${elem.participants}`}
                            />
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Hello World
                                </Typography>
                            </CardContent>
                            <CardActions> 
                                <Button size="small">Join</Button> 
                            </CardActions>
                        </Card>
                     </Grid>
                ))}
            </Grid>
        </div>
    )
}