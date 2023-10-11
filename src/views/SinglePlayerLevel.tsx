/* eslint-disable react/prop-types */
import { useState, useEffect, useReducer } from "react";
import { FaHeart, FaSearch, FaStar, FaUserFriends } from "react-icons/fa";
import Player from "../classes/Player";
import { useSocketcontext } from "../hooks/useSocketContext";
import { useParams } from "react-router-dom";
import { shuffle, max } from "lodash";
import { message } from "antd";

const state = {
  questions: [],
  level: 0,
  playing: false,
  ended: false,
  CurrentPlayer: "",
  OtherPlayers: [],
  allPlayers:[],
  scoreBoard: [],
  winner: "",
};

const reducer = (state, action) => {
  const { level, allPlayers } = state;
  let remainingPlayers

 const removePlayer = (res) => {

  const remainingPlayers = allPlayers.filter((p) => p.name != res)
  console.log(remainingPlayers)
  return remainingPlayers

 }

  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        playing: true,
        CurrentPlayer: action.payload.CurrentPlayer,
        OtherPlayers: action.payload.OtherPlayers,
        allPlayers:[action.payload.CurrentPlayer],
        questions: action.payload.questions,
      };

    case "FETCH_QUESTIONS":
      return { ...state, questions: action.payload.questions };

    case "PROGRESS_LEVEL":
      return { ...state, level: level + 1 };

      case "PLAYER_DEATH":
        remainingPlayers = removePlayer(action.payload.name)
        
        console.log(remainingPlayers)
        return { ...state, allPlayers:remainingPlayers};
  
    case "END_GAME":
      return {
        ...state,
        ended: true,
        scoreBoard: action.payload.scores,
        winner: action.payload.winner,
      };
    default:
      return { ...state };
  }
};

const GAME_ACTIONS = {
  START: "START_GAME",
  FETCH: "FETCH_QUESTIONS",
  PROGRESS: "PROGRESS_LEVEL",
  PLAYER_DEATH:"PLAYER_DEATH",
  END: "END_GAME",

};

const Choice = ({ text, func }) => {
  return (
    <div className="flex">
      <button
        className="w-full rounded-xl border px-4 py-2 "
        onClick={() => func()}
      >
        {text}
      </button>
    </div>
  );
};

const Screen = ({ CurrentPlayer, question, time }) => {
  return (
    <div className="relative w-full px-2 pt-2 ">
      <div className="grid h-64 place-content-center rounded-lg  border px-4 text-center">
        <p className="text-2xl">{question}</p>
      </div>

      <div className="absolute left-4 top-4">
        <p className="text-xl font-black">{CurrentPlayer?.points}</p>
      </div>
      <div className="absolute right-4 top-4">
        <p className="text-xl font-black">{time}</p>
      </div>
    </div>
  );
};

const ChoiceList = ({ choices, handleAnswer, correct_answer }) => {
  const l = choices ? [correct_answer, ...choices] : [];

  const list = shuffle(l);

  return (
    <div className="flex flex-col gap-y-8 px-2 pt-6">
      {list?.map((i, index) => (
        <Choice func={() => handleAnswer(i)} text={i} key={index} />
      ))}
    </div>
  );
};

const ActionBar = ({ CurrentPlayer, OtherPlayers, correct_answer }) => {

  const trayActions  = {
    OPEN:"OPEN_TRAY",
    CLOSE:"CLOSE_TRAY",
    USE_POWER:"USE_POWER"
  }

  const {lives, powerBars, callPowers} = CurrentPlayer ? CurrentPlayer : []
  const {OPEN, CLOSE, USE_POWER} = trayActions

  const state = {
    userTrayOpen: false,
    Lives:lives,
    PowerBars:powerBars
  }

  function actionBarReducer(state, action) {

    const {PowerBars} = state
    
    switch (action.type) {
      case "OPEN_TRAY":
        return {...state, userTrayOpen:true}

      case "CLOSE_TRAY":
        return {...state, userTrayOpen:false}

      case "USE_POWER":
        return {...state, PowerBars:PowerBars -1}
    
      default:
        break;
    }
  }


  const [ActionState, ActionDispatch] = useReducer(actionBarReducer, state,)

  const {Lives, PowerBars, userTrayOpen} = ActionState

  const [actionBar, setactionBar] = useState({
    userTrayOpen: false,
    lives:CurrentPlayer.lives,
  });
 

  const handleTray = () => {

    if (userTrayOpen) {
     return ActionDispatch({type:CLOSE})
    }

    ActionDispatch({type:OPEN})
  };

  const sendRequest = (name) => {
    console.log("sent");

    const targetPartner = OtherPlayers?.find((player) => player.name == name);

    CurrentPlayer.teamUp(targetPartner);
    console.log(CurrentPlayer.partners);

    // socket.emit("TEAM_UP",{
    //   username:name
    // })
  };

  const ActionTray = () => {
    return (
      <div className="z-10 my-4 rounded-3xl border bg-white px-4 py-2 shadow-lg ">
        {OtherPlayers?.map((player, index) => (
          <div
            onClick={() => sendRequest(player.name)}
            key={index}
            className="flex gap-x-2"
          >
            <p>{player.name}</p> <span>{player.lives}</span>{" "}
            <span>{player.points}</span>
          </div>
        ))}
      </div>
    );
  };

  const MainActionBar = () => {
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
            <div onClick={() => callPowers(correct_answer, () => ActionDispatch({type:USE_POWER}))} className="flex items-center gap-x-2">
              <FaStar />
              <p>{PowerBars}</p>
            </div>

            <div className="flex items-center gap-x-2">
              <FaSearch />
              {/* <p>{CurrentPlayer.lives}</p> */}
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

const StandardView = ({
  CurrentPlayer,
  OtherPlayers,
  choices,
  callPowers,
  question,
  handleAnswer,
  correct_answer,
  time,
}) => {
  return (
    <>
      <div className="relative mx-auto h-screen max-w-2xl  bg-gray-300 sm:min-h-[700px]">
        <Screen time={time} question={question} CurrentPlayer={CurrentPlayer} />
        <ChoiceList
          correct_answer={correct_answer}
          handleAnswer={handleAnswer}
          choices={choices}
        />
        <ActionBar correct_answer={correct_answer} CurrentPlayer={CurrentPlayer} OtherPlayers={OtherPlayers} />
      </div>
    </>
  );
};

const SetSinglePlayer = (username, character) => {
  // CHANGE NAME LATER VERY IMPORTANT from userName to username
  const player = new Player(username, character);
  return { player };
};

const SinglePlayerLevel = () => {
  const [GameState, GameDispatch] = useReducer(reducer, state);

  const { socket } = useSocketcontext();

  const room = useParams().room;
  const userName = useParams().username;
  const category = useParams().category;

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

  const {points:winningPoints, username:winnerName  } = winner

  const { lives } = CurrentPlayer;
  // const allPlayers = [CurrentPlayer, ...OtherPlayers];

  const { PLAYER_DEATH, PROGRESS, END, } = GAME_ACTIONS;

  const decreaseLives = () => {

    const {lives} = CurrentPlayer

    if (lives == 1) {
      console.log("player about to die")  
      socket.emit("PLAYER_DEATH",{username:CurrentPlayer.name, roomID:room})
    }
   
    CurrentPlayer.takeDamage();
  };

  const increasePoints = () => {
    CurrentPlayer.increasePoints();
  };

  useEffect(() => {
    socket?.on("RESPONSE_RECEIVED", (res) => {
      console.log(res);
      GameDispatch({
        type: PROGRESS,
        payload: {
          name: res.name,
          points: res.points,
          end: () => socket.emit("handshake"),
        },
      });
    });
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

useEffect(() => {
  
  socket.on("PLAYER_DEATH",(res) => {
    console.log(res)

    

    GameDispatch({type:PLAYER_DEATH, payload:{name:res}})
    console.log('reduced players')
   })

}, [socket])


  useEffect(() => {
    socket?.emit("SET_SINGLE_PLAYER", { userName: userName, category, }, (res) => {
      const {questions, character} = res
      const { player } = SetSinglePlayer(userName, character);
      console.log("this is the player", player)
      
      GameDispatch({
        type: "START_GAME",
        payload: {
          CurrentPlayer: player,
          questions: questions,
        },
      });
    });

    return () => {
      console.log(questions);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    console.log(level);

    

    if (level == 19) {
      socket?.emit("TALLY_GAME", { roomID: room }, (res) => {
        console.log(res);

        const points = Array.from(res, (p) => p.points);
        console.log(points);
        const highest = max(points);
        console.log(highest);
        const winner = res.find((p) => p.points == highest);
        console.log(winner);

        GameDispatch({
          type: END,
          payload: {
            scores: res,
            winner,
          },
        });
      });
    }
  }, [level,]);


  useEffect(() => {
    // if (allPlayers.length == 1) {
    //  socket?.emit("TALLY_GAME", { roomID: room }, (res) => {
    //     console.log(res);

    //     const points = Array.from(res, (p) => p.points);
    //     console.log(points);
    //     const highest = max(points);
    //     console.log(highest);
    //     const winner = res.find((p) => p.points == highest);
    //     console.log(winner);

    //     GameDispatch({
    //       type: END,
    //       payload: {
    //         scores: res,
    //         winner,
    //       },
    //     });
    //   });
    // }
  }, [socket, allPlayers])
  

  if (questions.length < 1) {
    return <h3>....loading</h3>;
  }

  const { question, correct_answer, incorrect_answers } = questions.length > 1 ? questions[level] : [];

  const handleAnswer = (choice) => {

    console.log(allPlayers)

    if (choice != correct_answer) {
      decreaseLives();
    }

    if (choice == correct_answer) {
      increasePoints();
    }

    // send answers and level to server in realtime
    socket?.emit(
      "SELECTED_OPTION",
      {
        choice: choice,
        roomID: room,
        level,
        username: userName,
        CurrentPlayer,
      },
    );
  };

  function callPowers() {
     
     message.info(`${correct_answer}`)
  }

  return (
    <>
      {!ended  ? (
        <div className="">
          {lives > 0 ? (
            <StandardView
              CurrentPlayer={CurrentPlayer}
              OtherPlayers={OtherPlayers}
              choices={incorrect_answers}
              question={question}
              callPowers={callPowers}
              correct_answer={correct_answer}
              handleAnswer={handleAnswer}
            />
          ) : (
            <div className="grid min-h-screen place-content-center bg-black pb-20">
              <p className="text-4xl text-red-400">Game over</p>
            </div>
          )}
        </div>
      ) : (
        <div className="">
          <div className="py-8">
            <span>{winnerName}</span> <span>{winningPoints}</span> <span><FaStar/></span>
            
          </div>

          {scoreBoard.map((player, index) => {
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

export default SinglePlayerLevel;
