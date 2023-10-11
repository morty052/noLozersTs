import { player } from "@/types";
import { ActionBar, ChoiceList, Screen } from ".";
import { Socket } from "socket.io-client";

interface IViewProps {
  CurrentPlayer: player;
  OtherPlayers: player[];
  choices: string[];
  question: string;
  handleAnswer: (a: string) => void;
  correct_answer: string;
  scoreBoard: [];
  PowerParams: {
    answer: string;
    nextQuestion: string;
    thirdQuestion: string;
    socket: Socket;
    roomID: string;
    func: (lives: number, powerBars: number) => void;
  };
}

const StandardView = ({
  CurrentPlayer,
  OtherPlayers,
  choices,
  question,
  handleAnswer,
  correct_answer,
  scoreBoard,
  PowerParams,
}: IViewProps) => {
  return (
    <>
      <div className="relative mx-auto h-screen max-w-2xl  bg-gray-300 sm:min-h-[700px]">
        <Screen question={question} CurrentPlayer={CurrentPlayer} />
        <ChoiceList
          correct_answer={correct_answer}
          handleAnswer={handleAnswer}
          choices={choices}
        />
        <ActionBar
          PowerParams={PowerParams}
          // correct_answer={correct_answer}
          CurrentPlayer={CurrentPlayer}
          OtherPlayers={OtherPlayers}
          scoreBoard={scoreBoard}
        />
      </div>
    </>
  );
};

export default StandardView;