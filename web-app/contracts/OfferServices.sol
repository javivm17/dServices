// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract OfferServices {
    
    uint public offerCounter = 0;

    constructor () {
        createOffer("Desarrollador Blockchain", "Soy un desarrollador de blockchain de 21 y/o");
    }

    struct Offer {
        uint id;
        string title;
        string description;
        address owner;
        uint256 createdAt;
    }

    mapping (uint => Offer) public offers;
    function createOffer(string memory _title ,string memory _description) public {
        offerCounter++;
        offers[offerCounter] = Offer(offerCounter,_title,_description, msg.sender, block.timestamp);
        
    }
    function deleteOffer(uint _id ) public {
        Offer memory _offer = offers[_id];
        require(msg.sender == _offer.owner , 
        "You cannot delete an offer you have not created");
        delete offers[_id];
    }


}