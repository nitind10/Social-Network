import React, { Component } from 'react';
import Web3 from 'web3'; //to connect this app.js with blockchain
import logo from '../logo.png';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
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

    //want to talk to smart contract using webjs to get an instance of smart contract
    //network id
    const networkId = await web3Instance.eth.net.getId()
    /*console.log(networkId) got network id from brower console, it is 5777(also availabe in SocialNetwork.json file at line 4123)*/
    const networkData = SocialNetwork.networks[networkId]

    if(networkData) {
      //console.log(networkId) used this just to display network id
      const socialNetwork = web3Instance.eth.Contract(SocialNetwork.abi, networkData.address)
      //console.log(socialNetwork) to display contract details in console
      this.setState({socialNetwork: socialNetwork})
      /*there are two types of methods in web3: call methods and send methods. call methods read info from blockchain, so dont cost any gas
      but send methods cost gas, they write data to the chain, so we need to sign this transactions using account*/
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({postCount: postCount})
      console.log(postCount)
      /*we need this post count so that we can loop through posts to list them*/
      //LOAD POSTS
      for(var i = 1; i<=postCount; ++i) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          /*instead of updating the actual array, we wanna use the es6 spread operator. this just creates a new array and
           uses the old posts and adds the new post to the end of the array*/
          posts: [...this.state.posts, post] 
        })
      }
      //console.log({posts: this.state.posts}) //will list post in console

    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')//will get this popup error if we change network from metamask
    }

    
  }

  //using state of component
  constructor(props) {
    super(props)
    this.state = {
      account: '' ,
      socialNetwork: null ,
      postCount: 0,
      posts: []
    }
  }


  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>  {/*rendering the Navbar component, passing the state component as, without passing it wont be accesible to Navbar.js*/}
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px'}}>
              <div className="content mr-auto ml-auto">
               {/*Looping through all posts*/} 
               {/*key is index, we need this to tell react that
               each element it renders out to the page is unique*/}
               { this.state.posts.map((post, key) => {
                  return(
                    <div className="card mb-4" key={key} >
                     <div className="card-header">
                       <small className="text-muted">{post.author}</small>
                     </div>
                     <ul id="postList" className="list-group list-group-flush">
                       <li className="list-group-item">
                         <p>{post.content}</p>
                       </li>
                       <li key={key} className="list-group-item py-2">
                         <small className="float-left mt-1 text-muted">
                           TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                         </small>
                         <button className="btn btn-link btn-sm float-right pt-0">
                           <span>
                             TIP 0.1 ETH
                           </span>
                         </button>
                       </li>
                     </ul>
                    </div>
                  )
               })}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
