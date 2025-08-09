// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AuctionManager {
    struct Auction {
        address payable seller;
        string item;
        uint endTime;
        uint highestBid;
        address payable highestBidder;
        mapping(address => uint) pendingReturns;
        bool ended;
    }

    Auction[] private auctions;

    event AuctionCreated(uint indexed auctionId, string item, uint endTime);
    event HighestBidIncreased(uint indexed auctionId, address bidder, uint amount);
    event AuctionEnded(uint indexed auctionId, address winner, uint amount);

    // Create a new auction
    function createAuction(string memory _item, uint _duration) external {
        require(_duration > 0, "Duration must be > 0");

        Auction storage auction = auctions.push();
        auction.seller = payable(msg.sender);
        auction.item = _item;
        auction.endTime = block.timestamp + _duration;

        emit AuctionCreated(auctions.length - 1, _item, auction.endTime);
    }

    // Place a bid on an auction
    function bid(uint _auctionId) external payable {
        require(_auctionId < auctions.length, "Invalid auction ID");

        Auction storage auction = auctions[_auctionId];

        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid, "Bid too low");
        require(msg.sender != auction.seller, "Seller cannot bid");

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

        // Use call pattern to avoid reentrancy issues
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    // Finalize auction: transfer highest bid to seller and mark ended
    function endAuction(uint _auctionId) external {
        require(_auctionId < auctions.length, "Invalid auction ID");

        Auction storage auction = auctions[_auctionId];

        require(block.timestamp >= auction.endTime, "Auction not ended yet");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;

        if (auction.highestBid > 0) {
            // Transfer funds to seller
            (bool success, ) = auction.seller.call{value: auction.highestBid}("");
            require(success, "Transfer to seller failed");
        }

        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
    }

    // View functions

    function getAuctionsCount() external view returns (uint) {
        return auctions.length;
    }

    function getAuction(uint _auctionId) external view returns (
        address seller,
        string memory item,
        uint endTime,
        uint highestBid,
        address highestBidder,
        bool ended
    ) {
        require(_auctionId < auctions.length, "Invalid auction ID");

        Auction storage a = auctions[_auctionId];
        return (a.seller, a.item, a.endTime, a.highestBid, a.highestBidder, a.ended);
    }

    // Returns pending returns of a user for an auction
    function getPendingReturn(uint _auctionId, address _user) external view returns (uint) {
        require(_auctionId < auctions.length, "Invalid auction ID");

        return auctions[_auctionId].pendingReturns[_user];
    }
}
