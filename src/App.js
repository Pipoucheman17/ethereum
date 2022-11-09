import './App.css'

import React from 'react'
import { Button } from 'react-bootstrap'

import nft1 from "./NFT1.png"
import nft2 from "./NFT2.png"
import nft3 from "./NFT3.png"
import nft4 from "./NFT4.png"

import abi from './contracts/ABI.json';

import { ethers } from 'ethers'


//const contractAddress = "0x7e51f4bd18419e6981b96693a80c61e40c3d176c"

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentAccount: "", contractAddress: "0x7e51f4bd18419e6981b96693a80c61e40c3d176c", collection: []
    }
  }

  displayBuyNFT = async () => {

  }
  displayNFT = async () => {

    const { ethereum } = window;


    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(this.state.contractAddress, abi, signer);

        let listNft = await nftContract.getPicturesByOwner(this.state.currentAccount);

        console.log(listNft)



        var tablecontent = [];
        for (var i = 0; i < listNft.length; i++) {
          let nft = await nftContract.pictures(parseInt(listNft[i], 16));
          console.log(parseInt(listNft[i]._hex, 16))
          console.log(nft)
          let price = 
          tablecontent.push(<div>
            <ul>
              <li>Prix :{nft.price._hex}</li>
              <li>Description : {nft.description}</li>
            </ul>
          </div>

          )
        }
        this.setState({ collection: tablecontent })


      }

    }
    catch (err) {
      console.log(err)
    }
  }

  buyNFT = (tokenId) => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(this.state.contractAddress, abi, signer);

      nftContract.buyNFT(tokenId)

      console.log("Buying")

    }
  }

  NFT = (num) => {
    if (num === 1) {
      return nft1
    }
    else if (num === 2) {
      return nft2
    }
    else if (num === 3) {
      return nft3
    }
    else if (num === 4) {
      return nft4
    }
  }


  checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      this.setState({ currentAccount: account[0] })
    } else {
      console.log("No authorized account found");
    }
  }

  connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      this.setState({ currentAccount: accounts[0] })
    } catch (err) {
      console.log(err)
    }
  }

  mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(this.state.contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.safeMint("test", "tests", 1);

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }


  connectWalletButton = () => {
    return (
      <button onClick={() => this.connectWalletHandler()} type="button" className="btn btn-primary btn-lg">
        Connect Wallet
      </button>
    )
  }

  mintNftButton = () => {
    return (
      <button onClick={() => this.mintNftHandler()} type="button" className="btn btn-primary btn-lg">
        Mint NFT
      </button>
    )
  }

  render() {
    return (
      <div>
        <header>
          <h1 className="titleSection">Welcome to our NFT marketplace</h1>

        </header>
        <div>
          <h1>TP ECE</h1>
          <div className="row">
            <div className="col-1">
              {this.connectWalletButton()}
            </div>
            <div className="col-1">
              {this.mintNftButton()}
            </div>
          </div>

          <section>
            <h2>Buy Section</h2>
            <div><img src={nft4} />
              <button onClick={() => this.buyNFT(1)}>Buy</button></div>
          </section>
          <section>
            <h2>Your Collection Section</h2>
            <Button onClick={() => this.displayNFT()}>Clique pour afficher ta collection de NFT</Button>
            <br></br>
            {this.state.collection}
          </section>
        </div>
      </div>
    );
  }
}

export default App;
