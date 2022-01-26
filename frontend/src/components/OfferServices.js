import { Button } from 'primereact/button';
import { useEffect, useState } from "react";


const OfferServices = () => {
    const [web3Provider, setProvider] = useState([]);
    const [account, setAccount] = useState(["not connected"]);
    const [connectedTest, setConnected] = useState(["Connect"]);

    async function loadEthereum(){
        if (window.ethereum){
            setProvider(window.ethereum)
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
            setAccount(accounts[0])
            setConnected(["Connected"])
        }
        else{
            console.log("Ethereum is not available")
        }
    }

    return(
        <div>
            <div class="row">
                <div class="col-md-11">
                    <h2 class="c">dServices</h2>
                    <p>Your account is: {account}</p>
                </div>
                <div class="col-md-1 py-3">
                    <Button disabled={connectedTest == "Connected"} onClick={loadEthereum} label={connectedTest} className="p-button-raised p-button-warning p-button-text" />
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h4>Offer Services</h4>
                </div>
            </div>
        </div>
    )
}
export default OfferServices;