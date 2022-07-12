const Decentratwitter = artifacts.require('./Decentratwitter.sol');
const  {expect,assert,use} = require('chai');
const should = require('chai').should();
const {solidity} =require('ethereum-waffle');
const BN = require('bn.js');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);

use(solidity);
use(require('chai-bn')(BN));
contract('Decentratwitter',([deployer,user1,user2,...users]) => {

    let URI = "SampleURI";
    let postHash = "SampleHash";

    describe('Deployment',async () => {
        let decentratwitter;
        beforeEach(async  () => {
            decentratwitter = await Decentratwitter.deployed();
            //await decentratwitter.mint(URI,{from: user1})
            //console.log(await decentratwitter.tokenCount())
        })
        it("Should  track namd and symbol", async () => {
            const nftName = "Decentratwitter";
            const nftSymbol = "Dapp";

            expect(await decentratwitter.name()).to.equal(nftName);
            expect(await decentratwitter.symbol()).to.equal(nftSymbol);
        })
        it("Deploys successfully", async () => {
            const address = await decentratwitter.address;
            expect(address).not.equal(0x0);
            expect(address).not.equal('');
            expect(address).not.equal(null);
            expect(address).not.equal(undefined);
        })
    })













})
