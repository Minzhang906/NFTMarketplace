const Decentratwitter = artifacts.require('./Decentratwitter.sol');
const  {expect,assert,use} = require('chai');
const should = require('chai').should();
const {solidity} =require('ethereum-waffle');
const BN = require('bn.js');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);

use(solidity);
use(require('chai-bn')(BN));
contract('Decentratwitter Mint successfully',([deployer,user1,user2,...users]) => {

    let URI = "SampleURI";
    let postHash = "SampleHash";

    describe("Mint successfully", async () => {
        let decentratwitter;
        beforeEach(async  () => {
            decentratwitter = await Decentratwitter.deployed();
            await decentratwitter.mint(URI,{from: user1})
        })
        it("User1 first time mint",async () =>{
            let tokenCount = await decentratwitter.tokenCount();
            let balanceOfUser = await  decentratwitter.balanceOf(user1);
            let uri = await decentratwitter.tokenURI(1);
            expect(tokenCount.toNumber()).to.equal(1);
            expect(balanceOfUser.toNumber()).to.equal(1);
            expect(uri).to.equal(URI)
        })
    })
})