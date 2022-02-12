// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract ChatContract {
    
    uint public chatCounter = 0;

    constructor () {
        sendMessage("Primera prueba", "0xA9455F81EA348277efBb581Aaa2370d98AD6dD0f");
        sendMessage("Segunda prueba", "0xA9455F81EA348277efBb581Aaa2370d98AD6dD0f");
        sendMessage("Tercera prueba", "0xA9455F81EA348277efBb581Aaa2370d98AD6dD0f");
        sendMessage("Cuarta prueba", "0xA9455F81EA348277efBb581Aaa2370d98AD6dD0f");
    }

    struct Message {
        uint id;
        string text;
        address sender;
        string receiver;
        uint256 createdAt;
    }

    mapping (uint => Message) public chats;
    function sendMessage(string memory _text, string memory _receiver) public {
        chatCounter++;
        chats[chatCounter] = Message(chatCounter,_text,msg.sender,_receiver,block.timestamp);
        
    }
}