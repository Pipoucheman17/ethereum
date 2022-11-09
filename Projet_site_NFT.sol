// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.3/utils/Counters.sol";

contract TanjonaContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    event NewNFT(string _name, uint _tokenId);

    uint cooldownTime = 1 days;
    uint internal limitOfCollect = 300;
    uint internal limitOfSales = 3;

    struct PictureNft {
        string name; 
        string description;
        uint price;
        uint readyTime;
        bool forSale;
    }
    
    PictureNft[] public pictures;

    mapping (uint => address) public pictureToOwner;
    mapping (address => uint) ownerPictureCount;
    mapping (address => uint) ownerSalesCount;
    mapping (uint => address) internal buyerToNft;

    constructor() ERC721("exempleNFT", "MTK") {
        _tokenIdCounter.increment();
    }

    modifier onlyOwnerOf(uint _pictureId) {
        require(msg.sender == pictureToOwner[_pictureId]);
        _;
    }

    modifier collectionLimit(address owner) {
        require(ownerPictureCount[owner] <= limitOfCollect);
        _;
    }

    modifier priceRequire(uint _tokenId) {
        require(msg.value == pictures[_tokenId].price);
        _;
    }

    modifier onSale(uint _nftTokenId) {
        require(pictures[_nftTokenId].forSale == true);
        _;
    }

    modifier aboveSalesCount() {
        require(ownerSalesCount[msg.sender] <= limitOfSales);
        _;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/QmSJKfyRTdTTuNXCjB35RD5oohwRgYjLpHwx4uCzQCZocm/";
    }
    
    function safeMint(string memory _name, string memory _description, uint _price) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        pictureToOwner[tokenId] = msg.sender;
        ownerPictureCount[msg.sender]++;
        pictures.push(PictureNft(_name, _description, _price, uint(block.timestamp), false));

        _safeMint(msg.sender, tokenId);
        emit NewNFT(_name, tokenId);
    }

    function setCollectionLimit(uint _newLimit) public onlyOwner{
        limitOfCollect = _newLimit;
    }
    function setCooldownTime(uint _newCd) public onlyOwner {
        cooldownTime = _newCd;
    }
    function setSalesLimit(uint _newSalesLimit) public onlyOwner {
        limitOfSales = _newSalesLimit;
    }

    function setName(uint _nftTokenId, string memory _newName) public onlyOwnerOf(_nftTokenId) {
        pictures[_nftTokenId].name = _newName;
    }
    function setDescription(uint _nftTokenId, string memory _newDescription) public onlyOwnerOf(_nftTokenId) {
        pictures[_nftTokenId].description = _newDescription;
    }
    function setPrice(uint _nftTokenId, uint _newPrice) public onlyOwnerOf(_nftTokenId) {
        pictures[_nftTokenId].price = _newPrice;
    }
    function setStatusSale(uint _nftTokenId, bool _choice) public onlyOwnerOf(_nftTokenId) {
        pictures[_nftTokenId].forSale = _choice;
    }

    function getPicturesByOwner(address _owner) external view returns(uint[] memory) {
        uint[] memory result = new uint[](ownerPictureCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < pictures.length; i++) {
            if (pictureToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function transferer(address _from, address _to, uint256 _tokenId) private {
        ownerPictureCount[_to] = ownerPictureCount[_to]++;
        ownerPictureCount[_from] = ownerPictureCount[_from]--;
        pictureToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function _transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        transferer(msg.sender, _to, _tokenId);
    }
    
    function _triggerCooldown(PictureNft storage _picture) internal {
        _picture.readyTime = uint32(block.timestamp + cooldownTime);
    }

    function sellNFT(uint _tokenId) public onlyOwnerOf(_tokenId) aboveSalesCount() {
        setStatusSale(_tokenId, true);
        ownerSalesCount[msg.sender]++;
        _triggerCooldown(pictures[_tokenId]);
    }

    function buyNFT(uint _tokenId) public payable 
    collectionLimit(msg.sender) onSale(_tokenId) priceRequire(_tokenId) {
        buyerToNft[_tokenId] = msg.sender;
    }

    function withdraw(uint _tokenId) public onlyOwnerOf(_tokenId) {
        setStatusSale(_tokenId, false);
        ownerSalesCount[pictureToOwner[_tokenId]]--;
        pictures[_tokenId].readyTime = block.timestamp;

        uint amount = pictures[_tokenId].price;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to send Ether");

        _transfer(buyerToNft[_tokenId], _tokenId);
    }
}
