import Carousel from 'react-bootstrap/Carousel';
import React from 'react'
import chat from './index.jpg'
import nft1 from "./NFT1.png"
import nft2 from "./NFT2.png"
import nft3 from "./NFT3.png"
import nft4 from "./NFT4.png"

export default class BuyPage extends React.Component {


    render() {
        return (
            <div>
                <div className="container d-flex">
                    <br></br>

                    <img src={nft1} alt="index" className="d-block imageNFT " />


                    <img src={nft2} alt="index" className="d-block imageNFT " />

                    <img src={nft3} alt="index" className="d-block imageNFT " />

                </div>
            </div>
        )
    }
}