import ChatContract from "../contracts/ChatContract.json";
import React from 'react';
import { useEffect, useState,useRef } from "react";
import { Button } from 'primereact/button';
import Web3 from "web3";
import ChatContractNotDeployed from "../contracts/ChatContract.json";
import Api from "../api/api";

const ChatComponent = (props)=>{
    const [time, setTime] = useState(Date.now());
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

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
    return(
        <div>
            <div class="card">
                <div class="card-header">
                    <p><b>{props.receiver}</b></p>
                </div>
                {messages.map(message => <div><b>{who(message)}:</b> {message.message}</div>)}                
                
                <form id="msgForm" onSubmit={sendMessage}>
                    <input name="msg" type="text" value={message} placeholder="Text a Message" onChange={msgHandler} class="form-control rounded-0 border-0 my-4 w-75 mx-4"/>
                </form>
            </div>
        </div>
    )
}
export default ChatComponent