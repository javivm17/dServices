import ChatContract from "../contracts/ChatContract.json";
import React from 'react';
import { useEffect, useState,useRef } from "react";
import { Button } from 'primereact/button';
import Web3 from "web3";
import ChatContractNotDeployed from "../contracts/ChatContract.json";

const ChatComponent = ()=>{
    const [web3Provider, setProvider] = useState([]);
    const [account, setAccount] = useState(["not connected"]);
    const [connectedTest, setConnected] = useState(["Connect"]);
    const [contract,setContract]= useState([]);
    const [chats,setChats]= useState([]);
    const [networkId, setNetworkId]= useState([]);
    const [deployedNetwork, setDeployedNetwork]= useState([]);
    const [displayResponsive, setDisplayResponsive] = useState(false);
    const [title, setTitle]= useState('');
    const [description, setDescription]= useState('');


    async function loadContract(){
        if(window.ethereum){
            const web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = ChatContractNotDeployed.networks[networkId];
            setNetworkId(networkId)
            setAccount(accounts[0])
            setDeployedNetwork(deployedNetwork)
            const instance = new web3.eth.Contract(
                ChatContractNotDeployed.abi,
                deployedNetwork && deployedNetwork.address,
              );
            setContract(instance)
            const chatCounter = await instance.methods.chatCounter().call()
            let chatList =[]
            for (let i = 1; i <= chatCounter; i++) {  
                const message = await instance.methods.chats(i).call()
                const id = message[0]
                const text = message[1]
                const sender = message[2]
                const receiver = message[3]
                const createdAt = message[4]
                let msgElement = {
                    'id': id,
                    'text': text,
                    'sender': sender,
                    'receiver':receiver,
                    'createdAt':new Date(createdAt * 1000).toLocaleString()
                }
                if (sender!= "0x0000000000000000000000000000000000000000"){
                    chatList.push(msgElement)
                }
            }
            setChats(chatList)
            setConnected([accounts[0]])
            return web3;
        }
        // Legacy dapp browsers...
        else if (window.web3) {
        // Use Mist/MetaMask's provider.
            const web3 = window.web3;
            console.log("Injected web3 detected.");
            setConnected([account])
            return web3;
        }
        // Fallback to localhost; use dev console port by default...
        else {
            const provider = new Web3.providers.HttpProvider(
                "http://127.0.0.1:8545"
            );
            const web3 = new Web3(provider);
            console.log("No web3 instance injected, using Local web3.");
            setConnected([account])
            return web3;
        }
    }
    

    return(
        <div>
            <div class="card">
                <h3 class="mt-2">Chats</h3>
                <span className="chats">{chats.map((chat)=> chat.text )}</span>
                <Button disabled={connectedTest == account} icon="pi pi-user" onClick={loadContract} label={connectedTest == "Connect"?connectedTest : connectedTest.toString().slice(0,6)+"..."+connectedTest.toString().slice(-5,-1)} className="p-button-raised p-button-info p-button-sm mx-5" />
                <input name="msg" type="text" placeholder="Text a Message" class="form-control rounded-0 border-0 my-4 w-75 mx-4"/>
            </div>
        </div>
    )
}
export default ChatComponent