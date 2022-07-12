const Decentratwitter = artifacts.require('./Decentratwitter.sol');
const  {expect,assert,use} = require('chai');
const should = require('chai').should();
const {solidity} =require('ethereum-waffle');
const BN = require('bn.js');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);

use(solidity);
use(require('chai-bn')(BN));
contract('Decentratwitter Uploading posts',([deployer,user1,user2,...users]) => {

    let URI = "SampleURI";
    let postHash = "SampleHash";

    describe("Uploading posts", async () => {

        let  uploadPostResult, postCount;
        let decentratwitter;
        before(async () => {
            decentratwitter = await Decentratwitter.deployed();
            await decentratwitter.mint(URI,{from: user1})
            uploadPostResult = await decentratwitter.uploadPost(postHash,{from:user1});
            postCount = await decentratwitter.postCount();
        })

        it("Emit Events", async function() {
            expect(postCount.toNumber()).to.equal(1);
            const event = uploadPostResult.logs[0].args;
            assert.equal(event.id.toNumber(),postCount.toNumber(), "Event ID is correct");
            assert.equal(event.hash,"SampleHash","Event Hash is right");
            assert.equal(event.tipAmount,0,"Event Hash is right");
            assert.equal(event.author,user1,"Event author is right");

            await expect(decentratwitter.uploadPost(postHash,{from:user2})).to.be.revertedWith("Must own a decentratwitter NFT to post");
            await expect(decentratwitter.uploadPost("",{from:user1})).to.be.revertedWith("Cannot pass an empty hash");
        })
    });
})