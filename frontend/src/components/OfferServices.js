import { Button } from 'primereact/button';
import { useEffect, useState } from "react";
import truffleContract from '@truffle/contract'

const OfferServices = () => {
    const [web3Provider, setProvider] = useState([]);
    const [account, setAccount] = useState(["not connected"]);
    const [connectedTest, setConnected] = useState(["Connect"]);
    const [contract,setContract]= useState([]);
    const [offers,setOffers]= useState([]);

    useEffect (() => {
        loadPage();
        
    },[])

    async function loadPage() {
        const res = await fetch("./OfferServices.json");
        const resJSON = res.json()
        console.log(resJSON["abi"])
        const offerContract = TruffleContract(resJSON)
        offerContract.setProvider(web3Provider)
        await setContract(offerContract.deployed())
        const offerCounter = await contract.offerCounter()
        const offerCounterNum = offerCounter.toNumber()

        let html =''
        for (let i = 1; i <= offerCounterNum; i++) {
            
            const offer = contract.offers(i)
            const title = offer[1]
            const description = offer[2]
            const owner = offer[3]
            const createdAt = offer[4]
            let offerElement = `
            <div class="card bg-dark rounded-0 mb-2">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>${title} - ${owner}</span>
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
    }
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
                    {offers}
                </div>
            </div>
        </div>
    )
}
export default OfferServices;