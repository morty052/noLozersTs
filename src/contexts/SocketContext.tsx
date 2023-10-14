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
import { useUser } from "@clerk/clerk-react";
import { message } from "antd";
import { InvitationModal } from "@/components";

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
  const [inviteReceived, setinviteReceived] = useState(false);
  const [host, sethost] = useState([]);

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

  const { isSignedIn, user, isLoaded } = useUser();

  const { username } = user || {};

  const SendHandShake = () => {
    if (!isSignedIn) {
      socket.emit("handshake", { isGuest: true });
      setloading(false);
      return;
    }
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
    SendHandShake();
  }, [isSignedIn, socket]);

  useEffect(() => {
    socket?.on("FRIEND_REQUEST_RECEIVED", (data) => {
      /*
       * DISPLAY FRIEND REQUEST
       TODO: UPDATE NOTIFICATIONS
       */

      const { username } = data;
      message.info(`Friend request received from ${username}`);
      setinviteReceived(true);
    });

    socket?.on("INVITATION", (res) => {
      /*
       * OPEN MODAL / STORE HOST'S USERNAME AND ROOM_ID
       * ROOM_ID IS ALWAYS THE SAME AS THE HOST'S _ID GOTTEN FROM INVITATION
       */
      console.log(res);
      sethost(res);
      setinviteReceived(true);
    });

    socket?.on("JOIN_HOST_ROOM", (res) => {
      const { _id } = res;
      console.log(res);

      window.location.assign(`/lobby/${_id}`);
    });
  }, [socket]);

  if (loading) {
    return <h3>Loading</h3>;
  }

  return (
    <SocketContext.Provider value={{ SocketState, SocketDispatch, socket }}>
      {children}
      {inviteReceived && (
        <InvitationModal
          host={host}
          closeModal={() => setinviteReceived(false)}
        />
      )}
    </SocketContext.Provider>
  );
};
