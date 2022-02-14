import ChatContract from "../contracts/ChatContract.json";
import React from 'react';
import { useEffect, useState,useRef } from "react";
import { Button } from 'primereact/button';
import Web3 from "web3";
import ChatContractNotDeployed from "../contracts/ChatContract.json";
import Api from "../api/api";
import { Chip } from 'primereact/chip';
import '../css/Chip.css';

const ChatComponent = (props)=>{
    const [time, setTime] = useState(Date.now());
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [line,setLine] =useState("");

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
          clearInterval(interval);
        };
      }, []);


    useEffect(() => {
        if (props.receiver != ""){
            Api.get_messages(props.account,props.receiver)
                .then((res) => setMessages(res))
        }
    }, [time]);
    
    function msgHandler(event){
        setMessage(event.target.value)
    }

    function sendMessage(event){
        event.preventDefault();
        Api.send_message(props.account,props.receiver,message)  
        setMessage("");    
    }
    function who(message){
        if (message.sender == props.account){
            return "You"
        }
        else{
            return "Other"
        }
    }
    //"pi pi-user-edit"
    function printMsg(messages){
        return messages.map(message => <div className="flex flex-wrap" align={who(message) == "You"? "right" : "left"}>
        <Chip label={<div><b>{who(message)}:</b> {message.message}</div>} icon={who(message) == "You"? "pi pi-user" : "pi pi-user-edit"} className="mr-2 mb-2" />
        </div>)
        
    
    }
    return(
        <div>
            <div class="card">
                <div class="card-header">
                    <p><b>{props.receiver}</b></p>
                </div>
                <br></br>
                <p>{printMsg(messages)}</p>
                                
                
                <form id="msgForm" onSubmit={sendMessage}>
                    <input name="msg" type="text" value={message} placeholder="Text a Message" onChange={msgHandler} class="form-control rounded-0 border-0 my-4 w-75 mx-4"/>
                </form>
            </div>
        </div>
    )
}
export default ChatComponent