import React, {useState,useEffect} from 'react';
import {ethers} from 'ethers';
import {Row,Col,Card} from 'react-bootstrap';


export default function MyNFT({marketplace,nft,account}) {
    const [loading,setLoading] = useState(true);
    const [ownedNFTs,setOwnedNFTs] = useState([]);

    const loadOwnedNFTs = async () => {
        const itemCount = await marketplace.itemCount();
        let items = []
        for(let i = 1; i<= itemCount;i++){
            const item = await marketplace.items(i);
            const tokenId =await item.tokenId;
            const owner = await nft.ownerOf(tokenId);
            console.log(i,owner)
            if(owner === account){
                const uri = await nft.tokenURI(tokenId);
                const response = await fetch(uri);
                const metadata = await response.json();
                const totalPrice = await marketplace.getTotalPrice(item.itemId);

                let itemOfJson = {
                    totalPrice,
                    price:item.price,
                    itemId:item.itemId,
                    name:metadata.name,
                    description:metadata.description,
                    image:metadata.image
                }
                items.push(itemOfJson);
            }
        }
        setLoading(false);
        setOwnedNFTs(items);
    }

    useEffect(() => {
        loadOwnedNFTs()
    },[])

    if(loading) return(
        <main style={{ padding: "1rem 0" }}>
            <h2>Loading...</h2>
        </main>
    )

    return (
        <div className="flex justify-center">
            {
                ownedNFTs.length > 0 ? (
                    <div className="px-5 py-3 container">
                        <h2>Listed</h2>
                        <Row xs={1} md={2} lg={4} className="g-4 py-3">
                            {ownedNFTs.map((item, idx) => (
                                <Col key={idx} className="overflow-hidden">
                                    <Card>
                                        <Card.Img variant="top" src={item.image}  width="100"/>
                                        <Card.Body color="secondary">
                                            <Card.Title>Name: {item.name}</Card.Title>
                                            <Card.Text>Description {item.description}</Card.Text>
                                            <Card.Text>NFT Seller: {item.seller}</Card.Text>
                                            <Card.Text>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ) : (
                    <main style={{ padding: "1rem 0" }}>
                        <h2>No NFTs</h2>
                    </main>
                )
            }
        </div>
    )
}