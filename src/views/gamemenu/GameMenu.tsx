import { useState, useEffect, useReducer } from "react";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { Button, InvitationModal } from "../../components";
import MenuReducer, { defaultMenuState } from "@/reducers/MenuReducer";
import { player } from "@/types/player";
import {
  TopicScreen,
  CharacterSelect,
  GameOptions,
  CreateRoom,
} from "./components";
import { Routes, Route, Link, useParams } from "react-router-dom";
import { All_Categories } from "@/constants";

type TSearchOnlinePlayersProps = {
  players: player[];
  handleInvite: (s: string | undefined) => void;
  handleSearchPlayers: () => void;
};

function SearchOnlinePlayers({
  players,
  handleInvite,
  handleSearchPlayers,
}: TSearchOnlinePlayersProps) {
  return (
    <>
      {/* ONLINE PLAYERS BOX */}
      <ul className="mx-auto space-y-4 border-2 border-black p-4">
        <p>Online players:</p>
        {players?.map((player, index) => (
          <li
            onClick={() => handleInvite(player.socket)}
            className="text-3xl text-black"
            key={index}
          >
            {player.username}
          </li>
        ))}
      </ul>

      {/* ONLINE PLAYERS BUTTON */}
      <div className="mx-auto mt-8 w-fit ">
        <Button onClick={() => handleSearchPlayers()} className="">
          Search Online Players
        </Button>
      </div>
    </>
  );
}

// type TmenuOptionsProps = {
//   mode:string
// }

function MenuOptions() {
  const { mode } = useParams();

  const menuItems = [
    {
      name: "Select Character",
      to: "/menu/selectcharacter",
    },
    // {
    //   name: "Select Category",
    //   to: "category",
    // },
    // * SEND USER TO CATEGORY SCREEN INITIALLY
    // * FOR USER TO BE SENT BACK TO CREATEROOM/CREATEDROOMID
    {
      name: "Create Room",
      to: "/menu/createroom/category",
    },
    {
      name: "Join Room",
      to: "category",
    },
    {
      name: "Search Online Players",
      to: "/menu/searchplayers",
    },
    {
      name: "Send Message",
      to: "/menu/test",
    },
  ];

  if (mode == "OFFLINE") {
    return <p>Playing Single Player</p>;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-y-8 bg-red-300">
        {menuItems.map((option, index: number) => {
          const { name, to } = option;

          return (
            <Link className="w-full" key={index} to={`${to}`}>
              <Button className="w-full ">{name}</Button>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function Test() {
  const { socket } = useSocketcontext();

  function sendMessage(_id: string) {
    socket?.emit("MESSAGE", { _id });
  }

  useEffect(() => {
    socket?.on("NEW_MESSAGE", (msg: string) => {
      console.log(msg);
    });
  }, [socket]);

  return (
    <div className="p-4">
      <Button onClick={() => sendMessage("A2qL6VApcYZGeRHA8QBFIe")}>
        Test
      </Button>
    </div>
  );
}

function GameMenu() {
  const [players, setPlayers] = useState<[] | player[]>([]);

  const { socket } = useSocketcontext();

  const [MenuState, MenuDispatch] = useReducer(MenuReducer, defaultMenuState);

  const { invitationReceived, host, mode } = MenuState;
  const { host_room } = host;

  useEffect(() => {
    //* HANDLE INCOMING INVITATION ON GUEST SIDE
    socket?.on("INVITATION", (res) => {
      /*
       * OPEN MODAL / STORE HOST'S USERNAME AND ROOM_ID
       * ROOM_ID IS ALWAYS THE SAME AS THE HOST'S _ID GOTTEN FROM INVITATION
       */
      console.log(res);
      MenuDispatch({ type: "HANDLE_INVITE", payload: res });
    });

    // * HANDLE INVITATION ACCEPTED ON GUEST SIDE
    // TODO: DO SOMETHING WITH THE ROOM_ID GOTTEN FROM EVENT
    // TODO GET CATEGORY FROM RES
    socket?.on("JOIN_HOST_ROOM", (res) => {
      const { category, _id } = res;
      console.log(res);

      window.location.assign(`/lobby/${_id}/${category}`);
    });
  }, [socket]);

  function handleSearchPlayers() {
    socket?.emit("FINDING_ONLINE_USERS", (res) => {
      console.log(res);
      setPlayers(res);
    });
  }

  // function handleInvite(socket_id: string | undefined) {
  //   socket?.emit("SEND_INVITATION", { socket_id, username });
  // }

  function closeModal() {
    MenuDispatch({ type: "CLOSE_MODAL" });
  }

  // function handleMode(mode:string) {
  //   if (mode == "OFFLINE") {
  //     console.log(mode)
  //     return MenuDispatch({type:'SET_SINGLE_PLAYER'})
  //   }
  //  else if (mode == "ONLINE") {
  //     console.log(mode)
  //     return MenuDispatch({type:"SET_MULTIPLAYER"})
  //   }

  // }

  return (
    <>
      <Routes>
        <Route path="/" element={<GameOptions />} />
        <Route path="/options/:mode" element={<MenuOptions />} />

        <Route path="/createroom/category" element={<CreateRoom />} />

        <Route path="/createroom/:room_id" element={<CreateRoom />} />

        <Route
          path="/searchplayers"
          element={
            <SearchOnlinePlayers
              players={players}
              // handleInvite={handleInvite}
              handleSearchPlayers={handleSearchPlayers}
            />
          }
        />
        <Route
          path="/category"
          element={
            <TopicScreen
              setcategory={(id: string) => console.log(id)}
              categories={All_Categories}
            />
          }
        />
        <Route
          path="/selectcharacter"
          element={<CharacterSelect func={(id: string) => console.log(id)} />}
        />
        <Route path="/test" element={<Test />} />
      </Routes>
      {/* INVITATION MODAL */}
      {invitationReceived && (
        <InvitationModal
          host={host}
          closeModal={() => closeModal()}
          socket={socket}
        />
      )}
    </>
  );
}

export default GameMenu;
