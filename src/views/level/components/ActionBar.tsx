/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { player } from "@/types/player";
import { useReducer, useEffect } from "react";
import {
  FaCircle,
  FaHeart,
  FaSearch,
  FaStar,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import { Socket } from "socket.io-client";
import { useSocketcontext } from "@/hooks/useSocketContext";
import { character } from "@/views/gamemenu/components/CharacterSelect";
import { Debuffs } from "@/classes/Player";
import { message } from "antd";

interface TactionBarProps {
  CurrentPlayer: player;
  OtherPlayers: player[];
  scoreBoard: player[];
  room_id: string;
  level: number;
  confused: boolean;
  setconfused: (c: boolean) => void;
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
  CurrentPlayer?: any;
}

interface IActionTypes {
  type:
    | "INIT"
    | "OPEN_TRAY"
    | "CLOSE_TRAY"
    | "USE_POWER"
    | "USE_ULTIMATE"
    | "DEBUFF";
  payload: IpayLoad;
}

interface IpayLoad {
  lives?: number;
  powerBars?: number;
  name?: string;
  CurrentPlayer: {
    lives: number;
    powerBars: number;
  };
}

const state: IStateProps = {
  userTrayOpen: false,
  Lives: 0,
  PowerBars: 0,
  UltimateBars: 0,
  CurrentPlayer: "",
};

function actionBarReducer(state: IStateProps, action: IActionTypes) {
  const { PowerBars, UltimateBars, Lives, CurrentPlayer } = state;
  const { type, payload } = action;

  const { lives } = CurrentPlayer;

  function handleUltimate(): IStateProps {
    switch (action.payload.name) {
      case "Arhuanran":
        return {
          ...state,
          PowerBars: PowerBars - 1,
          UltimateBars: UltimateBars - 1,
        };
      case "Ife":
        console.log(action.payload.name);
        if (!Lives) {
          return { ...state };
        }
        return {
          ...state,
          Lives: Lives + 1,
          PowerBars: PowerBars - 2,
          UltimateBars: UltimateBars - 1,
        };
      case "Washington":
        if (!action.payload) {
          return { ...state };
        }
        // @ts-ignore
        return { ...state, PowerBars: action.payload.powerBars };
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

  function handleInit(player: player) {
    console.log(player);
    const { lives, powerBars, ultimateBars } = player;
    return {
      ...state,
      Lives: lives,
      PowerBars: powerBars,
      UltimateBars: ultimateBars,
    };
  }

  switch (type) {
    case "INIT":
      return handleInit(payload.CurrentPlayer as player);
    case "OPEN_TRAY":
      return { ...state, userTrayOpen: true };
    case "CLOSE_TRAY":
      return { ...state, userTrayOpen: false };
    case "USE_ULTIMATE":
      return handleUltimate();
    case "USE_POWER":
      return { ...state };
    case "DEBUFF":
      console.log(action.payload);
      // @ts-ignore
      message.info(`${action.payload.sender}  ${action.payload.debuff} you `);
      return { ...state, Lives: Lives - 1 };
    default:
      return { ...state };
  }
}

const ActionBar = ({
  CurrentPlayer,
  OtherPlayers,
  PowerParams,
  scoreBoard,
  room_id,
  level,
  confused,
  setconfused,
}: TactionBarProps) => {
  // destructure display numbers and user powers from player class passed as props
  const {
    lives,
    // powerBars,
    callPowers,
    ultimate,
    character,
    ultimateBars,
    ultimates,
    username,
  }: player = CurrentPlayer && CurrentPlayer;
  const { name } = character && character;
  const { socket } = useSocketcontext();

  function callUltimate() {
    // CurrentPlayer.Debuff("crushed");
    socket?.emit("USE_POWER", { name, room_id }, (res: string) => {
      console.log(res);
    });
  }

  function callDebuff(target: string | undefined) {
    const { character } = CurrentPlayer;
    const { name } = character;
    // @ts-ignore
    const { debuff, target_name, sender } = CurrentPlayer.callDebuff({
      target_name: `${target}`,
      name: name,
    });
    console.log(sender);
    socket?.emit(
      "DEBUFF",
      { debuff, target_name, room_id, sender },
      (res: string) => {
        console.log(res);
      }
    );
  }

  // @ts-ignore
  const [ActionState, ActionDispatch] = useReducer(actionBarReducer, state);

  const { Lives, userTrayOpen } = ActionState;

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
    console.log(scoreBoard);
    return (
      <div className="z-10 my-4 rounded-3xl border bg-white px-4 py-2 shadow-lg ">
        {scoreBoard.length < 1
          ? OtherPlayers?.map((player, index) => (
              <div
                onClick={() => callDebuff(player.username)}
                key={index}
                className="flex gap-x-2"
              >
                <p>{player.username}</p> <span>{player.points}</span>
              </div>
            ))
          : scoreBoard?.map((player, index) => {
              if (player.controller?.username == username) {
                return (
                  <div
                    onClick={() => sendRequest(player.username)}
                    key={index}
                    className="flex gap-x-2"
                  >
                    <a className="flex items-center gap-x-1  ">
                      <span className="text-xs">
                        <FaUser />
                      </span>
                      <span className="text-xs">
                        {player.controller?.username}
                      </span>
                    </a>{" "}
                    <span className="text-xs">{player.points}</span>
                  </div>
                );
              }

              return (
                <div
                  onClick={() => sendRequest(player.username)}
                  key={index}
                  className="flex gap-x-2"
                >
                  <a className="flex items-center gap-x-1  ">
                    <a className="text-xs">
                      <FaCircle />
                    </a>
                    <span className="text-xs">
                      {player.controller?.username}
                    </span>
                  </a>{" "}
                  <span className="text-xs">{player.points}</span>
                </div>
              );
            })}
      </div>
    );
  };

  const MainActionBar = () => {
    const { answer, nextQuestion, thirdQuestion, socket, roomID } = PowerParams;

    const params = {
      level,
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
              <p>{Lives}</p>
            </div>

            {/* // eslint-disable-next-line react-hooks/rules-of-hooks */}
            <div
              onClick={() => callPowers(params)}
              className="flex items-center gap-x-2"
            >
              <FaSearch />
              <p>{powerBars}</p>
            </div>

            <div
              // onClick={() => ultimate(Superparams)}
              className="flex items-center gap-x-2"
            >
              <FaStar />
              <span>{ultimateBars}</span>
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

  useEffect(() => {
    ActionDispatch({
      type: "INIT",
      payload: {
        CurrentPlayer,
      },
    });
  }, []);

  useEffect(() => {
    socket?.on("POWER_USED", (res: character) => {
      console.log(res);
      CurrentPlayer.Debuff("crushed");
      ActionDispatch({ type: "DEBUFF", payload: { name: res } });
    });
  }, [socket]);

  useEffect(() => {
    socket?.on(
      "DEBUFF_USED",
      (res: {
        debuff: Debuffs;
        target_name: string;
        room_id: string;
        sender: string;
      }) => {
        const { debuff, target_name, sender } = res;
        console.log(debuff);
        console.log(username);

        if (username == target_name) {
          console.log("This you buddy", target_name);
          // @ts-ignore
          ActionDispatch({
            type: "DEBUFF",
            payload: {
              debuff,
              sender,
            },
          });

          setconfused(true);
        }
      }
    );
  }, [socket]);

  return (
    <div className="">
      <MainActionBar />
    </div>
  );
};

export default ActionBar;
