import React from 'react';
import { useEffect, useState,useRef } from "react";
import Api from "../api/api";
import { Chip } from 'primereact/chip';
import '../css/Chip.css';
import { ListBox } from 'primereact/listbox';

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

    function printMsg(messages){
        return messages.map(message => <div className="flex flex-wrap " align={who(message) == "You"? "right" : "left"}>
        <Chip label={<div><b>{who(message)}:</b> {message.message}</div>} icon={who(message) == "You"? "pi pi-user" : "pi pi-user-edit"} className={"mr-2 mb-2 "+ who(message)} />
        </div>)
        
    }
    
    function scrollHandler(e){
        props.setReceiver(e.value)
        window.scrollTo(0, 0)
    }


    return(
        <div class="chat">
            <div class="card">
                <div class="card-header">
                    <p><b>{props.receiver.toString().slice(0,6)+"..."+props.receiver.toString().slice(37,43)}</b></p>
                </div>
                <br></br>
                <div class="card-body-chat">
                    <p>{printMsg(messages)}</p>
                </div>           
                <div class="form-group text-center">
                    <form id="msgForm" class ="" onSubmit={sendMessage}>
                        <div class="input-group">
                            <input name="msg" type="text" value={message} placeholder="Text a Message" onChange={msgHandler} class="form-control rounded-0 border-1 my-4 w-75 mx-4"/>
                        </div>
                    </form>
                </div>
                <div class="card-header">
                    <p><b>Direct Messages</b></p>
                </div>
                <ListBox listStyle={{ height: '250px' }} options={props.communications} onChange={(e) => scrollHandler(e)}/>
            </div>
        </div>
    )
}
export default ChatComponent