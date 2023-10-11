import { player } from "@/types/player";
import { useReducer } from "react";
import { FaHeart, FaSearch, FaStar, FaUserFriends } from "react-icons/fa";
import { Socket } from "socket.io-client";

interface TactionBarProps {
  CurrentPlayer: player;
  OtherPlayers: player[];
  scoreBoard: player[];
  PowerParams: {
    answer: string;
    nextQuestion: string;
    thirdQuestion: string;
    socket: Socket;
    roomID: string;
    func: (lives: number, powerBars: number) => void;
  };
}

interface IStateProps {
  userTrayOpen: boolean;
  Lives: number;
  PowerBars: number;
  UltimateBars: number;
}

interface IActionTypes {
  type: "OPEN_TRAY" | "CLOSE_TRAY" | "USE_POWER" | "USE_ULTIMATE";
  payload?: IpayLoad;
}

interface IpayLoad {
  lives?: number;
  powerBars?: number;
  name?: string;
}

const ActionBar = ({
  CurrentPlayer,
  OtherPlayers,
  PowerParams,
  scoreBoard,
}: TactionBarProps) => {
  // destructure display numbers and user powers from player class passed as props
  const {
    lives,
    // powerBars,
    callPowers,
    ultimate,
    character,
  } // ultimateBars,
  : player = CurrentPlayer && CurrentPlayer;
  const { name } = character && character;

  console.log(character);

  const state = {
    userTrayOpen: false,
    Lives: 0,
    PowerBars: 0,
    UltimateBars: 0,
  };

  function actionBarReducer(state: IStateProps, action: IActionTypes) {
    const { PowerBars } = state;

    function handleUltimate(): IStateProps {
      switch (name) {
        case "Arhuanran":
          return {
            ...state,
            PowerBars: PowerBars - 1,
            UltimateBars: UltimateBars - 1,
          };
        case "Ife":
          console.log(name);
          console.log(action.payload);
          if (!lives) {
            return { ...state };
          }
          return {
            ...state,
            Lives: lives + 1,
            PowerBars: PowerBars - 2,
            UltimateBars: UltimateBars - 1,
          };
        case "Washington":
          if (!action.payload) {
            return { ...state };
          }
          return { ...state, PowerBars: action.payload?.powerBars || 0 };
        // return { ...state, PowerBars: action.payload.powerBars };
        case "Da Vinci":
          console.log("da vinci don use ultimate");
          return {
            ...state,
            PowerBars: PowerBars - 1,
            UltimateBars: UltimateBars - 1,
          };
        default:
          return { ...state };
      }
    }

    switch (action.type) {
      case "OPEN_TRAY":
        return { ...state, userTrayOpen: true };

      case "CLOSE_TRAY":
        return { ...state, userTrayOpen: false };
      case "USE_ULTIMATE":
        return handleUltimate();

      // return  {...state}
      case "USE_POWER":
        return { ...state, PowerBars: PowerBars - 1 };
      default:
        return { ...state };
    }
  }

  const [ActionState, ActionDispatch] = useReducer(actionBarReducer, state);

  const { PowerBars, UltimateBars, userTrayOpen } = ActionState;

  const handleTray = () => {
    if (userTrayOpen) {
      return ActionDispatch({ type: "CLOSE_TRAY" });
    }

    ActionDispatch({ type: "OPEN_TRAY" });
  };

  const sendRequest = (username: string) => {
    console.log("sent");

    const targetPartner = OtherPlayers?.find(
      (player) => player.username == username
    );

    CurrentPlayer.teamUp(targetPartner);
    console.log(CurrentPlayer.partners);

    // socket.emit("TEAM_UP",{
    //   username:name
    // })
  };

  const ActionTray = () => {
    return (
      <div className="z-10 my-4 rounded-3xl border bg-white px-4 py-2 shadow-lg ">
        {scoreBoard.length < 1
          ? OtherPlayers?.map((player, index) => (
              <div
                onClick={() => sendRequest(player.username)}
                key={index}
                className="flex gap-x-2"
              >
                <p>{player.username}</p> <span>{player.points}</span>
              </div>
            ))
          : scoreBoard?.map((player, index) => (
              <div
                onClick={() => sendRequest(player.username)}
                key={index}
                className="flex gap-x-2"
              >
                <p>{player.username}</p> <span>{player.points}</span>
              </div>
            ))}
      </div>
    );
  };

  const MainActionBar = () => {
    const { answer, nextQuestion, thirdQuestion, socket, roomID } = PowerParams;

    const params = {
      answer,
      nextQuestion,
      thirdQuestion,
      socket,
      roomID,
      func: () => ActionDispatch({ type: "USE_POWER" }),
    };

    const Superparams = {
      answer,
      nextQuestion,
      thirdQuestion,
      socket,
      roomID,
      // func: (lives:number, powerbars:number) => ActionDispatch({ type: "USE_ULTIMATE", payload:{lives:lives,powerBars:powerbars}}),
      func: (name: string) =>
        ActionDispatch({ type: "USE_ULTIMATE", payload: { name } }),
    };

    return (
      <div className="absolute bottom-4 left-2 right-2   flex flex-col">
        {userTrayOpen && <ActionTray />}
        <div className="">
          <div className="flex items-center justify-around rounded-3xl border px-4 py-2.5">
            <div className="flex items-center gap-x-2">
              <FaHeart />
              <p>{lives}</p>
            </div>

            {/* // eslint-disable-next-line react-hooks/rules-of-hooks */}
            <div
              onClick={() => callPowers(params)}
              className="flex items-center gap-x-2"
            >
              <FaSearch />
              <p>{PowerBars}</p>
            </div>

            <div
              onClick={() => ultimate(Superparams)}
              className="flex items-center gap-x-2"
            >
              <FaStar />
              <span>{UltimateBars}</span>
            </div>

            <div
              onClick={() => handleTray()}
              className="flex items-center gap-x-2"
            >
              <FaUserFriends />
              <p>{OtherPlayers?.length}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <MainActionBar />
    </div>
  );
};

export default ActionBar;
