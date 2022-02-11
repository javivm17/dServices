import { Button } from 'primereact/button';
import { useEffect, useState,useRef } from "react";
import { Dialog } from 'primereact/dialog';
import Web3 from "web3";
import React from 'react';
import OfferServicesContract from "../contracts/OfferServices.json";
import { DataScroller } from 'primereact/datascroller';
import '../css/DataScroll.css';
import ChatComponent from './ChatComponent';


const OfferServices = () => {
    const [web3Provider, setProvider] = useState([]);
    const [account, setAccount] = useState(["not connected"]);
    const [connectedTest, setConnected] = useState(["Connect"]);
    const [contract,setContract]= useState([]);
    const [offers,setOffers]= useState([]);
    const [networkId, setNetworkId]= useState([]);
    const [deployedNetwork, setDeployedNetwork]= useState([]);
    const [displayResponsive, setDisplayResponsive] = useState(false);
    const [title, setTitle]= useState('');
    const [description, setDescription]= useState('');
    const [offerDetail, setOfferDetail]= useState('');

    const ds = useRef(null);  

    const itemTemplate = (rowData) => {
        return (
            <div className="offer">
                <span className="offer-title">{rowData.title}</span> <span className="offer-detail">{detailsButton(rowData)}</span>
                <span className="offer-owner">Created by:  {rowData.owner}</span>  <span className="offer-delete">{deleteButton(rowData)}</span>
                <span className="offer-date">{rowData.createdAt}</span>
                <hr></hr>
            </div>
        );
    }

    const footer = <Button type="text" icon="pi pi-plus" label="Load" onClick={() => ds.current.load()} />;

    
    //const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
    //const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

    const dialogFuncMap = {
        'displayResponsive': setDisplayResponsive
    }
    const [position, setPosition] = useState('center');
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    function titleHandler(event){
        setTitle(event.target.value)
    }
    function descriptionHandler(event){
        setDescription(event.target.value)
    }
    function detailsButton(rowData){
        return(
            <Button icon="pi pi-external-link" className="p-button-rounded p-button-sm p-button-info" onClick={() => setOfferDetail(
            <Dialog header="Offer Details" visible={true} onHide={() => setOfferDetail(null)} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}}>
                <div class="card">
                <div class="card-header c">
                    <h5 class="text-center">{rowData.title}</h5>
                </div>
                <div class="card-body">
                    <p class="text-center">{rowData.description}</p>
                </div>
            </div>
            </Dialog>)
            }/>
        )
    }

    function deleteButton(rowData){
        if (rowData.owner == account){
            return(
                <Button icon="pi pi-trash" className="p-button-sm p-button-rounded p-button-danger" onClick={() => deleteOffer(rowData.id)}/>
            )
        }
    }

    async function deleteOffer(id){
        await contract.methods.deleteOffer(id).send({from :account})
        const offerCounter = await contract.methods.offerCounter().call()
        let offerList =[]
        for (let i = 1; i <= offerCounter; i++) {  
            const offer = await contract.methods.offers(i).call()
            const id = offer[0]
            const title = offer[1]
            const description = offer[2]
            const owner = offer[3]
            const createdAt = offer[4]
            let offerElement = {
                'id': id,
                'owner': owner,
                'title': title,
                'description':description,
                'createdAt':new Date(createdAt * 1000).toLocaleString()
            }
            if (owner!= "0x0000000000000000000000000000000000000000"){
                offerList.push(offerElement)
            }
        }
        setOffers(offerList)
    }

    async function proccessForm(event){
        event.preventDefault()
        await contract.methods.createOffer(title,description).send({from :account})
        const offerCounter = await contract.methods.offerCounter().call()
        let offerList =[]
        for (let i = 1; i <= offerCounter; i++) {  
            const offer = await contract.methods.offers(i).call()
            const id = offer[0]
            const title = offer[1]
            const description = offer[2]
            const owner = offer[3]
            const createdAt = offer[4]
            let offerElement = {
                'id': id,
                'owner': owner,
                'title': title,
                'description':description,
                'createdAt':new Date(createdAt * 1000).toLocaleString()
            }
            if (owner!= "0x0000000000000000000000000000000000000000"){
                offerList.push(offerElement)
            }
        }
        setOffers(offerList)
        onHide('displayResponsive')
    }

    async function loadEthereum(){
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            // Request account access if needed
            await window.ethereum.enable();
            // Accounts now exposed
            
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
            let offerList =[]
            for (let i = 1; i <= offerCounter; i++) {  
                const offer = await instance.methods.offers(i).call()
                const id = offer[0]
                const title = offer[1]
                const description = offer[2]
                const owner = offer[3]
                const createdAt = offer[4]
                let offerElement = {
                    'id': id,
                    'owner': owner,
                    'title': title,
                    'description':description,
                    'createdAt':new Date(createdAt * 1000).toLocaleString()
                }
                if (owner!= "0x0000000000000000000000000000000000000000"){
                    offerList.push(offerElement)
                }
            }
            setConnected([accounts[0]])
            setOffers(offerList)
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
            <div class="card headerService"> 
                <div className="card-header">
                    <h3>Offer Services</h3>
                    <hr></hr>
                    <Button disabled={connectedTest != account} className='p-button-outlined p-button-info p-button-sm' label="Create new offer" icon="pi pi-plus" onClick={() => onClick('displayResponsive')} />
                    <Button disabled={connectedTest == account} icon="pi pi-user" onClick={loadEthereum} label={connectedTest == "Connect"?connectedTest : connectedTest.toString().slice(0,6)+"..."+connectedTest.toString().slice(-5,-1)} className="p-button-raised p-button-info p-button-sm mx-5" />
                    <br></br><br></br>
                </div>
                <div className="card-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-8 w-75">
                                <div className="datascroller">
                                    <div className="card">
                                        <DataScroller ref={ds} value={offers}itemTemplate={itemTemplate} rows={5}
                                            loader footer={footer} header="Click Load Button at Footer to Load More" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-4 w-25"><ChatComponent />
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
            <Dialog header="Create a new offer" visible={displayResponsive} onHide={() => onHide('displayResponsive')} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}}>
                <form class="card card-body rounded-0" id="taskForm">
                    <input name="title" type="text" placeholder="Write a title" class="form-control rounded-0 border-0 my-4" onChange={titleHandler}/>
                    <textarea name="description" rows="2" class="form-control rounded-0 border-0 my-4" placeholder="Write the offer description" onChange={descriptionHandler}></textarea>
                    <button class="btn btn-primary" onClick={proccessForm}>Save</button>
                </form>
            </Dialog>
            {offerDetail}
            
        </div>
    )
}

                
export default OfferServices;
