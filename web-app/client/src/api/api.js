import axios from "axios";

const Api = {
    get_messages(sender, receiver) {
        return axios
          .post("http://127.0.0.1:8000/get",{"sender":sender,"receiver":receiver})
          .then((res) => res.data);
      },
    send_message(sender, receiver, message) {
        return axios
          .post("http://127.0.0.1:8000/send",{"sender":sender,"receiver":receiver,"message":message})
    },
    show_account(account){
      return axios
        .post("http://127.0.0.1:8000/show",{"account":account})
    }
}

export default Api;