import ChatContract from "../contracts/ChatContract.json";
import React from 'react'

const ChatComponent = ()=>{
    return(
        <div>
            <div class="card">
                <h1>Chat</h1>
                <h1>txt</h1>
                <h1>txt</h1>
                <h1>txt</h1>
                <input name="msg" type="text" placeholder="Text a Message" class="form-control rounded-0 border-0 my-4 w-75 mx-4"/>
            </div>
        </div>
    )
}
export default ChatComponent