import Player from "@/classes/Player";
import { player } from "@/types/player";

export const LevelState = {
  questions: [],
  level: 0,
  playing: false,
  ended: false,
  CurrentPlayer: "",
  OtherPlayers: [],
  allPlayers: [],
  scoreBoard: [],
  winner: "",
};

type TpayloadProps = {
  tally?: string;
  CurrentPlayer?: "" | Player;
  OtherPlayers?: player | player[];
  questions?: string[];
  name?: "";
  scores?: "";
  func?: () => void;
  winner?: "";
  powerUsed?: string;
};
export interface IActionProps {
  type:
    | "START_GAME"
    | "FETCH_QUESTIONS"
    | "POWER_USED"
    | "PROGRESS_LEVEL"
    | "PLAYER_DEATH"
    | "END_GAME"
    | "TEST";
  payload: TpayloadProps;
}

const Levelreducer = (
  state: { level: string; allPlayers: player[] },
  action: IActionProps
) => {
  const { level, allPlayers } = state;
  const { type, payload } = action;
  const { tally } = payload;
  let remainingPlayers;

  const removePlayer = (res: string) => {
    const remainingPlayers = allPlayers.filter((p) => p.username != res);
    console.log(remainingPlayers);
    return remainingPlayers;
  };

  switch (type) {
    case "START_GAME":
      return {
        ...state,
        playing: true,
        CurrentPlayer: action.payload.CurrentPlayer,
        OtherPlayers: action.payload.OtherPlayers,
        allPlayers: [
          action.payload.CurrentPlayer,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...action.payload.OtherPlayers,
        ],
        questions: action.payload.questions,
      };

    case "FETCH_QUESTIONS":
      return { ...state, questions: action.payload.questions };

    case "POWER_USED":
      // action.payload.func();
      return { ...state };

    case "PROGRESS_LEVEL":
      console.log(tally);
      return { ...state, level: level + 1, scoreBoard: action.payload.tally };

    case "PLAYER_DEATH":
      remainingPlayers = removePlayer(action.payload.name as string);

      console.log(remainingPlayers);
      return { ...state, allPlayers: remainingPlayers };

    case "END_GAME":
      return {
        ...state,
        ended: true,
        scoreBoard: action.payload.scores,
        winner: action.payload.winner,
      };
    case "TEST":
      console.log(action.payload.powerUsed);
      return { ...state };
    default:
      return { ...state };
  }
};

export default Levelreducer;
