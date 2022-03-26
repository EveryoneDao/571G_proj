import React from "react";
import { useEffect, useState } from "react";
import {
  helloWorldContract,
  connectWallet,
  updateMessage,
  loadCurrentMessage,
  getCurrentWalletConnected,
} from "./util/interact.js";

import alchemylogo from "./alchemylogo.svg";

const HelloWorld = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); //default message
  const [newMessage, setNewMessage] = useState("");

  //called only once
  useEffect(async () => {
    
  }, []);

  function addSmartContractListener() { //TODO: implement
    
  }

  function addWalletListener() { //TODO: implement
    
  }

  const connectWalletPressed = async () => { //TODO: implement
    
  };

  const onUpdatePressed = async () => { //TODO: implement
    
  };

  const onRouteChange = async () => { //TODO: implement
    
  };

  function inputUserName(){
    console.log("clicked conutinue with name")
  }

  
  //the UI of our component
  return (

    <div id="container">
      {/* <img id="logo" src={alchemylogo}></img> */}
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


      <h2 align = "center" style={{ paddingTop: "18px" }}>Hi, What's your name?</h2>

      <div>
        <input
          type="text"
          placeholder="Input your name"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <p id="status">{status}</p>

        <h2 align = "center"><button  id = "InputName" onClick = {inputUserName}>Continue</button> </h2>
      </div>

      {/* <div>
        <button variant='contained' color="secondary" onClick={aboutClick}> About</button>
      </div> */}
    </div>
    
  );
};

export default HelloWorld;
