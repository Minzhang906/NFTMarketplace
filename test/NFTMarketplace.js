const Marketplace = artifacts.require('./Marketplace.sol');
const Decentratwitter = artifacts.require('./Decentratwitter.sol');
const  {expect,assert,use} = require('chai');
const should = require('chai').should();
const {solidity} =require('ethereum-waffle');
const BN = require('bn.js');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);
const {ethers} = require('ethers');

use(solidity);
use(require('chai-bn')(BN));

contract('Marketplace',([deployer,user1,user2,...users]) => {

    let addr1;
    let addr2;
    let addrs;
    let feePercent = 200;
    let URI = "sample URI";
    let nft;
    let marketplace;

    describe('Deployment',async () => {
        beforeEach(async  () => {
            marketplace = await Marketplace.deployed();
        })
        it("Should  track feeAccount and feePercent of the marketplace", async () => {
            let actual = new BN(feePercent);
            let b = await marketplace.feePercent();
            expect(await marketplace.feeAccount()).to.equal(deployer);
            actual.should.be.a.bignumber.that.equals(b);
        })
    });
    describe("Making marketplace tiems", () =>{
        let price = 1;
        let result;
        let OfferedEvent;
        let makeItemResult;
        let itemCount;
        before(async () => {
            nft = await Decentratwitter.deployed();
            await nft.mint(URI,{from:user1});
            await nft.setApprovalForAll(marketplace.address,true,{from:user1});
            makeItemResult = await marketplace.makeItem(nft.address,1,price,{from:user1});
        });
        it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async () => {
            itemCount = await marketplace.itemCount();
            OfferedEvent = makeItemResult.logs[0].args;
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            expect(itemCount.toNumber()).to.equal(1);
            expect(OfferedEvent.itemId.toNumber()).to.equal(1);
            expect(OfferedEvent.nft).to.equal(nft.address);
            (new BN(1)).should.be.a.bignumber.that.equals(OfferedEvent.tokenId);
            expect(OfferedEvent.price.toNumber()).to.equal(1);
            expect(OfferedEvent.seller).to.equal(user1);
            const item = await marketplace.items(1);
            expect(item.itemId.toNumber()).to.equal(1);
            expect(item.nft).to.equal(nft.address);
            (new BN(1)).should.be.a.bignumber.that.equals(item.tokenId);
            expect(item.price.toNumber()).to.equal(1);
            expect(item.sold).to.equal(false)
        });

        it("Should fail if price is set to zero", async () => {
            await expect(marketplace.makeItem(nft.address,1,0,{from:user1})).to.be.revertedWith("Price must be greater than zero");
        });

    });
    describe("Purchasing marketplace items", () => {
        let price = '2';
        let fee = (feePercent/100) * price;
        let totalPriceInWei;
        let tokenId;
        before(async () => {
            await nft.mint(URI,{from:user1});
            tokenId = await nft.tokenCount();
            await nft.setApprovalForAll(marketplace.address,true,{from:user1});
        });
        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async () => {
            await marketplace.makeItem(nft.address,tokenId,web3.utils.toWei(price),{from:user1});
            const sellerInitialEthBal = await web3.eth.getBalance(user1);
            const feeAccountInitialEthBal = await web3.eth.getBalance(deployer);
            totalPrice = await marketplace.getTotalPrice(tokenId);
            totalPriceInWei = web3.utils.toWei(totalPrice.toString());
            const puchaseResult = await marketplace.purchaseItem(tokenId,{from:user2,value:totalPrice});
            const boughtEvent = puchaseResult.logs[0].args;

            const sellerFinalEthBal = await web3.eth.getBalance(user1);
            const feeAccountFinalEthBal = await web3.eth.getBalance(deployer);
            const expectBN = (new BN(sellerInitialEthBal)).add(new BN(web3.utils.toWei(price)));
            const actualBN = new BN(sellerFinalEthBal);


            actualBN.should.be.a.bignumber.that.equals(expectBN);
            expect((await marketplace.items(tokenId)).sold).to.equal(true);
            expect(await nft.ownerOf(tokenId)).to.equal(user2);

            //test event
            console.log(boughtEvent.itemId,boughtEvent.tokenId)
            expect(boughtEvent.buyer).to.equal(user2);

            //await expect(marketplace.purchaseItem(tokenId,{from:users[0],value:totalPrice})).to.be.revertedWith("Item already sold");
            await expect(marketplace.purchaseItem(tokenId,{from:users[0],value:totalPrice})).to.be.revertedWith("item already sold");
        })
    });
})