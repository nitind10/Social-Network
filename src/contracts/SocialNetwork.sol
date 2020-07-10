pragma solidity ^0.5.0;

contract SocialNetwork {

	//here name is state variable i.e it will exist on blockchain
	string public name;
	uint public postCount = 0;

	//refer to comment in createPost fn for mapping info
	//uint is key (id of post), Post is the value which is a structure in itself
	//public so that we get a readers fn, i.e we can pull this info outta here like name
	//example we can have a post function which returns post of a given id
	mapping(uint => Post) public posts;

	struct Post {
		//uint is unsigned int i.e cant be negative
		uint id;//unique id of a post in the database
		string content;//for storing value of _content
		uint tipAmount;//amount of tip someone can give(updatable)
		address payable author;//author of the post, will obviously be an ethereum account holder
	}

	event PostCreated(
		uint id,
		string content,
		uint tipAmount,
		address payable author
		);
	event PostTipped(
		uint id,
		string content,
		uint tipAmount,
		address payable author
		);

    constructor() public {
		name = "Nitin's Social Network";
	}

	// starting name of local varibales with _ is convention
    function createPost(string memory _content) public {

    	/*structure of how to call Post: Post(id_of_post,_content,tip,author_address);
        example: Post(1,_content,0,msg.sender); //msg.sender is the adsress of account who call createPost function
        now this will just create a post, now how do we store it on the blockchain?
        with the help of mappings
        mapping is a key-value store that writes information to the blockchain itself
        it kindof gonna help us treat the smart contract as a database with the blockchain */

        //Require valid content
    	/*require() fn in solidity: if require(true); then remaing following
    	code will execute but if require(false) the remaing fn code (in which require() is present)
    	will not execute and gas required to call the fn in which require turns out
    	to be false, will be refunded back to the caller */
    	require(bytes(_content).length > 0);
        

        //putting created post in the mapping

        //incrementing post count
        postCount++;
        //create the posts
        posts[postCount] = Post(postCount, _content, 0, msg.sender);

        //trigger Event (bacially to verify post data)
        emit PostCreated(postCount, _content, 0, msg.sender); 
    }

    function tipPost(uint _id) public payable { //public like other because we want to call it from tests and client side too 
    	//make sure id is valid
    	require(_id > 0 && _id <= postCount);

    	//1. fetch the posts  					 // payable will allow sender to send ether
    	//creating copy of post, so that it wont affect the post on blockchain, untill we reassing it later
    	Post memory _post = posts[_id];
    	//2. fetch the author
    	address payable _author = _post.author;
        if(_author==msg.sender)
            revert();
    	//3. pay the author by sending ether
    	address(_author).transfer(msg.value); //msg.value is amount in wei, 1ether = 10^18 wei
    	//4. increment tip amount
    	_post.tipAmount = _post.tipAmount + msg.value; //msg.value gives the amount of ether sent-in
    	//5. update the post on blockchain
    	posts[_id] = _post;
    	//6. trigger an event
    	emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }  
}