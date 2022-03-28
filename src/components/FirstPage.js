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
import { useEffect, useState } from "react";
// import {
// 	UBCTokenContract,
// 	connectWallet,
// 	transferToken,
// 	loadTokenName,
// 	loadTokenAccountBalance,
// 	getCurrentWalletConnected,
// } from "./interact.js";
import {
  helloWorldContract,
  connectWallet,
  updateMessage,
  loadTokenName,
  loadCurrentMessage,
  loadTokenAccountBalance,
  getCurrentWalletConnected,
} from "../util/interact.js";
import { FirstPage } from '@mui/icons-material';

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

function continueWithName(){
  location.href = "http://localhost:3000/PollFeature";
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
  const [walletAddress, setWallet] = useState("");
	const [status, setStatus] = useState("");

	const [tokenName, setTokenName] = useState("No connection to the network."); //default tokenName
	const [tokenBalance, settokenBalance] = useState(
		"No connection to the network."
	);

	const [toAddress, setToAddress] = useState("");

	//called only once
	useEffect(() => {
		async function fetchData() {
			if (walletAddress !== "") {
				const tokenBalance = await loadTokenAccountBalance(walletAddress);
				settokenBalance(tokenBalance);
			}
			const tokenName = await loadTokenName();
			setTokenName(tokenName);
			const { address, status } = await getCurrentWalletConnected();
			setWallet(address);
			setStatus(status);
			addWalletListener();
			// addSmartContractListener();
		}
		fetchData();
	}, [walletAddress, tokenBalance]);

  // function addSmartContractListener() {
	// 	UBCTokenContract.events.Transfer({}, (error, data) => {
	// 		console.log(data);
	// 		if (error) {
	// 			setStatus("😥 " + error.message);
	// 		} else {
	// 			setToAddress("");
	// 			setStatus("token transfer completed");
	// 		}
	// 	});
	// }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    sendWalletAddress();
  };

  function sendWalletAddress(){
    localStorage.setItem("walletAddress", walletAddress);
  };

  
  const onUpdatePressed = async () => {
    const { status } = await transferToken(walletAddress, toAddress);
    setStatus(status);
  };

  function aboutClick(){
    console.log("clicked about")
    location.href = "https://github.com/taichenl/571G_proj/blob/main/README.md";
    
  }
  
  function featureClick(){
    console.log("feature click");
    console.log(walletAddress);
    sendWalletAddress();
  }


	function addWalletListener() {
		if (window.ethereum) {
			window.ethereum.on("accountsChanged", (accounts) => {
				if (accounts.length > 0) {
					setWallet(accounts[0]);
					setStatus(
						"👆🏽 input the transfer to addresst in the text-field above."
					);
				} else {
					setWallet("");
					setStatus("🦊 Connect to Metamask using the top right button.");
				}
			});
		} else {
			setStatus(
				<p>
					{" "}
					🦊{" "}
					<a target="_blank" href={`https://metamask.io/download.html`}>
						You must install Metamask, a virtual Ethereum wallet, in your
						browser.
					</a>
				</p>
			);
		}
	}



  return (
    <React.Fragment>
      <CssBaseline />
      <Typography variant="h6" color="inherit" align='right'>
          <Button variant='contained' onClick={aboutClick}>About</Button>
          <Button variant='contained' color="secondary" onClick={featureClick}>Feature</Button>
      </Typography>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
              <button id="walletButton" onClick={connectWalletPressed}>
              {walletAddress.length > 0 ? (
                "Connected: " +
                String(walletAddress).substring(0, 6) +
                "..." +
                String(walletAddress).substring(38)
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>
            <br></br>
            <br></br>
            <br></br>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Secure Blockchain-based Voting and Elections Application
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Create an event for your school or organization in seconds, your voters can vote as long as a gas fee is paid.
            </Typography>
            <div className={classes.heroButtons}>
              <h1 align = "center"> <TextField id="filled-basic" label="What's your name?" variant="filled" /> </h1>
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={continueWithName}>
                    Continue
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