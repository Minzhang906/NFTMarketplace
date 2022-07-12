import React, {useState,useEffect} from 'react';
import {ethers} from 'ethers';
import {Row,Col,Card,Button} from 'react-bootstrap';


const BuyNFT = ({marketplace,nft}) => {
    const  [loading,setLoading] = useState(true);
    const  [unsoldItems,setUnsoldItems] = useState([]);
    const loadMarketplaceUnsoldItems = async () => {
        const itemCount = await marketplace.itemCount();
        let items = [];
        for (let i = 1; i <= itemCount; i++){
            const item = await marketplace.items(i);
            if(!item.sold){
                const uri = await nft.tokenURI(item.tokenId);
                const response = await fetch(uri);
                const metadata = await response.json();
                const totalPrice = await marketplace.getTotalPrice(item.itemId);
                items.push({
                    totalPrice,
                    itemId:item.itemId,
                    seller: item.seller,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                })
            }
        }
        setLoading(false);
        setUnsoldItems(items);
    }

    const purchaseItem = async (item) => {
        await (await marketplace.purchaseItem(item.itemId, {value: item.totalPrice})).wait();
        loadMarketplaceUnsoldItems();
    }

    useEffect(() => {
        loadMarketplaceUnsoldItems()
    },[])

    if(loading) return (
        <>
            <main style={{ padding: "1rem 0" }}>
                <h2>Loading</h2>
            </main>
        </>
    )

    return (
        <div className="flex justify-center">
            {
                unsoldItems.length > 0 ? (
                    <div className="px-5 container">
                        <Row xs={1} md={2} lg={4} className="g-4 py-5">
                            {unsoldItems.map((item,idx) => (
                                <Col key={idx} className="overflow-hidden">
                                    <Card>
                                        <Card.Img  variant="top" src={item.image} width="100"/>
                                        <Card.Body color="secondary">
                                            <Card.Title>Name: {item.name}</Card.Title>
                                            <Card.Text>Description {item.description}</Card.Text>
                                            <Card.Text>NFT Seller: {item.seller}</Card.Text>
                                        </Card.Body>
                                        <Card.Footer>
                                            <div className='d-grid'>
                                                <Button onClick={() => purchaseItem(item)} variant="primary" size="lg">
                                                    Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                                                </Button>
                                            </div>
                                        </Card.Footer>
                                    </Card>

                                    <br/>
                                </Col>
                                )
                            )}
                        </Row>
                    </div>
                ) : (
                    <main style={{ padding: "1rem 0" }}>
                        <h2>No listed assets</h2>
                    </main>
                )
            }
        </div>
    )
}

export default BuyNFT;