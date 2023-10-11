import { Socket } from "socket.io-client"
import { ContextState, ISocketActions, ISocketContextState } from "../types/types"


export  const defaultContextState :ISocketContextState = {
    socket:undefined,
    uid:"",
    users:[],

  }

const SocketReducer =  (state :ContextState,action :ISocketActions,) => {
    console.info(`Message Received - Action : ${action} payload: ${action.payload}`)
  
    switch (action.type) {
      case "update_socket":
        return {...state, socket:action.payload as Socket}

      case "join_room":
         state.socket?.emit("join_room", action.payload,action.payload?.callBack)
        return {...state}

      case "set_user":
         state.socket?.emit("set_user", action.payload )
        return {...state}

      case "ping_room":
         state.socket?.emit("ping_room", action.payload, action.payload?.callBack  )
        return {...state}
      
    

      default:
        return {...state}
        
    }
  }


  export default SocketReducer