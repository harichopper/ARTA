// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AuctionManager {
    struct Auction {
        address payable sellerAddress;
        string name;
        string sellerName;
        string description;
        uint endTime;
        uint highestBid;
        uint startingBid;
        address payable highestBidder;
        mapping(address => uint) pendingReturns;
        bool ended;
    }

    Auction[] private auctions;

    event AuctionCreated(
        uint indexed auctionId,
        string name,
        string sellerName,
        uint startingBid,
        uint endTime,
        string description
    );
    event HighestBidIncreased(uint indexed auctionId, address bidder, uint amount);
    event AuctionEnded(uint indexed auctionId, address winner, uint amount);

    // Create a new auction with 5 arguments
    function createAuction(
        string memory _name,
        string memory _sellerName,
        uint _startingBid,
        uint _duration,
        string memory _description
    ) external {
        require(_duration > 0, "Duration must be > 0");

        Auction storage auction = auctions.push();
        auction.sellerAddress = payable(msg.sender);
        auction.name = _name;
        auction.sellerName = _sellerName;
        auction.description = _description;
        auction.startingBid = _startingBid;
        auction.endTime = block.timestamp + _duration;

        emit AuctionCreated(
            auctions.length - 1,
            _name,
            _sellerName,
            _startingBid,
            auction.endTime,
            _description
        );
    }

    // Place a bid on an auction
    function bid(uint _auctionId) external payable {
        require(_auctionId < auctions.length, "Invalid auction ID");

        Auction storage auction = auctions[_auctionId];

        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid && msg.value >= auction.startingBid, "Bid too low");
        require(msg.sender != auction.sellerAddress, "Seller cannot bid");

        // Refund previous highest bidder by adding to pendingReturns
        if (auction.highestBid != 0) {
            auction.pendingReturns[auction.highestBidder] += auction.highestBid;
        }

        auction.highestBidder = payable(msg.sender);
        auction.highestBid = msg.value;

        emit HighestBidIncreased(_auctionId, msg.sender, msg.value);
    }

    // Withdraw overbid amounts
    function withdrawReturns(uint _auctionId) external {
        require(_auctionId < auctions.length, "Invalid auction ID");

        Auction storage auction = auctions[_auctionId];
        uint amount = auction.pendingReturns[msg.sender];
        require(amount > 0, "No returns");

        auction.pendingReturns[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    // Finalize auction
    function endAuction(uint _auctionId) external {
        require(_auctionId < auctions.length, "Invalid auction ID");

        Auction storage auction = auctions[_auctionId];

        require(block.timestamp >= auction.endTime, "Auction not ended yet");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;

        if (auction.highestBid > 0) {
            (bool success, ) = auction.sellerAddress.call{value: auction.highestBid}("");
            require(success, "Transfer to seller failed");
        }

        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
    }

    // View functions
    function getAuctionsCount() external view returns (uint) {
        return auctions.length;
    }

    function getAuction(uint _auctionId) external view returns (
        address sellerAddress,
        string memory name,
        string memory sellerName,
        string memory description,
        uint endTime,
        uint startingBid,
        uint highestBid,
        address highestBidder,
        bool ended
    ) {
        require(_auctionId < auctions.length, "Invalid auction ID");

        Auction storage a = auctions[_auctionId];
        return (
            a.sellerAddress,
            a.name,
            a.sellerName,
            a.description,
            a.endTime,
            a.startingBid,
            a.highestBid,
            a.highestBidder,
            a.ended
        );
    }

    function getPendingReturn(uint _auctionId, address _user) external view returns (uint) {
        require(_auctionId < auctions.length, "Invalid auction ID");

        return auctions[_auctionId].pendingReturns[_user];
    }
}

