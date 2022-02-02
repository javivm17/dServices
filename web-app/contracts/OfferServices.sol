// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract OfferServices {
    
    uint public offerCounter = 0;

    constructor () {
        createOffer("Desarrollador Blockchain", "Soy un desarrollador de blockchain de 21 y/o");
        createOffer("Desarrollador Web 3.0", "Soy un programador y estudiante interesado en el mundo del desarrollo web y la descentralizacion");
        createOffer("Jefe de gestion de proyectos", "Ofrezco mi servicio como jefe de desarrollo software en proyectos de Full Stack");
        createOffer("Desarrollador Web", "Soy un ingeniero del software con poca experiencia en el mundo del desarrollo web pero con muchas ganas de ganar experiencia.");
        createOffer("Programador Blockchain", "Soy un programador joven entusiasta del mundo del software descentralizado y la informacion libre y accesible");
        createOffer("Disenador Grafico", "Me especializo en darle apariencia a las webs a traves de un frontend llamativo y limpio");
        createOffer("Programador PHP", "Soy un ingeniero del software con mucha experiencia en el mundo del desarrollo web, sobretodo en lenguaje PHP y desarrollo con Angular.");
        createOffer("Programador JavaScript", "Soy un programador con poca experiencia en el mundo del desarrollo web pero con muchas ganas de ganar experiencia.");
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