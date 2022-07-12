const Decentratwitter = artifacts.require('./Decentratwitter.sol');
const  {expect,assert,use} = require('chai');
const should = require('chai').should();
const {solidity} =require('ethereum-waffle');
const BN = require('bn.js');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);

use(solidity);
use(require('chai-bn')(BN));
contract('Decentratwitter Setting profiles',([deployer,user1,user2,...users]) => {

    let URI = "SampleURI";
    let postHash = "SampleHash";

    describe("Setting profiles", async () => {
        let decentratwitter;
        beforeEach(async  () => {
            decentratwitter = await Decentratwitter.deployed();
            await decentratwitter.mint(URI,{from: user1})
        })
        it("Should allow users to select which NFT they own to represent their profile", async () => {
            let currentTokenId1 = await decentratwitter.profiles(user1);
            expect(currentTokenId1.toNumber()).to.equal(1);
            //await decentratwitter.setProfile(1,{from:user1});
           // let currentTokenId2 = await decentratwitter.profiles(user1);
            //expect(currentTokenId2.toNumber()).to.equal(1);
            await  expect(decentratwitter.setProfile(1,{from:user2})).to.be.revertedWith("Must own the nft you want to select as your profile");
        });
    });
})
