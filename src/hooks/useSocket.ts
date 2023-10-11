import { io,} from "socket.io-client";
import { useEffect, useRef,  } from "react";

const useSocket = (uri, opts) => {

  const {current:socket} = useRef(io(uri,opts))

  // const [socket, setsocket] = useState(io("http://localhost:5173"))

useEffect(() => {
  return () => {
    if (socket) socket.close()
  }
}, [socket])


   return socket
   
}

export default useSocket