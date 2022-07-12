const Decentratwitter = artifacts.require('./Decentratwitter.sol');
const  {expect,assert,use} = require('chai');
const should = require('chai').should();
const {solidity} =require('ethereum-waffle');
const BN = require('bn.js');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);

use(solidity);
use(require('chai-bn')(BN));
contract('Decentratwitter Getter',([deployer,user1,user2,user3,user4,...users]) => {

    let URI = "SampleURI";
    let postHash = "SampleHash";

    describe("Getter functions", async () => {
        //let ownedByUser1 = [1,2];
        //let ownedByUser2 = [3];
        let decentratwitter;
        before(async () => {
            decentratwitter = await Decentratwitter.deployed();
            let tokenCount = await decentratwitter.tokenCount();
            console.log(tokenCount);
            await decentratwitter.mint(URI,{from:user3});
            await decentratwitter.uploadPost(postHash,{from:user3});
            await decentratwitter.mint(URI,{from:user3});
            await decentratwitter.mint(URI,{from:user4});
            await decentratwitter.uploadPost(postHash,{from:user4});

            console.log(tokenCount)
        })
        it('Should get all posts ', async () => {
            const allPosts = await decentratwitter.getAllPosts();
            expect(allPosts.length).to.equal(2);
        });

        it("Get users' own NFT", async () => {
            let tokenCount = await decentratwitter.tokenCount();
            console.log(tokenCount)
            const user3NFTs = await decentratwitter.getMyNFTs({from:user3});
            const user4NFTs = await decentratwitter.getMyNFTs({from:user4});

            expect(user3NFTs.length).to.equal(2);
            expect(user4NFTs.length).to.equal(1);
        });

    });
})