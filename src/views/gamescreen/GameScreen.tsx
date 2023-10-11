/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { useEffect, useRef, useState, useReducer } from "react";
import { TopicScreen, GameOptions, CharacterSelect } from "../gamemenu/components";
import setupReducer, { setupActions, state } from "./setupReducer";
import UsernameInput from "./components/UsernameInput"

function GameScreen() {
  const [username, setUsername] = useState("");
  const [players, setplayers] = useState([]);
  const [GameSetupState, SetupDispatch] = useReducer(setupReducer, state);

  const { socket, SocketDispatch } = useSocketcontext();
  const { multiPlayer, singlePlayer, categories, category, playModeSet, character, characterSet } =
    GameSetupState;
  const { PLAY_ONLINE, PLAY_ALONE, SET_CATEGORY, SET_CHARACTER } = setupActions;

  const room = useParams().room;
  const userRef = useRef("");

  const setUser = () => {
    userRef.current = username;

    if (singlePlayer) {
      return socket?.emit(
        "SET_USER",
        { username: userRef.current, category, singlePlayer: true, character },
        (res) => {
          setplayers(res.players);
        }
      );
    }

    socket?.emit("SET_USER", { username: userRef.current, category, character }, (res) => {
      setplayers(res.players);
    });
  };

  function handleSinglePlayer() {
    SetupDispatch({ type: PLAY_ALONE });
  }

  function handleMultiplayer() {
    SetupDispatch({ type: PLAY_ONLINE });
  }

  function handleCategory(category) {
    SetupDispatch({ type: SET_CATEGORY, payload: category });
  }

  function setCharacter(character) {
    SetupDispatch({type:SET_CHARACTER, payload:character})
  }

  const move = useNavigate();

  useEffect(() => {
    SocketDispatch({
      type: "ping_room",
      payload: {
        roomID: room,
        character:character
      },
    });

    socket?.on("ping_room", (res) => {
      const { category, roomID, players, singlePlayer, character } = res;
      console.log(res);

      if (singlePlayer) {
        return move(`/singlelevel/${roomID}/${userRef.current}/${category}`);
      }

      if (players?.length < 3) {
        return console.log("not enough users");
      } else {
        move(`/level/${roomID}/${userRef.current}/${category}`);
      }
    });
  }, [socket]);

  return (
    <div className="min-h-screen bg-black ">
      <div className=" ">
        {/* online /offline buttons */}
        {!playModeSet && (
          <GameOptions
            setSinglePlayer={handleSinglePlayer}
            setMultiplayer={handleMultiplayer}
          />
        )}
         
         {/* categories */}
        {playModeSet && !category && (
          <>
            <TopicScreen categories={categories} setcategory={handleCategory} />
          </>
        )}

       
         {/*username input  */}
        {
          playModeSet && category && !characterSet && (
        //     <UsernameInput
        //   username={username}
        //   setUsername={setUsername}
        //   setUser={setUser}
        // />
        <CharacterSelect func={(character) => setCharacter(character)}/>
          )
        }
        {
          characterSet && (
            <UsernameInput
          username={username}
          setUsername={setUsername}
          setUser={setUser}
        />
          )
        }

        {players?.map((player, index) => (
          <p className="text-3xl text-white   " key={index}>
            {player.username}
          </p>
        ))}
      </div>
    </div>
  );
}

export default GameScreen;
