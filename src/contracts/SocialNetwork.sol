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
		address author;//author of the post, will obviously be an ethereum account holder
	}

	event PostCreated(
		uint id,
		string content,
		uint tipAmount,
		address author
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

    
}