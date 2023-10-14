import { useState, useEffect, useReducer } from "react";
import { useSocketcontext } from "@/hooks/useSocketContext";
import { player } from "@/types/player";
import { Tabs, TabsContent, TabsList, TabsTrigger, Button } from "@/components";
import { Lobby } from "@/views";
import { message } from "antd";
import { Routes, Route, useParams } from "react-router-dom";
import { useUserContext } from "@/contexts/userContext";
import { useSignIn } from "@clerk/clerk-react";

function SignInStep() {
  const { isLoaded, signIn } = useSignIn();

  if (!isLoaded) {
    // handle loading state
    return null;
  }

  return <div>The current sign in attempt status is {signIn.status}.</div>;
}

const defaultRoomState = {
  roomCreated: false,
  category: "",
  invitedPlayers: [],
  friends: [],
  players: [],
};

type Tactions =
  | "FETCH_FRIENDS"
  | "SET_CATEGORY"
  | "FETCH_PLAYERS"
  | "CREATE_ROOM"
  | "ADD_GUEST"
  | "SEND_INVITE";

type TroomActions = {
  type: Tactions;
  payload?: unknown;
};

type TroomProps = {
  invitedPlayers: player[];
  category: string;
  hostname: string;
  friends: player[];
  invitePlayer: (
    s: string | undefined,
    u: string,
    r: string
  ) => void | undefined;
  addGuest: (s: string | undefined, s2: string | undefined, s3: string) => void;
  room_id: string;
};

type TdefaultState = {
  roomCreated: boolean;
  category: string;
  friends: player[] | [];
  players: player[] | [];
  invitedPlayers: player[] | [];
};

function createRoomReducer(state: TdefaultState, action: TroomActions) {
  const { type, payload } = action;
  const {
    friends,
    category,
    players,
    guest,
    room_id,
    addGuest,
    inviteFunction,
    guestSocket,
    hostName,
  } = payload ? payload : [];

  switch (type) {
    case "FETCH_FRIENDS":
      return { ...state, friends: friends };

    case "FETCH_PLAYERS":
      return { ...state, players: players };

    case "SET_CATEGORY":
      localStorage.setItem("category", category);
      return { ...state, category: category };

    case "SEND_INVITE":
      console.log(room_id);

      inviteFunction(guestSocket, hostName, room_id);
      return { ...state };

    case "ADD_GUEST":
      state.invitedPlayers = [...state.invitedPlayers, guest];
      console.log(guest._id);
      // * GET ROOM_ID as HOST_ID FROM PAYLOAD
      // * GET DESTRUCTURED GUEST USERNAME FROM PAYLOAD
      // ! SEND GUEST USERNAME TO BE DISPLAYED AS POPUP ON HOST SIDE
      addGuest(guest._id, payload.host_id, guest.username);
      return { ...state };

    case "CREATE_ROOM":
      state.roomCreated = room_id;
      return { ...state };

    default:
      return { ...state };
  }
}

function OnlineFriends(friends, invitePlayer, room_id) {
  const { username } = useUserContext();
  console.log(friends);
  if (!friends) {
    return <div>Loading</div>;
  }

  return (
    <div className="mt-10">
      <p>Online Friends:</p>
      <div className="">
        {friends?.friends.map((player: player, index: number) => (
          // * GET TARGET PLAYER ID
          // ? AND USERNAME
          <p
            onClick={() => invitePlayer(player._id, username, room_id)}
            key={index}
          >
            {player.username}
          </p>
        ))}
      </div>
    </div>
  );
}

function BottomNav() {
  return (
    <div className="fixed bottom-2 left-0 flex w-full justify-center  bg-red-300">
      <div className="w-4/5 border">
        <p>yoo hoo</p>
      </div>
    </div>
  );
}

function Search({
  playerName,
  setplayerName,
  handleCreation,
  invitePlayer,
  players,
}) {
  // * FILTER PLAYERS USING SEARCH QUERY
  const results =
    players?.length > 1
      ? players.filter((player: player) => player.username.includes(playerName))
      : [];
  return (
    <div className="">
      <form action="">
        <div className="flex flex-col gap-y-4">
          <div className="relative">
            <input
              value={playerName}
              onChange={(e) => setplayerName(e.target.value)}
              className="h-10 w-full rounded-lg border p-2 placeholder:text-center"
              placeholder="Type to search players"
              type="text"
              name=""
              id=""
            />
            <p className="mt-1 text-center text-xs text-gray-600">
              Search players by username to add to your private room
            </p>

            <aside
              className={`${
                !playerName ? "hidden" : "block"
              } absolute inset-x-0 top-12 z-10 rounded-xl border bg-white p-4 shadow-xl`}
            >
              Display message if no results match search
              {playerName && results.length < 1 && (
                <p>No results match your search</p>
              )}
              {results?.map((player: player, index: number) => (
                <p
                  onClick={() => {
                    invitePlayer(player.socket);
                    setplayerName("");
                  }}
                  key={index}
                >
                  {player.username}
                </p>
              ))}
              <div className="mt-2 bg-red-300">
                <p>Click on player to send invite</p>
              </div>
            </aside>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleCreation();
            }}
          >
            Search Players
          </Button>
        </div>
      </form>
    </div>
  );
}

export function Room({ friends, invitePlayer, room_id }: TroomProps) {
  // TODO:change username location
  const { username } = useUserContext();

  console.log("this is room", room_id);

  return (
    <>
      <Tabs defaultValue="ONLINE_FRIENDS" className="">
        <TabsList>
          <TabsTrigger value="ONLINE_FRIENDS">Friends</TabsTrigger>
          <TabsTrigger value="SEARCH_FRIENDS">Search</TabsTrigger>
          <TabsTrigger value="LOBBY">Lobby</TabsTrigger>
        </TabsList>

        <TabsContent value="ONLINE_FRIENDS">
          {/* <div className="mt-10">
            <p>Online Friends:</p>
            <div className="">
              {friends?.map((player: player, index: number) => (
                // * GET TARGET PLAYER ID
                // ? AND USERNAME
                <p
                  onClick={() => invitePlayer(player._id, username, room_id)}
                  key={index}
                >
                  {player.username}
                </p>
              ))}
            </div>
          </div> */}
        </TabsContent>

        <TabsContent value="SEARCH_FRIENDS">
          {/* <div className="">
      <form action="">
        <div className="flex flex-col gap-y-4">
          <div className="relative">
            <input
              value={playerName}
              onChange={(e) => setplayerName(e.target.value)}
              className="h-10 w-full rounded-lg border p-2 placeholder:text-center"
              placeholder="Type to search players"
              type="text"
              name=""
              id=""
            />
            <p className="mt-1 text-center text-xs text-gray-600">
              Search players by username to add to your private room
            </p>

            <aside
              className={`${
                !playerName ? "hidden" : "block"
              } absolute inset-x-0 top-12 z-10 rounded-xl border bg-white p-4 shadow-xl`}
            >
              Display message if no results match search
              {playerName && results.length < 1 && (
                <p>No results match your search</p>
              )}
              {results?.map((player: player, index: number) => (
                <p
                  onClick={() => {
                    invitePlayer(player.socket)
                    setplayerName("");
                  }}
                  key={index}
                >
                  {player.username}
                </p>
              ))}

              <div className="mt-2 bg-red-300">
                <p>Click on player to send invite</p>
              </div>
            </aside>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleCreation();
            }}
          >
            Search Players
          </Button>
        </div>
      </form>

      
    </div> */}
        </TabsContent>

        <TabsContent value="LOBBY">
          <Lobby />
        </TabsContent>
      </Tabs>
    </>
  );
}

function CreateRoom() {
  // * PLAYER SEARCH QUERY
  const [playerName, setplayerName] = useState("");

  const [RoomState, CreateRoomDispatch] = useReducer(
    createRoomReducer,
    defaultRoomState
  );

  const { roomCreated, category, friends, players, invitedPlayers } = RoomState;
  const { room_id } = useParams();
  console.log("this is room", room_id);

  const { socket } = useSocketcontext();

  // TODO:Change username location
  const { username } = useUserContext();

  // * CREATE ROOM FUNCTION
  function handleCreation(category: string) {
    // * SEND EVENT TO SERVER TO CREATE ROOM FROM CLIENT SIDE
    socket?.emit("CREATE_ROOM", { username, category }, (res) => {
      // *DISPATCH CREATE ROOM EVENT / SAVE ROOM ID TO EVENT STATE
      CreateRoomDispatch({ type: "CREATE_ROOM", payload: { room_id: res } });
      window.location.assign(`/menu/createroom/${res}`);
    });
  }

  // *SET CATEGORY FUNCTION
  function setCategory(category: string) {
    CreateRoomDispatch({ type: "SET_CATEGORY", payload: { category } });
    // * CALL CREATE ROOM FUNCTION AFTER HANDLING CATEGORY
    handleCreation(category);
  }

  // * ADD GUEST TO BACKEND ROOM FUNCTION
  // ! FUNCTION IS CALLED FROM INSIDE REDUCER
  function addGuest(guest: player, id: string | boolean, guestName: string) {
    socket?.emit(
      "ADD_GUEST",
      { guestRef: guest, room_id: id, guestName },
      (username: string) => {
        console.log(guest);
        message.info(`${username} joined your room`);
      }
    );
  }

  // *FETCH FRIENDS AND PLAYERS
  useEffect(() => {
    // * FETCH ONLY FRIENDS OF CURRENT PLAYER
    async function fetchFriends() {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "insomnia/8.0.0",
        },
        body: `{"username":"${username}"}`,
      };
      const { onlineFriends } = await fetch(
        "http://localhost:3000/friends",
        options
      )
        .then((res) => res.json())
        .then((res) => res);
      console.log(onlineFriends.length);
      CreateRoomDispatch({
        type: "FETCH_FRIENDS",
        payload: { friends: onlineFriends },
      });
    }

    //  * FETCH ALL PLAYERS
    async function fetchPlayers() {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"username":"${username}"}`,
      };
      const { players } = await fetch("http://localhost:3000/players", options)
        .then((res) => res.json())
        .then((res) => res);
      console.log(players.length);

      CreateRoomDispatch({
        type: "FETCH_PLAYERS",
        payload: { players: players },
      });
    }

    fetchFriends();
    fetchPlayers();
  }, [username]);

  // *SOCKET LISTENERS
  useEffect(() => {
    // * EVENT FIRED ON SERVER SIDE TO HANDLE ALL INCOMING PLAYERS
    // * FUCTION TO HANDLE INVITATION ACCEPTED ON HOST SIDE
    socket?.on("INVITATION_ACCEPTED", (data) => {
      const { guestRef, host_id } = data;
      console.log(guestRef, host_id);
      /* 
      * SAVE INCOMING PLAYER TO APP STATE AS "guestRef"
      * GET host_id FROM EVENT 
      * EMIT "room_id" AS "host_id" TO SOCKET FOR GUEST SOCKET AND GUEST TO JOIN
      ! THIS FUNCTION FIRES "ADD_GUEST" EVENT DISPATCH TO REDUCER
      ! THIS FUNCTION CALLS "addGuest" FUNCTION FROM REDUCER BY PASSING IT AS A PAYLOAD 
      ! THIS FUNCTIONS SENDS GUEST USERNAME TO RENDER AS POPUP
      */

      // * FIRE ADD_GUEST DISPATCH WHEN THIS EVENT IS CALLED ON SERVER SIDE
      CreateRoomDispatch({
        type: "ADD_GUEST",
        payload: { guest: guestRef, addGuest: addGuest, host_id },
      });
    });
  }, [socket]);

  // * INVITE PLAYER FUNCTION
  function invitePlayer(
    _id: string | undefined,
    hostName: string | null,
    room_id?: string
  ) {
    /* 
      TODO:CHANGE USERNAME LOCATION FROM LOCAL STORAGE
      TODO:ADD ROOM_ID TO INVITATION REQUEST
      * THE USERNAME IS THE USERNAME OF THE SENDER
      * THE SOCKET ID BELONGS TO TARGET USER
      */

    // !original function
    // socket?.emit("SEND_INVITATION", { socket_id, username:hostName, room_id });

    socket?.emit("SEND_INVITATION", { _id, username: hostName, room_id });
  }

  return (
    <div className="p-4">
      <Routes>
        {/* <Route path="/" element={<TopicScreen
        categories={All_Categories}
        setcategory={(category: string) => setCategory(category)} />} /> */}
        <Route
          path="/"
          element={
            <Room
              setCategory={setCategory}
              room_id={room_id}
              hostname={username}
              invitedPlayers={invitedPlayers}
              category={category}
              invitePlayer={invitePlayer}
              friends={friends}
            />
          }
        />
        <Route
          path="/search"
          element={
            <Search
              playerName={playerName}
              invitePlayer={invitePlayer}
              handleCreation={handleCreation}
              setplayerName={setplayerName}
              players={players}
            />
          }
        />
        <Route
          path="/friends"
          element={
            <OnlineFriends
              friends={friends}
              room_id={room_id}
              invitePlayer={invitePlayer}
            />
          }
        />
        <Route path="/test" element={<SignInStep />} />
      </Routes>
      <BottomNav />
      {/* {!category && (
        <TopicScreen
          categories={All_Categories}
          setcategory={(category: string) => setCategory(category) }
        />
      )} */}
    </div>
  );
}

export default CreateRoom;
