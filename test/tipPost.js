const Decentratwitter = artifacts.require('./Decentratwitter.sol');
const  {expect,assert,use} = require('chai');
const should = require('chai').should();
const {solidity} =require('ethereum-waffle');
const BN = require('bn.js');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);

use(solidity);
use(require('chai-bn')(BN));
contract('Decentratwitter Tip posts',([deployer,user1,user2,...users]) => {

    let URI = "SampleURI";
    let postHash = "SampleHash";

    describe("Tip posts", async  () => {
        let  tipPostResult,post,tipAmount,initialAuthorBalance,decentratwitter;
        beforeEach(async () => {
            decentratwitter = await Decentratwitter.deployed();
            await decentratwitter.mint(URI,{from: user1})
            await decentratwitter.uploadPost(postHash,{from:user1});
            initialAuthorBalance = await web3.eth.getBalance(user1);
            tipAmount = await web3.utils.toWei("1","ether");
            tipPostResult = await decentratwitter.tipPostOwner(1,{from:user2,value: tipAmount});
            post = await decentratwitter.posts(1);
        })

        it("Should allow users to tip posts and track each posts tip amount", async () => {
            //user1 uploads a post
            //Track user1 balance before their post gets tipped
            const initialAuthorBalanceBN = new BN(initialAuthorBalance);
            const tipAmountBN = new BN(tipAmount);

            (post.tipAmount).should.be.a.bignumber.that.equals(web3.utils.toBN(tipAmount))
            let finalAuthorBalance = await web3.eth.getBalance(user1);
            (new BN(finalAuthorBalance)).should.be.a.bignumber.that.equals(initialAuthorBalanceBN.add(tipAmountBN))

            await expect(decentratwitter.tipPostOwner(4,{from:user2,value: tipAmount})).to.be.revertedWith("Invalid post id");
            await expect(decentratwitter.tipPostOwner(1,{from:user1,value:tipAmount})).to.be.revertedWith("Cannot tip your own post");
        });
    });
})