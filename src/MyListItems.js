import React, {useState,useEffect} from 'react';
import {ethers} from 'ethers';
import {Row,Col,Card} from 'react-bootstrap';

function renderSoldItems(items) {
    return (
        <>
            <h2>Sold</h2>
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
                {
                    items.map((item,key) => {
                        <Col key={key} className="overflow-hidden">
                            <Card.Img variant="top" src={item.image}/>
                            <Card.Footer>
                                For {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved {ethers.utils.formatEther(item.price)} ETH
                            </Card.Footer>
                        </Col>
                    })
                }
            </Row>
        </>
    )
}

export default function MyListItems({marketplace,nft,account}) {
    console.log("This is account:", account);
    const [loading,setLoading] = useState(true);
    const [listedItems,setListedItems] = useState([]);
    const [soldItems,setSoldItems] = useState([]);


    const loadListedItems = async () => {
        console.log(1)
        const itemCount = await marketplace.itemCount();
        console.log("item account",itemCount);
        let listedItems = [];
        let soldItems = [];

        for(let index=1; index <= itemCount; index++){
            const item = await marketplace.items(index);
            //console.log(item.seller);
            if(item.seller === account){
                console.log(item.seller)
                console.log(item.sold)
                const uri = await nft.tokenURI(item.tokenId);
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
                listedItems.push(itemOfJson);
                console.log("length",listedItems.length);
                if(item.sold){
                    soldItems.push(itemOfJson);
                }
            }
        }
        setLoading(false);
        setListedItems(listedItems);
        setSoldItems(soldItems);
    }
    useEffect(() => {
        loadListedItems()
    },[])

    if(loading) return(
        <main style={{ padding: "1rem 0" }}>
            <h2>Loading...</h2>
        </main>
    )

    return (
        <div className="flex justify-center">
            {
                listedItems.length > 0 ? (
                    <div className="px-5 py-3 container">
                        <h2>Listed</h2>
                        <Row xs={1} md={2} lg={4} className="g-4 py-3">
                            {listedItems.map((item, idx) => (
                                <Col key={idx} className="overflow-hidden">
                                    <Card>
                                        <Card.Img variant="top" src={item.image}  width="100"/>
                                        <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        {soldItems.length > 0 && renderSoldItems(soldItems)}
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