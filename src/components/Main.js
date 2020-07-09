/*react components can render other react comopnents
as component in app.js was getting bigger, so we 
created a different component to put the code of Navbar */

import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

	render() {
		return (
			<div className="container-fluid mt-5">
          <div className="row">
            {/*  <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px'}}> */}
              {/*<div className="content mr-auto ml-auto">*/}
                {/*<p>&nbsp;</p> non breaking space*/}
                {/*we need to call createPost() whenever we submit a post, for that we'll use on-submit handler we can listen to events inside react by doing: */}
                {/* event.preventDefault() this will keep it from reloading the page*/}
                {/*using refs of react to access input content of form*/}

                <div className="col-lg-5" id="shareSection">
                  
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  
                  <div className="card" id="shareSectionCard">
                    <h4>Create Your Posts Here!</h4>
                    <p>&nbsp;</p>
                    <img classname="card-img-top" src="https://images.unsplash.com/photo-1505744386214-51dba16a26fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="Card image cap"></img>
                    <div className="card-body">
                    
                    <form onSubmit={(event) => {
                      event.preventDefault()        
                      const content = this.postContent.value
                      this.props.createPost(content)
                    }}>
                      
                      <div className="form-group mr-sm-2">
                        <input
                          id="postContent"
                          type="text"
                          ref={(input) => { this.postContent = input }}
                          className="form-control"
                          placeholder="What's on your mind?"
                          required 
                        />
                      </div>
                      <button type ="submit" className="btn btn-primary btn-block">Share</button>
                    </form>
                    </div>
                  </div>
                </div>

                {/*<p>&nbsp;</p>*/}
               {/*Looping through all posts*/} 
               {/*key is index, we need this to tell react that
               each element it renders out to the page is unique*/}

               <div className="col-lg-7" id="postsSection">
                <h4>Posts on the Network!</h4>
                <p>&nbsp;</p>
                 { this.props.posts.map((post, key) => {
                    return(
                      <div className="card mb-4" id="postsSectionCard" key={key} >
                       <div className="card-header">
                         <img 
                           className='mr-2'
                           width='30'
                           height='30'
                           src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                         />
                         <small>{post.author}</small>
                       </div>
                       <ul id="postList" className="list-group list-group-flush">
                         <li className="list-group-item">
                           <p>{post.content}</p>
                         </li>
                         <li key={key} className="list-group-item py-2">
                           <small className="float-left mt-1">
                             TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                           </small>
                            {/*event.target.name is tip amount fetch by event, with the help of name of button*/}
                           <button 
                              className="btn btn-success btn-sm float-right pt-0"
                              name={post.id}
                              onClick={(event) => {
                                let tipAmount = window.web3.utils.toWei('0.1','Ether')
                                this.props.tipPost(event.target.name, tipAmount)
                              }}
                              >
                               TIP 0.1 ETH
                           </button>
                         </li>
                       </ul>
                      </div>
                    )
                 })}
               </div>
              {/*</div>*/}
            {/*</main>*/}
          </div>
      </div>
		);
	}
}

export default Main;
