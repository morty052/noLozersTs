import {
  createContext,
  useState,
  useEffect,
  useReducer,
  Dispatch,
  ReactNode,
} from "react";
import useSocket from "../hooks/useSocket";
import SocketReducer, { defaultContextState } from "../reducers/SocketReducer";
import { Socket } from "socket.io-client";
import { useUserContext } from "./userContext";

interface IsocketProps {
  socket: Socket | null;
  SocketState: null;
  SocketDispatch: Dispatch<void>;
}

export const SocketContext = createContext<IsocketProps>({
  socket: null,
  SocketState: null,
  SocketDispatch: () => {},
});

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // const socket = useSocket("https://snapdragon-cerulean-pulsar.glitch.me/",{
  const socket = useSocket("http://localhost:5000/user", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
  });

  const StartListeners = () => {
    socket.on("connect", () => {
      console.log("connected");
    });

    // socket.on("newmessage",(msg)=>{
    //   console.log("message")
    //   Alert.success(`message sent`)
    // })

    socket.on("reconnect", (attempt) => {
      console.log("Reconnect Attempt" + attempt);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log("Reconnect Attempt" + attempt);
    });

    socket.io.on("reconnect_error", (error) => {
      console.log("Reconnect Attempt" + error);
    });

    socket.io.on("reconnect_failed", () => {
      console.info("Reconnect Failed");
    });
  };

  const { username } = useUserContext();

  const SendHandShake = () => {
    socket.emit("handshake", { username });
    setloading(false);
  };

  const [loading, setloading] = useState(true);
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultContextState
  );

  useEffect(() => {
    // Connect to socket
    socket.connect();

    //  save socket with reducer to state
    SocketDispatch({ type: "update_socket", payload: socket });

    // Start the event listeners
    StartListeners();

    // send handshake
    if (!username) {
      return;
    }
    SendHandShake();
  }, [socket, username]);

  if (loading) {
    return <h3>Loading</h3>;
  }

  return (
    <SocketContext.Provider value={{ SocketState, SocketDispatch, socket }}>
      {children}
    </SocketContext.Provider>
  );
};
