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
import { characterName } from "@/classes/Player";
import { UserButton, useUser } from "@clerk/clerk-react";
import BottomNav from "@/components/BottomNav";
import {
  FaBell,
  FaClock,
  FaCog,
  FaTicketAlt,
  FaUserFriends,
} from "react-icons/fa";
import { message } from "antd";
import background from "../../assets/background.jpeg";

const Header = () => {
  const { isSignedIn, user } = useUser();
  return (
    <header className=" fixed top-0 z-[50] flex w-full items-center justify-between p-2 text-white">
      <div className="flex items-center gap-x-2 text-xl">
        <UserButton />
        <Link to={"/login"}>{isSignedIn ? `${user.username}` : "Sign in"}</Link>
      </div>

      <div className="flex items-center gap-x-2 text-xl">
        <FaCog />
        <FaBell />
      </div>
    </header>
  );
};

type TSearchOnlinePlayersProps = {
  players: player[];
  handleInvite: (s: string | undefined) => void | undefined;
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
      name: "Single Player",
      to: "/room/category",
    },
    {
      name: "Public Match",
      to: "/menu/searchplayers",
    },
    // * SEND USER TO CATEGORY SCREEN INITIALLY
    // * FOR USER TO BE SENT BACK TO CREATEROOM/CREATEDROOMID
    {
      name: "Private match",
      to: "/category",
    },
  ];

  if (mode == "OFFLINE") {
    return <p>Playing Single Player</p>;
  }

  return (
    <>
      <div className="flex flex-col items-center  gap-y-8 ">
        {menuItems.map((option, index: number) => {
          const { name, to } = option;

          return (
            <Link className="z-[50] w-full" key={index} to={`${to}`}>
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
  const [menuOpen, setmenuOpen] = useState(false);

  // TODO CHANGE LOCATION OF HOST
  // const [host, sethost] = useState([]);

  const { socket } = useSocketcontext();

  const [MenuState, MenuDispatch] = useReducer(MenuReducer, defaultMenuState);

  const { invitationReceived, host } = MenuState;

  useEffect(() => {
    //* HANDLE INCOMING INVITATION ON GUEST SIDE
    socket?.on("INVITATION", (res) => {
      console.log("inite received");
      /*
       * OPEN MODAL / STORE HOST'S USERNAME AND ROOM_ID
       * ROOM_ID IS ALWAYS THE SAME AS THE HOST'S _ID GOTTEN FROM INVITATION
       */
      console.log(res);

      // !ORIGINAL FUNCTION
      MenuDispatch({ type: "HANDLE_INVITE", payload: res });

      // sethost(res);
    });

    socket?.on("FRIEND_REQUEST_RECEIVED", (data) => {
      /*
       * DISPLAY FRIEND REQUEST
       TODO: UPDATE NOTIFICATIONS
       */

      const { username } = data;
      message.info(`Friend request received from ${username}`);
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
    socket?.emit("FINDING_ONLINE_USERS", (res: player[]) => {
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

  function MenuRoutes(params: type) {
    return (
      <>
        <Routes>
          <Route path="/" element={<GameOptions />} />
          {/* <Route path="/options/:mode" element={<MenuOptions />} /> */}

          <Route path="/createroom/category" element={<CreateRoom />} />

          <Route path="/createroom/:room_id" element={<CreateRoom />} />

          <Route
            path="/searchplayers"
            element={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setcategory={(id: string) => console.log(id)}
                categories={All_Categories}
              />
            }
          />
          <Route
            path="/selectcharacter"
            element={
              <CharacterSelect func={(id: characterName) => console.log(id)} />
            }
          />
          <Route path="/test" element={<Test />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="relative z-10 min-h-screen bg-gradient-to-b  from-purple-900 to-gray-700 px-2 pt-16">
        {menuOpen && <MenuOptions />}
        <MenuRoutes />
        {!menuOpen && (
          <div className="absolute inset-x-0 top-20 z-[50] mx-auto flex w-full items-center justify-between px-4 ">
            <div className=" flex w-28 items-center justify-center gap-x-6  rounded-br-lg rounded-tl-lg bg-white  px-4 py-2 shadow-2xl shadow-gray-800 ">
              <FaTicketAlt />
              <span>0</span>
            </div>
            <div className=" flex w-28 items-center justify-center gap-x-6  rounded-br-lg rounded-tl-lg bg-white  px-4 py-2 shadow-2xl shadow-gray-800 ">
              <FaUserFriends />
              <span>0</span>
            </div>
            <div className=" flex w-28 items-center justify-center gap-x-6  rounded-br-lg rounded-tl-lg bg-white  px-4 py-2 shadow-2xl shadow-gray-800 ">
              <FaClock />
              <span>0</span>
            </div>
          </div>
        )}

        {/* BACKGROUND IMAGE */}
        <>
          <div className="absolute inset-0  bg-black  ">
            <img
              className="h-full w-full bg-no-repeat object-cover"
              src={background}
              alt=""
            />
          </div>
        </>
      </div>
      {/* INVITATION MODAL */}
      {/* {invitationReceived && (
        <InvitationModal
          host={host}
          closeModal={() => closeModal()}
          socket={socket}
        />
      )} */}

      <BottomNav menuOpen={menuOpen} setMenuOpen={setmenuOpen} />
    </>
  );
}

export default GameMenu;
