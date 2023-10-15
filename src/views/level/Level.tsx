/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useEffect, useReducer, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useSocketcontext } from "../../hooks/useSocketContext";
import { useParams } from "react-router-dom";
import { max } from "lodash";
import { StandardView } from "./components";
import { SetPlayers } from "./features";
import Levelreducer, { LevelState } from "@/reducers/LevelReducer";
import { player } from "@/types";
import { character } from "../gamemenu/components/CharacterSelect";
import { useUser } from "@clerk/clerk-react";
import { TstatusTypes } from "./components/ChoiceList";

const Level = () => {
  const [GameState, GameDispatch] = useReducer(Levelreducer, LevelState);
  const [confused, setconfused] = useState(false);
  const [statusEffects, setStatusEffects] = useState<
    undefined | TstatusTypes
  >();

  const { socket } = useSocketcontext();

  const { room_id, category } = useParams();

  // TODO:CHANGE LOCATION OF USERNAME
  // const username = localStorage.getItem("username");
  const { user, isLoaded } = useUser();

  const username = user?.username;
  console.log(username);

  const {
    ended,
    questions,
    level,
    CurrentPlayer,
    OtherPlayers,
    allPlayers,
    scoreBoard,
    winner,
  } = GameState;

  // !ORIGINAL FUNCTION
  const { question, correct_answer, incorrect_answers } =
    questions.length > 1 ? questions[level] : [];

  // ?TESTING NEW OBJECT DESTRUCTURING
  // const { question, correct_answer, incorrect_answers } =
  //   questions.length > 1 ? CurrentPlayer.questions[level] : [];

  //* destructure and rename username and points variable from winner object from state.

  const { points: winningPoints, username: winnerName } = winner;
  // const { username: winnerName } = winningController ? winningController : [];

  const { lives } = CurrentPlayer as player;

  // * HANDLE PLAYER DAMAGE AND DEATH
  const decreaseLives = () => {
    const { lives } = CurrentPlayer;

    if (lives == 1) {
      console.log("player about to die now");
      socket?.emit("PLAYER_DEATH", {
        username: CurrentPlayer.username,
        room_id,
      });
    }

    CurrentPlayer.takeDamage();
  };

  const increasePoints = () => {
    CurrentPlayer.increasePoints();
  };

  // const handleDebuff = (res) => {
  //   CurrentPlayer.Debuff(res);
  // };

  // * HANDLE PLAYER DEATH AND RESPONSE
  // * HANDLE EVENT FIRED AFTER USER PICKS AN ANSWER
  useEffect(() => {
    if (!CurrentPlayer) {
      return;
    }
    socket?.on("RESPONSE_RECEIVED", (res) => {
      GameDispatch({
        type: "PROGRESS_LEVEL",
        payload: {
          tally: res,
        },
      });
    });

    socket?.on("PLAYER_DEATH", (res) => {
      console.log("Player Died");
      GameDispatch({ type: "PLAYER_DEATH", payload: { name: res } });
      console.log("reduced players");
    });

    socket?.on("POWER_USED", (res: character) => {
      console.log(res);
      const { name } = res;

      // switch (name) {
      //   case "Arhuanran":
      //     CurrentPlayer.Debuff("crushed");
      //     break;
      //   case "Athena":
      //     CurrentPlayer.Debuff();
      //     break;
      //   case "Da Vinci":
      //     CurrentPlayer.Debuff();
      //     break;
      //   case "Ife":
      //     CurrentPlayer.Debuff("confused");
      //     break;
      //   case "Washington":
      //     CurrentPlayer.Debuff();
      //     break;
      //   case "Confucious":
      //     CurrentPlayer.Debuff();
      //     break;

      //   default:
      //     break;
      // }
    });

    socket?.on("DEBUFF_USED", (res) => {
      // handleDebuff(res);
      CurrentPlayer.Debuff(res);
      console.log(res);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, CurrentPlayer]);

  // * SET QUESTIONS AND PLAYER OBJECTS
  useEffect(() => {
    // fetchQuestions()

    if (!username) {
      return;
    }

    socket?.emit(
      "SET_ROOM",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { room_id, username, category },
      (res: {
        CurrentPlayer: player;
        OtherPlayers: character[];
        questions: string[];
      }) => {
        console.log(res);
        const { CurrentPlayer, OtherPlayers, questions } = res;
        const { player, enemies } = SetPlayers(CurrentPlayer, OtherPlayers);

        GameDispatch({
          type: "START_GAME",
          payload: {
            CurrentPlayer: player,
            OtherPlayers: enemies,
            questions,
          },
        });
      }
    );

    return () => {
      console.log(questions);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  // * HANDLE PAGE REFRESH
  useEffect(() => {
    const handleRefresh = (e) => {
      e.preventDefault();
      // window.history.deleteUrl({ url: `/test/${room}/${userName}` });
      return (e.returnValue = "");
    };

    window.addEventListener("beforeunload", handleRefresh, {
      capture: true,
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        console.log("eee");
      });
    };
  }, []);

  // * HANDLE QUESTIONS END
  useEffect(() => {
    if (level == 19) {
      socket?.emit("TALLY_GAME", { room_id }, (res) => {
        console.log(res);

        const points = Array.from(res, (p) => p.points);
        console.log(points);
        const highest = max(points);
        console.log(highest);
        const winner = res.find((p) => p.points == highest);
        console.log(winner);

        GameDispatch({
          type: "END_GAME",
          payload: {
            scores: res,
            winner,
          },
        });
      });
    }
  }, [level]);

  // * HANDLE LAST PLAYER STANDING
  useEffect(() => {
    console.log(allPlayers.length);
    if (allPlayers.length == 1) {
      // !ORIGINAL FUNCTION
      // socket?.emit("TALLY_GAME", { room_id }, (res) => {
      //   console.log(res);

      //   const points = Array.from(res, (p) => p.points);
      //   console.log(points);
      //   const highest = max(points);
      //   console.log(highest);
      //   const winner = res.find((p) => p.points == highest);
      //   console.log(winner);

      //   GameDispatch({
      //     type: "END_GAME",
      //     payload: {
      //       scores: res,
      //       winner,
      //     },
      //   });
      // });

      socket?.emit("TALLY_GAME", { room_id }, (res) => {
        console.log(res);

        const points = Array.from(scoreBoard, (p: player) => p.points);
        console.log(points);
        const highest = max(points);
        console.log(highest);
        const winner = scoreBoard.find((p: player) => p.points == highest);
        console.log(winner);

        GameDispatch({
          type: "END_GAME",
          payload: {
            scores: res,
            winner,
          },
        });
      });
    }
  }, [socket, allPlayers]);

  if (questions.length < 1 || !CurrentPlayer || !isLoaded) {
    return <h3>....loading</h3>;
  }

  // * SEND ANSWERS TO SERVER REALTIME
  const handleAnswer = (choice: string) => {
    console.log(allPlayers);

    if (choice != correct_answer) {
      decreaseLives();
      return socket?.emit("SELECTED_OPTION", {
        choice: choice,
        room_id,
        level,
        username,
        CurrentPlayer,
        correct: false,
      });
    }

    // * ONLY INCREASE POINTS IF USER CHOICE IS CORRECT ANSWER
    if (choice == correct_answer) {
      increasePoints();

      // *SEND EVENT TO SERVER
      return socket?.emit("SELECTED_OPTION", {
        choice: choice,
        room_id,
        level,
        username,
        CurrentPlayer,
        correct: true,
      });
    }

    // socket?.emit("SELECTED_OPTION", {
    //   choice: choice,
    //   room_id,
    //   level,
    //   username,
    //   CurrentPlayer,
    // });
  };

  // ?TESTING POWER
  function callPower(i: string) {
    socket?.emit("USE_POWER", { power: i, room_id }, (res: string) => {
      console.log(res);
    });
  }

  const { correct_answer: nextQuestion } =
    level < 18 ? questions[level + 1] : [];
  const { correct_answer: thirdQuestion } =
    level < 17 ? questions[level + 2] : [];

  const PowerParams = {
    answer: correct_answer,
    nextQuestion,
    thirdQuestion,
    socket,
    roomID: room_id,
    func: (f) => console.log(f),
  };

  return (
    <>
      {!ended ? (
        <div className="">
          {lives && lives > 0 ? (
            <>
              {/* <p onClick={() => CurrentPlayer.tryTest(level)}>test</p> */}
              <StandardView
                CurrentPlayer={CurrentPlayer}
                OtherPlayers={OtherPlayers}
                choices={incorrect_answers}
                question={question}
                correct_answer={correct_answer}
                handleAnswer={handleAnswer}
                confused={confused}
                setconfused={setconfused}
                setStatusEffects={setStatusEffects}
                statusEffects={statusEffects}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                PowerParams={PowerParams}
                room_id={room_id as string}
                level={level}
                scoreBoard={scoreBoard}
              />
            </>
          ) : (
            <div className="grid min-h-screen place-content-center bg-black pb-20">
              <p className="text-4xl text-red-400">Game over</p>
            </div>
          )}
        </div>
      ) : (
        <div className="">
          <div className="py-8">
            <span>{winnerName}</span> <span>{winningPoints}</span>{" "}
            <span>
              <FaStar />
            </span>
          </div>

          {scoreBoard?.map((player, index: number) => {
            console.log(player);
            const { points, username } = player;

            return (
              <div key={index}>
                <span>{username}</span> <span>{points}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Level;
