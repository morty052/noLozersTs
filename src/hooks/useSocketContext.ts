import { SocketContext } from "../contexts/SocketContext";
import { useContext } from "react";

export const useSocketcontext = () =>  useContext(SocketContext)