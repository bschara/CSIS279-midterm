pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyToken is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _collectionIdCounter;
    Counters.Counter private _tokenIdCounter;

    struct TicketData {
        string name;
        string place;
        string date;
        uint ticketPrice;
        uint ticketNumber;
        address organizerAddress;
        bool isSold;
    }

    struct Collection {
        string name;
        uint256[] tokenIds;
        uint256 ticketCount;
        uint ticketSold;
    }

    mapping(uint256 => Collection) private _collections;
    mapping(uint256 => TicketData) private _ticketData;

    constructor() ERC721("MyToken", "MTK") {}

    function createCollection(
        string memory name,
        string memory place,
        string memory date,
        uint ticketPrice,
        uint ticketCount,
        address organizerAddress
    ) public onlyOwner {
        for (uint i = 0; i < ticketCount; i++) {
            TicketData memory newTicket = TicketData(
                name,
                place,
                date,
                ticketPrice,
                i + 1,
                organizerAddress,
                false
            );
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            _ticketData[tokenId] = newTicket;
            _collections[_collectionIdCounter.current()].tokenIds.push(tokenId);
        }
        Collection memory newCollection = Collection(
            name,
            _collections[_collectionIdCounter.current()].tokenIds,
            ticketCount,
            0
        );
        _collections[_collectionIdCounter.current()] = newCollection;
        _collectionIdCounter.increment();
    }

    function transferTicket(
        uint256 tokenId,
        address payable to,
        uint256 feePercentage
    ) public payable {
        require(_exists(tokenId), "Ticket does not exist");
        require(
            ownerOf(tokenId) == msg.sender,
            "Only ticket owner can transfer ticket"
        );
        require(to != address(0), "Cannot transfer to zero address");
        require(
            msg.value >= _ticketData[tokenId].ticketPrice,
            "Insufficient payment"
        );
        require(!_ticketData[tokenId].isSold, "ticket is already sold");

        //Collection memory collection = getCollectionByTokenId(tokenId);

        uint256 fee = (msg.value * feePercentage) / 10000;
        uint256 payment = msg.value - fee;

        // Transfer the payment to the organizer
        address payable organizer = payable(
            _ticketData[tokenId].organizerAddress
        );
        organizer.transfer(payment);

        // Transfer the fee to the contract owner
        address payable owner = payable(owner());
        owner.transfer(fee);

        // Transfer the token to the receiver
        _transfer(msg.sender, to, tokenId);

        // Update the isSold flag to true
        _ticketData[tokenId].isSold = true;

        _collections[getCollectionByTokenId(tokenId)].ticketSold++;
    }

    function mint(uint256 collectionId, address to) public onlyOwner {
        require(
            bytes(_collections[collectionId].name).length > 0,
            "Collection does not exist"
        );
        uint256 tokenId = _tokenIdCounter.current() + 1;
        require(_ticketData[tokenId].ticketNumber == 0, "Token already minted");
        _safeMint(to, tokenId);
        _collections[collectionId].tokenIds.push(tokenId);
    }

    function getCollection(
        uint256 collectionId
    ) public view returns (Collection memory) {
        require(
            bytes(_collections[collectionId].name).length > 0,
            "Collection does not exist"
        );
        return _collections[collectionId];
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function getTicketData(
        uint256 tokenId
    ) public view returns (TicketData memory) {
        require(_exists(tokenId), "Ticket does not exist");
        return _ticketData[tokenId];
    }

    function getCollectionCounter() public view returns (uint256) {
        return _collectionIdCounter.current();
    }

    function getCollectionsByOrganizer(
        address organizer
    ) public view returns (Collection[] memory) {
        uint256 collectionCount = _collectionIdCounter.current();
        uint256 matchingCollectionCount = 0;
        Collection[] memory matchingCollections = new Collection[](
            collectionCount
        );

        for (uint256 i = 0; i < collectionCount; i++) {
            Collection memory collection = _collections[i];
            if (
                collection.tokenIds.length > 0 &&
                _ticketData[collection.tokenIds[0]].organizerAddress ==
                organizer
            ) {
                matchingCollections[matchingCollectionCount] = collection;
                matchingCollectionCount++;
            }
        }

        Collection[] memory result = new Collection[](matchingCollectionCount);
        for (uint256 i = 0; i < matchingCollectionCount; i++) {
            result[i] = matchingCollections[i];
        }

        return result;
    }

    function getCollectionByTokenId(
        uint256 tokenId
    ) public view returns (uint) {
        require(_exists(tokenId), "Token does not exist");

        // Find the collection that contains the given token ID
        for (uint256 i = 0; i < _collectionIdCounter.current(); i++) {
            Collection memory collection = _collections[i];
            for (uint256 j = 0; j < collection.tokenIds.length; j++) {
                if (collection.tokenIds[j] == tokenId) {
                    return j;
                }
            }
        }

        // Throw an error if the token ID is not found in any collection
        revert("Token not found in any collection");
    }
}
