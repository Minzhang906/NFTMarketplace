// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Decentratwitter is ERC721URIStorage{
    uint256 public tokenCount;
    uint256 public postCount;
    mapping(address => uint256) public profiles;
    mapping(uint256 => Post) public posts;

    constructor() ERC721("Decentratwitter","Dapp") {}

    struct Post {
        uint256 id;
        string hash;
        uint256  tipAmount;
        address payable author;
    }

    event PostCreated(
        uint256 id,
        string hash,
        uint256 tipAmount,
        address payable author
    );
    event PostTipped(
        uint256 id,
        string hash,
        uint256 tipAmount,
        address payable author
    );

    //create a nft
    function mint(string memory _tokenURI) external returns (uint256) {
        tokenCount++;
        _safeMint(msg.sender,tokenCount);
        _setTokenURI(tokenCount,_tokenURI);
        setProfile(tokenCount);
        return(tokenCount);
    }

    function setProfile(uint256 _id) public  {
        require(ownerOf(_id) == msg.sender, "Must own the nft you want to select as your profile");
        profiles[msg.sender] = _id;
    }
    function uploadPost(string memory _postHash) external {
        require(balanceOf(msg.sender) > 0,"Must own a decentratwitter NFT to post");
        //Make sure the post hash exists
        require(bytes(_postHash).length > 0,"Cannot pass an empty hash");
        //Increment post count
        postCount++;
        posts[postCount] = Post(postCount, _postHash,0,payable(msg.sender));

        emit PostCreated(postCount, _postHash, 0, payable(msg.sender));
    }
    function tipPostOwner(uint256 _id) external payable {
        //Make sure the id is valid
        require(_id > 0 && _id <= postCount,"Invalid post id");
        //Fetch the post
        Post memory _post = posts[_id];
        require(_post.author != msg.sender,"Cannot tip your own post");
        _post.author.transfer(msg.value);
        _post.tipAmount += msg.value;
        posts[_id] = _post;
        emit PostTipped(_id,_post.hash,_post.tipAmount,_post.author);
    }
    //Functions can be declared view in which case they promise not to modify the state.
    function getAllPosts() external view returns(Post[] memory _posts){
        //Dynamic memory arrays are created using new keyword.
        _posts = new Post[](postCount);
        for(uint256 i=0; i < _posts.length; i++) {
            _posts[i] = posts[i+1];
        }
    }
    function getMyNFTs() external view returns(uint256[] memory _ids) {
        _ids = new uint256[](balanceOf(msg.sender));
        uint256 currentIndex;
        uint256 _tokenCount = tokenCount;
        for(uint256 i=0;i<_tokenCount;i++){
            if(ownerOf(i+1) == msg.sender){
                _ids[currentIndex] = i + 1;
                currentIndex++;
            }
        }
    }
}
