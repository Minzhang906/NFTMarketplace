import React, {useEffect,useState} from 'react';
import Web3 from 'web3';
//import logo from './logo.svg';
import logo from './metamask.png';
import  {Counter} from './features/counter/Counter';
import Decentratwitter from './build/Decentratwitter.json';
import Marketplce from './build/Marketplace.json';
//import {AnotherAccount} from './features/counter/AnotherAccount'
import './App.css';
//import * as net from "net";
import {Link, BrowserRouter,Routes,Route} from "react-router-dom";
import {ethers} from "ethers";
import {Spinner,Navbar,Nav,Button,Container} from 'react-bootstrap';
import Home from './Home';
import Profile from './Profile';
import Create from './Create';
import MyListItems from "./MyListItems";
import BuyNFT from "./BuyNFT";
import MyNFT from "./MyNFT";

function App() {

    const [loading,setLoading] = useState(true);
    const [account,setAccount] = useState(null);
    const [contract,setContract] = useState({ });
    const [marketplace,setMarketplce] = useState({});

    let web3; //provider
    let signer;
    async function web3Handler(){

        if(window.ethereum){
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            })
            window.ethereum.on('accountsChanged', async () => {
                setLoading(true);
                web3Handler();
            })
            web3 = new Web3(window.ethereum);
            let accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            // Get signer
            const signer = provider.getSigner();
            const blockNumber = await provider.getBlockNumber();
            const signerAddress = await signer.getAddress();
            loadContract(signer);
            console.log(signerAddress);
            console.log(signer);
            //console.log(account);
            //console.log(accounts[0]);
        } else{
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask')
        }

        //loadContract(account);
        //console.log(signer);
        //console.log(web3);
    }

    async function loadContract(signer) {
        const networkId = await  web3.eth.net.getId();
        const networkData = Decentratwitter.networks[networkId];
        const networkDataMarketplace = Marketplce.networks[networkId];
        const contract = new ethers.Contract(networkData.address,Decentratwitter.abi,signer);
        const marketplace = new ethers.Contract(networkDataMarketplace.address,Marketplce.abi,signer);
        //console.log(contract1);
        setContract(contract);
        setMarketplce(marketplace);
        setLoading(false);
    }

  return (
      <BrowserRouter>
          <div className="App">
              <>
                  <Navbar>
                      <Container>
                          <Navbar.Brand href="http://www.dappuniversity.com/bootcamp">
                              <img src={logo}  width="40" height="40" className="" alt=""/>
                              <h2>Decentratwitter</h2>
                          </Navbar.Brand>
                          <Navbar.Collapse id = "responsive-navbar-nav">
                              <Nav className="me-auto">
                                  <Nav.Link  as={Link} to="/">Home</Nav.Link>
                                  <br/>
                                  <Nav.Link  as={Link} to="/profile">Profile</Nav.Link>
                                  <br/>
                                  <Nav.Link  as={Link} to="/create">Create NFT</Nav.Link>
                                  <br/>
                                  <Nav.Link  as={Link} to="/listedINFT">My List NFT</Nav.Link>
                                  <br/>
                                  <Nav.Link  as={Link} to="/purchaseNFT">NFT Marketplace</Nav.Link>
                                  <br/>
                                  <Nav.Link  as={Link} to="/ownedNFT">Owned NFTs</Nav.Link>
                              </Nav>
                              <Nav>
                                  {
                                      account ? (
                                          <Nav.Link
                                              href={`https://etherscan.io/address/${account}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="button nav-button btn-sm mx-4"
                                          >
                                              <br/>
                                              <Button variant="outline-light">
                                                  {account.slice(0,5) + '...'+ account.slice(38,42)}
                                              </Button>
                                          </Nav.Link>
                                      ) : (
                                          <div>
                                              <br/>
                                              <Button  onClick={web3Handler} variant="secondary">Connect Wallet</Button>
                                          </div>

                                      )
                                  }
                              </Nav>
                          </Navbar.Collapse>
                      </Container>
                  </Navbar>
              </>
              <div>
                  {loading ? (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                          <Spinner animation="border" style={{ display: 'flex' }} />
                          <p className='mx-3 my-0'>Awaiting Metamask Connection......</p>
                      </div>
                  ):(
                      <Routes>
                          <Route exact path="/" element={
                              <Home contract={contract} />
                          } />
                          <Route path="/profile" element={
                              <Profile contract={contract}/>
                          }/>
                          <Route path="/create" element={
                              <Create marketplace = {marketplace} nft={contract}/>
                          }/>
                          <Route path = "/listedINFT" element = {
                              <MyListItems marketplace={marketplace} nft={contract} account={account}/>
                          }/>
                          <Route path = "/purchaseNFT" element = {
                              <BuyNFT marketplace={marketplace} nft={contract}/>
                          }/>
                          <Route path = "/ownedNFT" element = {
                              <MyNFT marketplace={marketplace} nft={contract} account={account}/>
                          }/>
                      </Routes>
                  )}
              </div>
          </div>
      </BrowserRouter>
  );
}

export default App;
