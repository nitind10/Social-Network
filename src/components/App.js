import React, { Component } from 'react';
import Web3 from 'web3'; //to connect this app.js with blockchain
import logo from '../logo.png';
import './App.css';
import Navbar from './Navbar'

/* This is a react component, react is a javascript component based library
which allows us write js in these reusable components
here App is a Component which mixes js with html code 
everything inside return is html that gets rendered on page using render()*/
class App extends Component {
  
  /*we want to call loadWeb3 whenever Component gets loaded so we'll use the following react function
  USE-
  whenever Component will mount to the virtual dom inside react
  we wanna call loadWeb3() and we wanna wait for it to happen before doing anything else */

  async componentWillMount() {
    await this.loadWeb3()
    //calling loadBlockchainData()
    await this.loadBlockchainData()
  }

  /*code inside loadWeb3 will take connection from metamask
  and wires it up with web3*/
  async loadWeb3() {
    /*this code is copied from metamask's article of how to do this no need to understand all it does basically is to
    look for an ethereum provider in your windows, if not found it creates new one using Web3*/
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

  }

  async loadBlockchainData() {

    /*GREGORY'S CODE
     const web3 = window.Web3                     //getting the web3 connection that we created
     const accounts = window.eth.getAccounts()    //loading accounts
     console.log(accounts)
     this.setState( {account: accounts[0]} )      //using state component
    */

    /*got this code(2 lines) from a guy in blockchain developers ind whatsapp group,
      it worked in just displaying account on console of page, not with state variable.

    const accounts = window.ethereum.selectedAddress
    console.log(accounts) */

    //this worked, (ethereum.stackexchange.com) next 4 lines
    const ethereum = window.ethereum;
    const web3Instance = new Web3(ethereum);
    var accounts = await web3Instance.eth.getAccounts()
    console.log(accounts)

    //we fetched array of accounts, currently need 1st element of it (i.e our current metamask connected account)
    this.setState( {account: accounts[0]} )
    //now we'll have access to the account with the state object throughout the component, can aloso pass it down to other components
  }

  //using state of component
  constructor(props) {
    super(props)
    this.state = {
      account: ''
    }
  }


  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>  /*rendering the Navbar component, passing the state component as, without passing it wont be accesible to Navbar.js*/
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
