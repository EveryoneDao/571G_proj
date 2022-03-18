//SPDX-License-Identifier: MIT;
pragma solidity >=0.8.0;

contract Store {

    uint256 constant public perOrderPrice = 100000000000000000;
    uint public totalSoldPrice;  

    struct GiftOrder{
        bool isValidGiftOrder;
        string recipientName;
        string recipientMailingAddress; 
        bool hasConfirmed;
    }
    
    mapping(address => GiftOrder) customerToOrder;

    event Book(
        address indexed _from,
        string _recipientName,
        string _recipientMailingAddress
    );

    event Confirm(
        address indexed _from
    );

    event CancelAndRefund(
        address indexed _from
    );

    constructor() {
        totalSoldPrice = 0;
    }

    function getBalance() public view returns (uint) {
        return totalSoldPrice;
    }

    modifier newOrderCheck(string memory _recipientName, string memory _recipientMailingAddress) {
        require(bytes(_recipientName).length > 0, "recipientName is empty");
        require(bytes(_recipientMailingAddress).length > 0, "recipientMailingAddress is empty");
        
        GiftOrder memory myOrder = customerToOrder[msg.sender];
        require((myOrder.isValidGiftOrder == true && myOrder.hasConfirmed == true) || 
                (myOrder.isValidGiftOrder == false && myOrder.hasConfirmed == false), 
                "Cannot make another order before confirm or cancel");
    
        require(msg.value >= perOrderPrice, "not enough ether sent");
        require(msg.value == perOrderPrice, "not equal to the order price");
        _;
    }

    function book(string memory _recipientName, string memory _recipientMailingAddress) 
                newOrderCheck(_recipientName, _recipientMailingAddress) public payable returns (bool success){

        GiftOrder memory myNewOrder =  GiftOrder(true, _recipientName, _recipientMailingAddress, false);
        customerToOrder[msg.sender] = myNewOrder;

        emit Book(msg.sender, _recipientName, _recipientMailingAddress);

        success = true;
    }

    modifier updateOrderCheck() {
        GiftOrder memory myOrder = customerToOrder[msg.sender];
        require(myOrder.isValidGiftOrder == true, "order is not valid");
        require(myOrder.hasConfirmed == false, "order has been confirmed");
        _;
    }

    function confirm() public updateOrderCheck() returns (bool success) {
        GiftOrder memory myOrder = customerToOrder[msg.sender];
        GiftOrder memory myUpdatedOrder = GiftOrder(true, myOrder.recipientName, myOrder.recipientMailingAddress, true);
        customerToOrder[msg.sender] = myUpdatedOrder;

        totalSoldPrice += perOrderPrice;

        emit Confirm(msg.sender);
        success = true;
    }

    function cancelAndRefund() public updateOrderCheck() returns (bool success){
        GiftOrder memory myOrder = customerToOrder[msg.sender];
        GiftOrder memory myUpdatedOrder = GiftOrder(false, myOrder.recipientName, myOrder.recipientMailingAddress, false);
        customerToOrder[msg.sender] = myUpdatedOrder;
        
        payable(msg.sender).transfer(perOrderPrice);

        emit CancelAndRefund(msg.sender);
        success = true;
    } 
}
