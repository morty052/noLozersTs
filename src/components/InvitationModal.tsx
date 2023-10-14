import { Button } from ".";
import { Socket } from "socket.io-client";
import { useSocketcontext } from "@/hooks/useSocketContext";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

type host = {
  username: string;
  socket_id: string;
  _id: string;
};

type InviteModalProps = {
  closeModal: () => void;
  socket: Socket | null;
  host: host;
};

function InvitationModal({ closeModal, host }: InviteModalProps) {
  const [modalOpen, setmodalOpen] = useState(false);

  // TODO GET USERNAME FROM SOMEWHERE ELSE
  // const username = localStorage.getItem("username");

  const { user, isLoaded } = useUser();
  const username = user?.username;

  const { socket } = useSocketcontext();

  function handleAccept() {
    console.log(host);
    socket?.emit("JOIN_USER", {
      username,
      host: host?.username,
      _id: host?._id,
    });
    closeModal();
  }

  function handleReject() {
    closeModal();
  }

  return (
    <div className="fixed inset-0 z-[100] grid  place-content-center bg-black/20">
      <p className="text-5xl text-white">Invite Received</p>

      <div className="">
        <Button onClick={() => handleAccept()}>Accept</Button>
        <Button onClick={() => handleReject()} variant={"destructive"}>
          Reject
        </Button>
      </div>
    </div>
  );
}

export default InvitationModal;
