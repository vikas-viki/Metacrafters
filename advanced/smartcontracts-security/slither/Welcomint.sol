// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./@openzeppelin/contracts/utils/Counters.sol";
import "./@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./ReentrancyGuard.sol";

contract Welcomint is ERC721, ERC721URIStorage, ERC721Enumerable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    constructor() ERC721("Welcomint", "WMT") {}

    struct Listing {
        address seller;
        uint256 price;
        bool active;
        string tokenUri;
    }

    mapping(uint256 => Listing) private listings;

    event NFTListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event NFTSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

    // For users if they don't want to sale, like they just want to mint.
    function safeMint(string memory _tokenURI) external nonReentrant {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        listings[newTokenId] = Listing({
            seller: msg.sender,
            price: 0,
            active: false,
            tokenUri: _tokenURI
        });
    }

    // Used to list the nft for sale of a user, initially when minted.
    function listNFT(uint256 price, string memory _tokenURI) external nonReentrant {
        require(price > 0, "Price must be greater than 0");
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        listings[newTokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true,
            tokenUri: _tokenURI
        });
        emit NFTListed(newTokenId, msg.sender, price);
    }


    // For the users to list for sale the minted nft.
    function listForSale(uint tokenId, uint _price) external {
        require(tokenId <= tokenIds.current(), "Invalid token id");
        require(_price > 0, "Price must be greater than 0");
        Listing storage listing = listings[tokenId];
        require(listing.seller == msg.sender, "Only minted owner can list NFTs");
        require(listing.active == false, "token is already listed for sale.");
        listing.active = true;
        listing.price = _price;
        listings[tokenId] = listing;
        emit NFTListed(tokenId, msg.sender, _price);
    }

    // For users to calncel the list for sale.
    function cancelListing(uint _tokenId) external {
        require(_tokenId <= tokenIds.current(), "Invalid token ID");
        Listing storage listing = listings[_tokenId];
        require(listing.seller == msg.sender, "Only owner can cancel listing");
        listing.active = false;
        listings[_tokenId] = listing;
    }

    // For the users to buy NFT
    function buyNFT(uint256 tokenId) external payable nonReentrant{
        Listing storage listing = listings[tokenId];
        require(listing.active, "NFT not available for sale");
        require(listing.seller != msg.sender, "Owner can't buy his own nfts.");
        require(msg.value >= listing.price, "Insufficient funds");

        address seller = listing.seller;
        listing.active = false;
        listing.seller = msg.sender;
        listings[tokenId] = listing;
        _transfer(seller, msg.sender, tokenId);

        payable(seller).call{value: listing.price};

        emit NFTSold(tokenId, seller, msg.sender, listing.price);


        if (msg.value > listing.price) {
            payable(msg.sender).call{value: msg.value - listing.price};
        }
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getTokensByOwner(address owner)
        public
        view
        returns (string[] memory)
    {
        uint256 tokenCount = balanceOf(owner);
        string[] memory tokens = new string[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokens[i] = tokenURI(tokenOfOwnerByIndex(owner, i));
        }

        return tokens;
    }
}
