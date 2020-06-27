//importing the smartcontract
const SocialNetwork = artifacts.require('./SocialNetwork.sol')

/*used as we need chai library for assertions
already installed as it was in package.json*/

require('chai')
  .use(require('chai-as-promised'))
  .should()

/*now we'll create the skeleton for our tests 
the second parameter of contract is basically a call back function

A callback function is a function passed into another function as an 
argument, which is then invoked inside the outer function to complete 
some kind of routine or action.

callback fuction has a variable which contains all the accounts
provided to us by ganache, i.e it'll be an array. we can use 
these accounts as examples inside the tests
*/

//we created array of 3 different possible accounts i.e deployer of contract, author of post, tipper of post
contract('SocialNetwork', ([deployer, author, tipper]) => {

	//socialNetwork is here a variable that represents the deployed contract
	let socialNetwork //notice s is lowercase, so diffrent to SocialNetwork

    //used this fn so that we dont have to use the inside statement again and again
    before(async () => {
        socialNetwork = await SocialNetwork.deployed()
    })//end of before()

	/*basic test to check if contract is deployed or not
	for this we can use the address we got in console and check if it exists
	we have put async keyword becuase await keyword can be called in side an asynchronus function
	hence the asyn await pattern. we didnt have to use it in console because there it works natively
	*/
	describe('deployment', async () => {

		it('deploys successfully', async () => {
			//socialNetwork = await SocialNetwork.deployed() //removed after adding before() fn
			const address = await socialNetwork.address
			assert.notEqual(address,'0x0')//shpuldnt be 0 or shouldnt be blank
			assert.notEqual(address,'')//shouldnt be an empty string
			assert.notEqual(address,'null')//shouldnt be null
			assert.notEqual(address,'undefined')//shouldnt be undefined
		})//end of it

		it('has a name', async () => {
            //socialNetwork = await SocialNetwork.deployed()
			const name = await socialNetwork.name()
            assert.equal(name,'Nitin\'s Social Network')
		})//end of it

	})//end of describe()

	/*we want our smart contract to 
	1. create posts
	2. lists posts
	3. tip posts
	so we'll write tests for these too */

    describe('posts', async () => {
    	let result, postCount

    	before(async () => {
    		/*we have passed the content but swe also need msg.sender in solidity
            i.e who is the author, for this we need function metadata since we are working with javascript
            we pass function metadata after the regular agruments */
    		result = await socialNetwork.createPost('Post1 issa vibe', {from: author })
   			postCount = await socialNetwork.postCount()
    	})

    	it('create posts', async () => {
            
   			//SUCCESS (post count increment verification)
   			assert.equal(postCount,1)

   			//post data/content verification

   			/*explanation
   			first we log out the result, that contains info of event
   			that'll allow us to verify data from the posts 
   			for this we type only console.log(result) (not the next 5 lines)
   			and run test. we can see structure of result on terminal inspect it and
   			see info which we wanna pull out of result (bcoz of this we could write the code lines)
   			logs: will contain our created event
   			after const event = result.logs[0].args if we type console.log(event) and run
   			we can see data of event, after that we use assertions*/
   			const event = result.logs[0].args
   			assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
   			assert.equal(event.content, 'Post1 issa vibe', 'content is correct')
   			assert.equal(event.tipAmount,'0', 'tip ammount is correct')
   			assert.equal(event.author, author, 'author is correct')

   			//FAILURE: post must have content
   			await socialNetwork.createPost('', {from: author }).should.be.rejected;
    	})//it ends


    	it('lists posts', async () => {
    		/*here we are fetching a particular post, we can check
    		all posts when building client side application using loop
    		we cant do it here because in solidity we cant know how big
    		the mapping is and cant iterate over it*/
    		const post = await socialNetwork.posts(postCount)
    		assert.equal(post.id.toNumber(),postCount.toNumber(),'id is correct')
   			assert.equal(post.content, 'Post1 issa vibe', 'content is correct')
   			assert.equal(post.tipAmount,'0', 'tip ammount is correct')
   			assert.equal(post.author, author, 'author is correct')
    	})//it ends


    	it('allows users to tip posts', async () => {                      
    		
    		//track the author balance before getting tipped
   			let oldAuthorBalance
   			oldAuthorBalance = await web3.eth.getBalance(author) //retrieving balance
   			oldAuthorBalance = new web3.utils.BN(oldAuthorBalance) //converting it to big number

   																				  //helps to convert ether to wei, library already installed
    		result = await socialNetwork.tipPost(postCount, {from: tipper, value: web3.utils.toWei('1', 'Ether')} )
    		//SUCCESSs
    		const event = result.logs[0].args
   			assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
   			assert.equal(event.content, 'Post1 issa vibe', 'content is correct')
   			assert.equal(event.tipAmount,'1000000000000000000', 'tip ammount is correct')
   			assert.equal(event.author, author, 'author is correct')

   			//check that the author recieved funds
   			let newAuthorBalance
   			newAuthorBalance = await web3.eth.getBalance(author) //retrieving balance
   			newAuthorBalance = new web3.utils.BN(newAuthorBalance) //converting it to big number

   			let tipAmount
   			tipAmount = web3.utils.toWei('1', 'Ether')
   			tipAmount = new web3.utils.BN(tipAmount)

   			const expectedBalance = oldAuthorBalance.add(tipAmount)

   			assert.equal(newAuthorBalance.toString(), expectedBalance.toString()) //converted to string for comparison

   			//FAILURE: tries to tip a post that doesn't exist
			await socialNetwork.tipPost(99, {from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected; 
			  			
    	})//it ends

    })//end of describe

})//end of contract()