import { useParams } from "react-router-dom";
import { useSocketcontext } from "@/hooks/useSocketContext";
import { useEffect, useState, useLayoutEffect } from "react";
import { player, category } from "@/types";
import { Button } from "@/components";
import { TopicScreen, CharacterSelect } from "../gamemenu/components";
import { All_Categories } from "@/constants";
import { FaUser } from "react-icons/fa";
import { MiniCharacterSelect } from "../gamemenu/components/CharacterSelect";

type TSearchOnlinePlayersProps = {
  players?: player[] | null;
};

type TcategoryNames =
  | "General_knowledge"
  | "Movie_trivia"
  | "Mythology_trivia"
  | "Music_trivia"
  | "VideoGame_trivia"
  | "Science_Nature_trivia"
  | "Animal_trivia";

type TLobbyProps = {
  invitedPlayers?: player[] | null;
  category: string | TcategoryNames;
  hostname: string | null;
};

type TCategoryDisplayProps = {
  category: TcategoryNames | string;
};

function CategoryDisplay({ category }: TCategoryDisplayProps) {
  let categoryName;
  switch (category) {
    case "Animal_trivia":
      categoryName = "Animal Trivia";
      break;
    case "General_knowledge":
      categoryName = "General Knowledge Trivia";
      break;
    case "Movie_trivia":
      categoryName = "Movie Trivia";
      break;
    case "Music_trivia":
      categoryName = "Music Trivia";
      break;
    case "Mythology_trivia":
      categoryName = "Mythology Trivia";
      break;
    case "Science_Nature_trivia":
      categoryName = "Science & Nature Trivia";
      break;
    case "VideoGame_trivia":
      categoryName = "Video Game Trivia";
      break;
    default:
      break;
  }

  return (
    <div className="">
      <p>Category: {categoryName}</p>
    </div>
  );
}

function SearchOnlinePlayers({ players }: TSearchOnlinePlayersProps) {
  return (
    <ul>
      {players?.map((player, index) => {
        const { controller } = player;
        const { username } = controller;
        return <li key={index}>{username}</li>;
      })}
    </ul>
  );
}

function TopicSwitcher({
  setswitchingCategory,
}: {
  setswitchingCategory: (bool: boolean) => void;
}) {
  const { socket } = useSocketcontext();
  const { room_id } = useParams();

  function handleSwitch(category: string) {
    socket?.emit("SET_CATEGORY", { category, room_id }, (res: string) => {
      console.log(res);
      setswitchingCategory(false);
    });
  }

  return (
    <div className="space-y-4">
      {All_Categories.map((category, index) => (
        <p onClick={() => handleSwitch(category.id)} key={index}>
          {category.name}
        </p>
      ))}
    </div>
  );
}

function characterSwitcher() {
  return (
    <div className="">
      <CharacterSelect />
    </div>
  );
}

interface PlayerBarProps {
  playerReady: boolean;
  characterAvatar: string;
  currentPlayerName: string;
  currentPlayer: player | undefined;
  handleReady: (t: player) => void;
}

function PlayerBar({
  playerReady,
  characterAvatar,
  currentPlayerName,
  currentPlayer,
  handleReady,
}: PlayerBarProps) {
  const [switchingCharacter, setswitchingCharacter] = useState(false);

  return (
    // <div className="">
    //   {!playerReady ? (

    //   ) : (
    //     <MiniCharacterSelect func={(character) => console.log(character)} />
    //   )}
    // </div>

    <div className="relative max-w-xs">
      {/* MAIN PLAYER BAR */}
      <div
        onClick={() => setswitchingCharacter(!switchingCharacter)}
        className="relative flex max-w-xs  items-center justify-between rounded-lg border px-4 py-1 "
      >
        {/* USERNAME AND CHARACTER AVATAR AND ICON */}
        <div className="flex items-center gap-x-2">
          <span className="h-8 w-8 rounded-full border text-sm">
            <img
              className="w-full rounded-full object-contain"
              src={characterAvatar}
              alt=""
            />
          </span>{" "}
          <div className="flex items-center gap-x-2">
            <p className="text-sm font-medium">{currentPlayerName}</p>
            <span className="text-xs">
              <FaUser />
            </span>
          </div>
        </div>

        <div className="flex  items-center gap-x-4">
          {/* READY BUTTON */}
          <div
            onClick={() => handleReady(currentPlayer)}
            className={`group relative flex h-4 w-10 items-center rounded-xl border px-1 ${
              !playerReady ? "bg-gray-200" : "bg-green-400"
            }`}
          >
            <div
              className={`h-2.5 w-2.5 rounded-full border transition-all duration-100 ease-in-out ${
                !playerReady
                  ? "translate-x-0 bg-red-300"
                  : "translate-x-6 bg-green-300"
              }`}
            ></div>
          </div>

          {/* READY TEXT */}
          <div className=" ">
            <p
              className={`text-[10px] font-black ${
                playerReady && "text-green-400"
              }`}
            >
              {!playerReady ? "Not Ready" : "Ready"}
            </p>
          </div>
        </div>
      </div>

      {/* CHARACTER SELECT */}
      {switchingCharacter && (
        <MiniCharacterSelect
          func={(character) => console.log(character.name)}
        />
      )}
    </div>
  );
}

function Lobby() {
  // const category = localStorage.getItem("category")
  const [playerID, setPlayerID] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState<player | undefined>();
  const [host, setHost] = useState<string | player | undefined>("");
  const [allPlayers, setAllPlayers] = useState<undefined | player[]>();
  const [category, setCategory] = useState<category | string>("");
  const [loading, setloading] = useState(true);
  const [switchingCategory, setswitchingCategory] = useState(false);
  const [switchingCharacter, setswitchingCharacter] = useState(false);
  const [playerReady, setplayerReady] = useState(false);

  const { room_id } = useParams();
  console.log(room_id);
  const { socket } = useSocketcontext();

  function handleGameStart() {
    socket?.emit(
      "LAUNCH_ROOM",
      { room_id },
      (res: { category: string; room_id: string; players: player[] }) => {
        console.log(res);
        const { category, room_id, players } = res;

        // TODO: HANDLE NAVIGATION
        console.table([category, room_id, players]);
        // window.location.assign(`/level/${room_id}/${category}`)
      }
    );
  }

  function handleChangeCategory() {
    setswitchingCategory(true);
  }

  function handleReady(player: player) {
    setplayerReady(!playerReady);
    console.log(player);
    socket?.emit("READY_PLAYER", { player, room_id }, (res) => {
      console.log(res);
    });
  }

  type IlobbyPlayerProps = {
    guests: player[];
    host: player[];
    players: player[];
    category: string;
  };

  useLayoutEffect(() => {
    // TODO: GET USERNAME FROM SOMEWHERE ELSE

    socket?.emit("PING_LOBBY", { room_id }, (res: IlobbyPlayerProps) => {
      console.log(res);
      const { players, category } = res;

      // TODO GET USERNAME FROM SOMEWHERE ELSE
      const username = localStorage.getItem("username");

      //* DETERMINE CURRENT USER BY COMPARING USERNAME WITH ALL USERS IN PLAYERS ARRAY
      const currentuser = players.find((player) => player.username == username);
      const host = players.find((player) => player._id == room_id);
      console.log("this is host", host);

      //  * SET PLAYER ID TO DETERMINE HOST ID LATER
      console.log(currentuser);
      setCurrentPlayer(currentuser);
      setAllPlayers(players);
      setPlayerID(currentuser._id);
      setHost(host);
      setCategory(category);
      setloading(false);

      //TODO: DETERMINE WHEN TO STOP LOADING
      // setloading(false)
    });

    // socket?.on("JOINED_HOST_ROOM", (res) => {
    //   console.log(res)
    // })
  }, [socket]);

  useEffect(() => {
    socket?.on("ROOM_READY", (res: { category: string; room_id: string }) => {
      const { category, room_id } = res;
      window.location.assign(`/level/${room_id}/${category}`);
    });

    socket?.on("CATEGORY_CHANGE", (res: { category: category }) => {
      const { category } = res;
      console.log(category);
      setCategory(category);
    });

    socket?.on("PLAYER_READY", (res) => {
      console.log(res);
    });
  }, [socket]);

  if (loading) {
    return <p>...loading</p>;
  }

  // DESTRUCTURE HOST NAME AND NEEDED VARIABLES FROM HOST
  const { username: hostname } = host;
  const { username: currentPlayerName, characterAvatar } = currentPlayer;
  console.log(characterAvatar);

  return (
    <>
      {!switchingCategory && !switchingCharacter ? (
        <div>
          {/* DISPLAY ROOM CONTROLS ONLY IF PLAYER ID IS EQUAL TO ROOM ID */}
          {room_id == playerID && (
            <div className="">
              <p>This is Your Lobby</p>

              <div className="mt-4 flex items-center justify-between">
                <Button onClick={() => handleGameStart()}>Start Game</Button>
                <Button onClick={() => handleChangeCategory()}>
                  Change Category
                </Button>
              </div>
            </div>
          )}

          <div className="px-4 pt-10">
            <div className="py-20">
              <p>Host: {hostname}</p>
              <CategoryDisplay category={category} />
            </div>

            {/* DISPLAY CURRENT PLAYER EXCEPT HOST */}

            {room_id != playerID && (
              <PlayerBar
                playerReady={playerReady}
                currentPlayer={currentPlayer}
                currentPlayerName={currentPlayerName}
                characterAvatar={characterAvatar}
                handleReady={handleReady}
              />
            )}

            {/*DISPLAY ALL OTHER PLAYERS EXCEPT CURRENT PLAYER  */}

            {/* OTHER PLAYERS COMPONENT */}
            <div className="py-4">
              <p>Other Players</p>
              {allPlayers?.map((player, index) => {
                if (player.username == currentPlayerName) {
                  return "";
                }

                // return <p key={index}>{player.username}</p>;
                return (
                  <div key={index} className="">
                    <PlayerBar
                      currentPlayer={player}
                      playerReady={playerReady}
                      currentPlayerName={player.username}
                      characterAvatar={player.characterAvatar}
                      handleReady={handleReady}
                    />
                  </div>
                );
              })}
            </div>
            {/*  */}
          </div>
        </div>
      ) : (
        <TopicSwitcher setswitchingCategory={setswitchingCategory} />
      )}
    </>
  );
}

export default Lobby;
