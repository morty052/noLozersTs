import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import client, { urlFor } from "./client.js";
import AllEvents, { LobbyEvents, MatchEvents } from "./events.js";
import supabase from "./supabase.js";

const app = express();
app.use(cors("*"));
app.use(express.json());

export const io = new Server("5000", {
  cors: {
    origin: "*",
  },
});

const allQuestions = {
  General_knowledge: "",
  Movie_trivia: "",
  Mythology_trivia: "",
  Music_trivia: "",
  VideoGame_trivia: "",
  Science_Nature_trivia: "",
  Animal_trivia: "",
};

// async function getQuestions() {
//   const { shuffle } = lodash;

//   const results = await fetch(
//     "https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple"
//   )
//     .then((response) => response.json())
//     .then((response) =>
//       response.results.filter((r) => !r.question.includes("&"))
//     )
//     .catch((err) => console.error(err));

//   const movieTrivia = await fetch(
//     "https://opentdb.com/api.php?amount=50&category=11&difficulty=easy&type=multiple"
//   )
//     .then((response) => response.json())
//     .then((response) =>
//       response.results.filter((r) => !r.question.includes("&"))
//     )
//     .catch((err) => console.error(err));

//   const videoGametrivia = await fetch(
//     "https://opentdb.com/api.php?amount=50&category=15&difficulty=easy&type=multiple"
//   )
//     .then((response) => response.json())
//     .then((response) =>
//       response.results.filter((r) => !r.question.includes("&"))
//     )
//     .catch((err) => console.error(err));

//   const mythtrivia = await fetch(
//     "https://opentdb.com/api.php?amount=30&category=20&type=multiple"
//   )
//     .then((response) => response.json())
//     .then((response) =>
//       response.results.filter((r) => !r.question.includes("&"))
//     )
//     .catch((err) => console.error(err));

//   const animaltrivia = await fetch(
//     "https://opentdb.com/api.php?amount=50&category=27&type=multiple"
//   )
//     .then((response) => response.json())
//     .then((response) =>
//       response.results.filter((r) => !r.question.includes("&"))
//     )
//     .catch((err) => console.error(err));

//   const musictrivia = await fetch(
//     "https://opentdb.com/api.php?amount=50&category=12&difficulty=easy&type=multiple"
//   )
//     .then((response) => response.json())
//     .then((response) =>
//       response.results.filter((r) => !r.question.includes("&"))
//     )
//     .catch((err) => console.error(err));

//   const scienceandnaturetrivia = await fetch(
//     "https://opentdb.com/api.php?amount=50&category=17&difficulty=easy&type=multiple"
//   )
//     .then((response) => response.json())
//     .then((response) =>
//       response.results.filter((r) => !r.question.includes("&"))
//     )
//     .catch((err) => console.error(err));

//   const moviequestions = movieTrivia.slice(0, 20);
//   const generalquestions = results.slice(0, 20);
//   const videogamequestions = videoGametrivia.slice(0, 20);
//   const mythquestions = mythtrivia.slice(0, 20);
//   const animalquestions = animaltrivia.slice(0, 20);
//   const musicquestions = musictrivia.slice(0, 20);
//   const scienceAndNatureQuestions = scienceandnaturetrivia.slice(0, 20);

//   allQuestions.General_knowledge = shuffle(generalquestions);
//   allQuestions.VideoGame_trivia = shuffle(videogamequestions);
//   allQuestions.Movie_trivia = shuffle(moviequestions);
//   allQuestions.Music_trivia = shuffle(musicquestions);
//   allQuestions.Mythology_trivia = shuffle(mythquestions);
//   allQuestions.Science_Nature_trivia = shuffle(scienceAndNatureQuestions);
//   allQuestions.Animal_trivia = shuffle(animalquestions);
// }

// getQuestions();

const users = [];
const rooms = [
  {
    id: "one",
    players: [],
  },
  {
    id: 2,
    players: [],
  },
  {
    id: 3,
    players: [],
  },
];

const questions = [
  {
    question: "Question 1",
    choices: [
      {
        title: "Answer 1",
        id: 1,
      },
      {
        title: "Answer 2",
        id: 2,
      },
      {
        title: "Answer 3",
        id: 3,
      },
    ],
    answer: "Answer 3",
  },
  {
    question: "Question 2",
    choices: [
      {
        title: "Answer 1",
        id: 1,
      },
      {
        title: "Answer 2",
        id: 2,
      },
      {
        title: "Answer 3",
        id: 3,
      },
    ],
    answer: "Answer 3",
  },
  {
    question: "Question 3",
    choices: [
      {
        title: "Answer 1",
        id: 1,
      },
      {
        title: "Answer 2",
        id: 2,
      },
      {
        title: "Answer 3",
        id: 3,
      },
    ],
    answer: "Answer 3",
  },
  {
    question: "Question 4",
    choices: [
      {
        title: "Answer 1",
        id: 1,
      },
      {
        title: "Answer 2",
        id: 2,
      },
      {
        title: "Answer 3",
        id: 3,
      },
    ],
    answer: "Answer 3",
  },
  {
    question: "Question 5",
    choices: [
      {
        title: "Answer 1",
        id: 1,
      },
      {
        title: "Answer 2",
        id: 2,
      },
      {
        title: "Answer 3",
        id: 3,
      },
    ],
    answer: "Answer 3",
  },
  {
    question: "Question 6",
    choices: [
      {
        title: "Answer 1",
        id: 1,
      },
      {
        title: "Answer 2",
        id: 2,
      },
      {
        title: "Answer 3",
        id: 3,
      },
    ],
    answer: "Answer 3",
  },
  {
    question: "Question 7",
    choices: [
      {
        title: "Answer 1",
        id: 1,
      },
      {
        title: "Answer 2",
        id: 2,
      },
      {
        title: "Answer 3",
        id: 3,
      },
    ],
    answer: "Answer 3",
  },
  {
    question: "Question 8",
    choices: [
      {
        title: "Answer 1",
        id: 1,
      },
      {
        title: "Answer 2",
        id: 2,
      },
      {
        title: "Answer 3",
        id: 3,
      },
    ],
    answer: "Answer 3",
  },
  {
    question: "Question 9",
    choices: [
      {
        title: "Answer 1",
        id: 1,
      },
      {
        title: "Answer 2",
        id: 2,
      },
      {
        title: "Answer 3",
        id: 3,
      },
    ],
    answer: "Answer 3",
  },
  {
    question: "Question 10",
    choices: [
      {
        title: "Answer 1",
        id: 1,
      },
      {
        title: "Answer 2",
        id: 2,
      },
      {
        title: "Answer 3",
        id: 3,
      },
    ],
    answer: "Answer 3",
  },
];

// function to add user to rooms array and also return joined room
const addUser = (username, socketID, character) => {
  let points = 0;

  if (users.some((user) => username == user.username)) {
    return;
  }

  users.push({ username, socketID, points, character });

  const empty_room = rooms.filter((room) => room.players.length < 3)[0];

  empty_room.players.push({ username, socketID, points, character });

  return empty_room;
};

const getUser = (username) => {
  const user = users.find((user) => user.username == username);
  return user;
};

const userNamespace = io.of("/user");

userNamespace.on("connect", (socket) => {
  socket.on("handshake", async (data) => {
    const { username } = data;
    const query = `*[_type == "users" && username == "${username}"]`;
    try {
      const user = await client
        .fetch(query)
        .then((res) => res[0])
        .catch((error) => {
          throw console.log(error);
        });

      const user_id = user._id;

      if (!user) {
        throw console.log("something went wrong");
      }

      socket.join(`user_${user_id}`);

      await client
        .patch(user_id)
        .set({ socket: socket.id, online: true })
        .commit()
        .then(() => console.log(`user_${username} is now online`))
        .catch((error) => {
          throw console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("MESSAGE", (data) => {
    const { _id } = data;
    userNamespace.to(`user_${_id}`).emit("NEW_MESSAGE", "HELLO CODER");
  });

  MatchEvents(socket, userNamespace);

  LobbyEvents(socket, userNamespace);
});

io.on("connect", (socket) => {
  // ...

  AllEvents(socket);
  LobbyEvents(socket);
  MatchEvents(socket);
});

app.get("/", async (req, res) => {
  // try {
  //   console.log("request received")
  //   const text = await talk("beluga").then(res => res).catch(err => {
  //     throw console.log(err)
  //   } )
  //   res.send(text)
  // } catch (error) {
  //   res.send(error)
  // }
});

app.get("/test", async (req, res) => {
  console.log("trying to reach you");
  res.send("reached me");
});

app.get("/image", async (req, res) => {
  // try {
  // const imageUrl = await GenerateImage()
  // res.send(imageUrl)
  // } catch (error) {
  //   console.log(error)
  // }
});

app.post("/signup", async (req, res) => {
  const body = req.body;
  const { email, password, username } = body;
  console.log("request received");

  const newUser = {
    _type: "users",
    email,
    password,
    username,
  };

  await client.create(newUser);

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password, username }])
    .select();

  let { data: success, error: signupError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error);
  }

  res.send({
    email,
    password,
    username,
  });
});

app.post("/friends", async (req, res) => {
  const body = req.body;
  const { username } = body;
  const playerQuery = `*[_type == "users" && username == "${username}"]{friends[] -> {...}}`;
  const players = await client.fetch(playerQuery).then((res) => res[0]);
  const { friends } = players;
  const onlineFriends = friends.filter((friend) => friend.online);

  // const query = `*[_type == "users" && references("${playerRef}")]`
  // const players = await client.fetch(query).then(res => res)

  res.send({
    onlineFriends,
  });
});

app.post("/players", async (req, res) => {
  const body = req.body;

  // * GET USERNAME FROM BODY
  const { username } = body;

  // * SEARCH FOR ONLINE PLAYERS
  const playerQuery = `*[_type == "users" && online]`;

  const list = await client.fetch(playerQuery).then((res) => res);

  /*
   * FILTER OUT CURRENT PLAYER
   * FROM LIST TO SEND BACK TO CLIENT SIDE
   */
  const players = list.filter((player) => player.username != username);

  res.send({
    players,
  });
});

app.get("/characters", async (req, res) => {
  console.log("request received");
  const query = `*[_type == "characters"]`;
  const characters = await client.fetch(query).then((res) => res);

  // map through list to replace avatar with readable url
  const list = characters.map((character) => ({
    ...character,
    avatar: urlFor(character.avatar).url(),
  }));

  res.send({
    characters: list,
  });
});

app.post("/login", async (req, res) => {
  const body = req.body;
  const { email, password, username } = body;
  console.log("request received");

  try {
    let { data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(data);
  } catch (error) {
    console.log(error);
  }

  res.send({
    email,
    password,
    username,
  });
});

app.post("/questions", (req, res) => {
  const body = req.body;
  const { level } = body;
  console.log("request received");

  console.log(level);

  const question = questions.filter((question) => question)[level];

  res.send({
    question,
    level: level + 1,
  });
});

app.listen("3000", () => {
  console.log(" Lets make a game!");
});
