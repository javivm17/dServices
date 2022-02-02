import { Button } from 'primereact/button';
import { useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';
import Web3 from "web3";
import React from 'react'
import OfferServicesContract from "../contracts/OfferServices.json";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import '../css/Datatable.css';

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
    
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

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
            setOffers(offerList)
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
            <div class="card headerService"> 
                <div className="card-header">
                    <h3>Offer Services</h3>
                    <hr></hr>
                    <Button disabled={connectedTest != "Connected"} className='p-button-outlined p-button-info p-button-sm' label="Create new offer" icon="pi pi-external-link" onClick={() => onClick('displayResponsive')} />
                    <Button disabled={connectedTest == "Connected"} onClick={loadEthereum} label={connectedTest} className="p-button-raised p-button-info p-button-sm mx-5" />
                    <br></br><br></br>
                    <p class="text-muted">Your account is: {account}</p>
                </div>
                <div className="card-body offerDatatable">
                    <DataTable styleClass='offerDatatable'value={offers} paginator
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[5,10,20]}
                    paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                        <Column header="Title" sortable filter field="title"></Column>
                        <Column header="Created At" sortable filter field="createdAt"></Column>
                        <Column header="Owner" sortable filter field="owner"></Column>
                        <Column header="Details" body={detailsButton}></Column>
                        <Column header="Delete" body={deleteButton}></Column>
                    </DataTable>
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