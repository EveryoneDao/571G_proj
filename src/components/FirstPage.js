import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
// import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { TextField } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/taichenl/571G_proj">
        Our EECE 571G Github Page
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function Voting_choice() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
          <Button variant='contained'>About</Button>
          <Button variant='contained' color="secondary">Feature</Button>
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Typography variant="h6" color="inherit" align='right'>
          <Button variant='contained'>About</Button>
          <Button variant='contained' color="secondary">Feature</Button>
      </Typography>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Secure Blockchain-based Voting and Elections Application
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Create an event for your school or organization in seconds, your voters can vote as long as a gas fee is paid.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Start as an organizer
                  </Button>
                </Grid>
              </Grid>
              <h1 align = "center"> <TextField id="filled-basic" label="8 digit event ID" variant="filled" /> </h1>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Join an existing event
                  </Button>
                </Grid>
            </Grid>
            </div>
          </Container>
        </div>
        
      </main>

    </React.Fragment>
  );
}