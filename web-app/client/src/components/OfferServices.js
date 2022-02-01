import { Button } from 'primereact/button';
import { useEffect, useState } from "react";
import Web3 from "web3";
import React from 'react'
import OfferServicesContract from "../contracts/OfferServices.json";


const OfferServices = () => {
    const [web3Provider, setProvider] = useState([]);
    const [account, setAccount] = useState(["not connected"]);
    const [connectedTest, setConnected] = useState(["Connect"]);
    const [contract,setContract]= useState([]);
    const [offers,setOffers]= useState([]);
    const [networkId, setNetworkId]= useState([]);
    const [deployedNetwork, setDeployedNetwork]= useState([]);
    
    async function loadEthereum(){
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            // Request account access if needed
            await window.ethereum.enable();
            // Accounts now exposed
            setConnected(["Connected"])
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = OfferServicesContract.networks[networkId];
            setNetworkId(networkId)
            setAccount(accounts[0])
            setDeployedNetwork(deployedNetwork)
            const instance = new web3.eth.Contract(
                OfferServicesContract.abi,
                deployedNetwork && deployedNetwork.address,
              );
            setContract(instance)
            const offerCounter = await instance.methods.offerCounter().call()
            let html =''
            for (let i = 1; i <= offerCounter; i++) {  
                const offer = await instance.methods.offers(i).call()
                const title = offer[1]
                const description = offer[2]
                const owner = offer[3]
                const createdAt = offer[4]
                let offerElement = `
                    <div class="card bg-dark rounded-0 mb-2">
                        <div class="card-header ">
                            <span >${title} - ${owner}</span>
                        </div>
                        <div class="card-body">
                            <span>${description}</span>
                            <p class="text-muted">Created at: ${new Date(createdAt * 1000).toLocaleString()}</p>
                        </div>
                    </div>
                    `
                html += offerElement
            }
            setOffers(html)
            return web3;
          }
          // Legacy dapp browsers...
          else if (window.web3) {
            // Use Mist/MetaMask's provider.
            const web3 = window.web3;
            console.log("Injected web3 detected.");
            setConnected(["Connected"])
            return web3;
          }
          // Fallback to localhost; use dev console port by default...
          else {
            const provider = new Web3.providers.HttpProvider(
              "http://127.0.0.1:8545"
            );
            const web3 = new Web3(provider);
            console.log("No web3 instance injected, using Local web3.");
            setConnected(["Connected"])
            return web3;
          }
    }

    return(
        <div>
            <div class="row">
                <div class="col-md-11">
                    <h1 class="c">dServices</h1>
                    <p class="text-muted">Your account is: {account}</p>
                </div>
                <div class="col-md-1 py-3">
                    <Button disabled={connectedTest == "Connected"} onClick={loadEthereum} label={connectedTest} className="p-button-raised p-button-warning" />
                </div>
            </div>
            <div class="card bg-dark">
                <div class="card-header">
                    <h4>Offer Services</h4>
                </div>
                <div class="card-body">
                    <div className="content" dangerouslySetInnerHTML={{__html: offers}}></div>
                </div>
            </div>
        </div>
    )
}
export default OfferServices;