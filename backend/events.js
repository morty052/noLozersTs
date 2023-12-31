import client, { urlFor } from "./client.js";
import { io } from "./server.js";

// TODO:ADD TRY CATCH TO ALL DANGEROUS EVENTS

function AllEvents(socket) {
  socket.on("handshake", async (data) => {
    const { username } = data;
    const query = `*[_type == "users" && username == "${username}"]`;
    try {
      const user = await client.fetch(query).then((res) => res[0]);

      if (!user || user.length < 1) {
        throw console.log("something went wrong");
      }

      await client
        .patch(user._id)
        .set({ socket: socket.id, online: true })
        .commit()
        .then((res) => res);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("FINDING_ONLINE_USERS", async (cb) => {
    const query = `*[_type == "users" && online ]`;
    const onlineusers = await client.fetch(query).then((res) => res);
    cb(onlineusers);
  });

  socket.on("SEND_INVITATION", async (data) => {
    /*
     * get target user socket id from data to send message to specific user clicked
     * username is the username of the host i.e the sender of the invitation gotten from data
     */
    const { socket_id, username } = data;

    const query = `*[_type == "users" && username == "${username}"]`;
    const host_id = await client.fetch(query).then((res) => res[0]._id);
    const roomQuery = `*[_type == "rooms" && room_id == "${host_id}"]`;
    const room = await client.fetch(roomQuery).then((res) => res[0]);
    const room_id = room._id;
    const category = room.category;

    // * send invitation event to target user
    // ? send target socket id back to target why ?
    io.to(`${socket_id}`).emit("INVITATION", {
      socket_id,
      username,
      room_id,
      category,
    });
  });

  socket.on("JOIN_USER", async (data) => {
    const { username, host } = data;

    const hostQuery = `*[_type == "users" && username == "${host}"]`;
    const guestQuery = `*[_type == "users" && username == "${username}"]`;

    const guestRef = await client.fetch(guestQuery).then((res) => res[0]);

    const hostObject = await client.fetch(hostQuery).then((res) => res[0]);
    const hostSocket = hostObject.socket;
    const host_id = hostObject._id;

    console.log("ACCEPTED INVITE");

    /*
         *SEND EVENT TO GUEST SOCKET
         TODO: ADD MEANINGFUL DATA TO EMIT EVENT
          */
    socket.emit("JOIN_HOST_ROOM", host_id);

    // * SEND EVENT TO HOST SOCKET
    io.to(`${hostSocket}`).emit("INVITATION_ACCEPTED", { guestRef, host_id });
  });

  socket.on("PING_LOBBY", async (data, cb) => {
    // * DESTRUCTURE CREATED ROOM_ID FROM EVENT DATA
    // ! ROOM_ID IS SAME AS ID OF HOST
    const { room_id } = data;

    /*
     * FILTER ROOMS ON BACKEND WITH ROOM_ID FROM EVENT DATA
     * RETREIVE CREATED ROOM
     * GET PLAYERS FROM REFERENCE
     * GET CHARACTERS FROM PLAYERS REFERENCE ON SCHEMA
     */
    const roomQuery = `*[_type == "rooms" && room_id == "${room_id}"]{category, players[]{...,controller -> {..., character -> {name}}}}`;
    const room = await client.fetch(roomQuery).then((res) => res[0]);

    // * DESTRUCTURE  PLAYERS FROM ROOM OBJECT
    const { players } = room;

    // * FILTER PLAYERS TO FIND HOST USING ROOM_ID
    const host = players
      .filter((player) => player.controller._id == room_id)
      .map((player) => ({
        points: player.points,
        username: player.controller.username,
        _id: player.controller._id,
        character: player.controller.character,
      }));

    /* 
        * MAP THROUGH PLAYERS TO CREATE ARRAY WITH ONLY MEANINGFUL DATA
        * FILTER PLAYERS TO EXCLUDE HOST
          TODO: ADD URL FOR USER IMAGE WHEN MAPPING THROUGH PLAYERS 
        */

    const guests = players
      .map((player) => ({
        points: player.points,
        ready: !player.ready ? false : true,
        username: player.controller.username,
        _id: player.controller._id,
        character: player.controller.character,
      }))
      .filter((player) => player._id != room_id);

    // * CALL FUNCTION TO EMIT JOIN ROOM EVENT TO ALL PLAYERS IN LOBBY AND ALSO SEND PLAYERS ARRAY
    cb({
      host,
      guests,
    });
  });

  // socket.on("JOIN_HOST_ROOM", (data) => {
  //   const { room_id } = data;

  //   // ADD ALL PLAYERS TO ROOM
  //   socket.join(`${room_id}`);

  //   io.in(`${room_id}`).emit("JOINED_HOST_ROOM", "Joined room playa");
  // });

  socket.on("SET_USER", async (data, cb) => {
    const { username, category, singlePlayer, character } = data;

    const query = `*[_type == "users" && username == "${username}"]`;
    const user = await client.fetch(query).then((res) => res[0]);
    const patch = await client
      .patch(user._id)
      .set({ socket: socket.id, online: true })
      .commit();

    const joinedroom = addUser(username, socket.id, character);
    socket.join(joinedroom.id);

    const res = {
      players: joinedroom.players,
      roomID: joinedroom.id,
      category,
      singlePlayer,
    };

    io.in(joinedroom.id).emit("ping_room", res);
    cb(res);
  });

  socket.on("CREATE_ROOM", async (data, cb) => {
    // * DESCTRUCTURE HOST USERNAME AND CATEGORY FROM DATA
    const { username, category } = data;

    // * FIND USER WITH USERNAME EQUAL TO HOST USERNAME
    const query = `*[_type == "users" && username == "${username}"]`;
    const user = await client.fetch(query).then((res) => res[0]);
    const userRef = user._id;

    /*
     * ASSIGN USER ID TO ROOM ID FOR EASY REFERENCE LATER
     * SET ROOM CATEGORY FROM EVENT DATA
     */

    // TODO: decide if to change back to random id or keep as host userid
    const room = {
      _type: "rooms",
      room_id: userRef,
      category: category,
    };

    // *CREATE ROOM / RERTEIVE CREATED ROOM ID
    const res = await client.create(room).then((res) => res._id);

    /*
     * ADD HOST TO CREATED ROOM
     * RETREIVE ROOM_ID TO SEND BACK TO CLIENT SIDE
     */

    const room_id = await client
      .patch(res)
      .setIfMissing({ players: [] })
      .insert("after", "players[-1]", [
        {
          controller: {
            _type: "reference",
            _ref: `${userRef}`,
          },
          points: 0,
        },
      ])
      .commit({ autoGenerateArrayKeys: true })
      .then((res) => res.room_id);

    //*MAKE HOST SOCKET JOIN ROOM ID
    socket.join(room_id);

    // *SEND CREATED ROOM ID BACK TO CLIENT SIDE
    cb(room_id);
  });

  socket.on("ADD_GUEST", async (data, cb) => {
    const { room_id, guestRef, guestName } = data;

    // *FIND ROOM

    // * ADD GUEST TO ROOM
    console.log("this is guest ref", guestRef);

    // * ROOMQUERY TO GET  TARGET ROOM USING HOST ID
    // TODO:STREAMLINE QUERY TO INCLUDE MEANINGFUL DATA ONLY
    const roomQuery = `*[_type == "rooms" && room_id == "${room_id}"]{_id, players[]{...,controller -> {..., character -> {...}}}}`;
    const room = await client.fetch(roomQuery).then((res) => res[0]);

    // * DESTRUCTURE ID FROM QUERY RESULT
    const { _id } = room;
    console.log("this is room id", _id);

    // * GET ROOM TO PATCH USING DESTRUCTURED ID
    await client
      .patch(_id)
      .setIfMissing({ players: [] })
      .insert("after", "players[-1]", [
        {
          controller: {
            _type: "reference",
            _ref: `${guestRef}`,
          },
          points: 0,
        },
      ])
      .commit({ autoGenerateArrayKeys: true });

    // * GET GUEST USERNAME FROM PLAYERS IN PATCHED USING GUESTREF FROM EVENT DATA
    // const username = players.find(player => player.controller._id == guestRef).controller.username
    console.log(guestName);

    // * SEND BACK USERNAME TO  HOST AS POPUP
    cb(guestName);
  });

  socket.on("SET_SINGLE_PLAYER", async (data, cb) => {
    const { userName, category } = data;

    const user = getUser(userName);
    const { character } = user;

    cb({
      questions: allQuestions[category],
      character,
    });

    // io.in(roomID).emit("ping_room", room.players)
  });

  socket.on("TEAM_UP", (data) => {
    const { username } = data;
    const user = getUser(username);
    io.to(user.socketID).emit("NEW_MESSAGE", "Team up received");
  });

  socket.on("disconnect", async () => {
    // const query = `*[_type == "users" && socket == "${socket.id}" ]`
    // const user = await client.fetch(query).then(res => res[0])
    // const res = await client.patch(user._id)
    // .set({online:false})
    // .commit()
    // console.log(res)
  });
}

export function LobbyEvents(socket, userNamespace) {
  // TODO:ADD TRY CATCH TO ALL DANGEROUS EVENTS

  function generateQuestionsIndex() {
    const randomNumber = Math.floor(Math.random() * 30); // Generate a random number between 0 and 30
    const number1 = randomNumber;
    const number2 = randomNumber + 20;

    return {
      start: number1,
      end: number2,
    };
  }

  socket.on("PING_LOBBY", async (data, cb) => {
    // * DESTRUCTURE CREATED ROOM_ID FROM EVENT DATA
    // ! ROOM_ID IS SAME AS ID OF HOST
    const { room_id } = data;

    try {
      if (!room_id) {
        throw "no room id";
      }

      console.log("this is room id", room_id);
      /*
       * FILTER ROOMS ON BACKEND WITH ROOM_ID FROM EVENT DATA
       * RETREIVE CREATED ROOM
       * GET PLAYERS FROM REFERENCE
       * GET CHARACTERS FROM PLAYERS REFERENCE ON SCHEMA
       */
      const roomQuery = `*[_type == "rooms" && room_id == "${room_id}"]{category, players[]{...,controller -> {..., character -> {...}}}}`;
      const room = await client.fetch(roomQuery).then((res) => res[0]);

      // * DESTRUCTURE  PLAYERS & CATEGORY FROM ROOM OBJECT
      const { players, category } = room;

      // * FILTER PLAYERS TO FIND HOST USING ROOM_ID
      const host = players
        .filter((player) => player.controller._id == room_id)
        .map((player) => ({
          points: player.points,
          username: player.controller.username,
          _id: player.controller._id,
          character: player.controller.character,
          characterAvatar: urlFor(player.controller.character.avatar).url(),
        }));

      /* 
          * MAP THROUGH PLAYERS TO CREATE ARRAY WITH ONLY MEANINGFUL DATA
          * FILTER PLAYERS TO EXCLUDE HOST
            TODO: ADD URL FOR USER IMAGE WHEN MAPPING THROUGH PLAYERS 
          */

      // console.log(host[0].characterAvatar);

      const guests = players
        .map((player) => ({
          points: player.points,
          ready: !player.ready ? false : true,
          username: player.controller.username,
          _id: player.controller._id,
          character: player.controller.character,
          characterAvatar: urlFor(player.controller.character.avatar).url(),
        }))
        .filter((player) => player._id != room_id);

      // * ADD ALL SOCKETS TO THE CURRENT ROOM
      socket.join(`${room_id}`);

      // * CALL FUNCTION TO SET CATEGORY AND PLAYERS IN ROOM
      cb({
        category,
        players: [host[0], ...guests],
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("SEND_INVITATION", async (data) => {
    /*
     * get target user socket id from data to send message to specific user clicked
     * username is the username of the host i.e the sender of the invitation gotten from data
     */

    // !ORIGINAL FUNCTION
    // const { _id, username, room_id } = data;

    const { target_user, room_id, sender } = data;
    console.log(target_user);

    try {
      if (!target_user) {
        throw console.log("username not found");
      }

      // * send invitation event to target user
      // ? send target socket id back to target why ?
      userNamespace.to(`user_${target_user}`).emit("INVITATION", {
        username: sender,
        _id: room_id,
        // category,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("SET_CHARACTER", async (data) => {
    const { character, username } = data;
    console.log("this is character", character.name);
    const query = `*[_type == "users" && username == "${username}"]{_id}`;

    try {
      if (!character || !username) {
        throw console.log("Fields missing error");
      }

      const userId = await client.fetch(query).then((res) => res[0]);

      if (!userId) {
        throw console.log("id not found");
      }

      const { _id } = userId;
      await client
        .patch(_id)
        .set({ character: { _type: "reference", _ref: `${character._id}` } })
        .commit({ autoGenerateArrayKeys: true })
        .then((res) => res)
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("SET_CATEGORY", async (data, cb) => {
    const { category, room_id } = data;
    console.table([category, room_id]);

    try {
      if (!category || !room_id) {
        throw console.log("roomid or category not found");
      }
      const roomQuery = `*[_type == "rooms" && room_id == "${room_id}"]{_id}`;
      const roomID = await client.fetch(roomQuery).then((res) => res[0]._id);

      const patchNotice = await client
        .patch(roomID)
        .set({ category: category })
        .commit({ autoGenerateArrayKeys: true })
        .then((res) => res);
      cb(patchNotice);
      userNamespace.to(`${room_id}`).emit("CATEGORY_CHANGE", { category });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("FRIEND_REQUEST", async (data) => {
    const { username, sender } = data;
    console.log("there is a friend request for > ", username);

    userNamespace
      .to(`user_${username}`)
      .emit("FRIEND_REQUEST_RECEIVED", { username: sender });

    // TODO: ADD FRIEND REQUEST TO DATABASE
    function addFriendRequest(params) {
      // .......
    }
  });

  socket.on("READY_PLAYER", async (data, cb) => {
    const { player, room_id } = data;
    cb("YOU ARE READY");
    const { _id: currentPlayer_id } = player;
    const roomQuery = `*[_type == "rooms" && room_id == "${room_id}"]{_id, category, players[]{...,controller -> {..., character -> {name}}}}`;
    const { players, _id } = await client
      .fetch(roomQuery)
      .then((res) => res[0]);
    const updatedlist = players.map((player) => {
      if (player.controller._id == currentPlayer_id) {
        return {
          controller: { _type: "reference", _ref: `${player.controller._id}` },
          ready: true,
        };
      }

      return {
        controller: { _type: "reference", _ref: `${player.controller._id}` },
        points: player.points,
        ready: player.ready,
      };
    });

    await client
      .patch(_id)
      .setIfMissing({ players: [] })
      .set({ players: updatedlist })
      .commit({ autoGenerateArrayKeys: true })
      .then((res) => console.table(res));
    console.table([players, _id]);
    userNamespace.to(`${room_id}`).emit("PLAYER_READY", "PLAYER IS READY");
  });

  socket.on("CREATE_ROOM", async (data, cb) => {
    // * DESCTRUCTURE HOST USERNAME AND CATEGORY FROM DATA
    const { username, category } = data;
    const { start, end } = generateQuestionsIndex();

    try {
      if (!username || !category) {
        throw "Fields missing error";
      }

      console.log("this is category", category);

      // * FIND USER WITH USERNAME EQUAL TO HOST USERNAME
      const query = `*[_type == "users" && username == "${username}"]`;
      const user = await client.fetch(query).then((res) => res[0]);
      const userRef = user._id;

      /*
       * ASSIGN USER ID TO ROOM ID FOR EASY REFERENCE LATER
       * SET ROOM CATEGORY FROM EVENT DATA
       */

      // TODO: decide if to change back to random id or keep as host userid
      const room = {
        _type: "rooms",
        room_id: userRef,
        category: category,
        range: {
          start: start,
          end: end,
        },
      };

      // *CREATE ROOM / RERTEIVE CREATED ROOM ID
      const res = await client.create(room).then((res) => res._id);

      /*
       * ADD HOST TO CREATED ROOM
       * RETREIVE ROOM_ID TO SEND BACK TO CLIENT SIDE
       */

      const room_id = await client
        .patch(res)
        .setIfMissing({ players: [] })
        .insert("after", "players[-1]", [
          {
            controller: {
              _type: "reference",
              _ref: `${userRef}`,
            },
            points: 0,
            status: {
              alive: true,
            },
            statuseffects: {
              none: true,
            },
          },
        ])
        .commit({ autoGenerateArrayKeys: true })
        .then((res) => res.room_id);

      //*MAKE HOST SOCKET JOIN ROOM ID
      socket.join(room_id);

      // *SEND CREATED ROOM ID BACK TO CLIENT SIDE
      cb(room_id);
    } catch (error) {
      console.log(error);
    }
  });

  // TODO REDUCE AMOUNT OF DATA FETCHED
  socket.on("JOIN_USER", async (data) => {
    const { username, host, _id } = data;

    try {
      if (!username || !host || !_id) {
        console.table([username, host, _id]);
        throw "Fields missing error";
      }

      const hostQuery = `*[_type == "users" && username == "${host}"]`;
      const guestQuery = `*[_type == "users" && username == "${username}"]`;

      const guestRef = await client.fetch(guestQuery).then((res) => res[0]);

      const hostObject = await client.fetch(hostQuery).then((res) => res[0]);
      const host_id = hostObject._id;

      // * GET ROOM TO ADD GUEST ON BACKEND USING HOST ID
      // ? ROOM_ID ALWAYS SAME AS HOST ID
      const roomQuery = `*[_type == "rooms" && room_id == "${host_id}"]`;

      const target_room_id = await client
        .fetch(roomQuery)
        .then((res) => res[0]._id);

      if (!target_room_id) {
        throw console.log("room not found");
      }

      console.log("this is target room id", target_room_id);

      // * GET ROOM TO PATCH USING DESTRUCTURED ID
      await client
        .patch(target_room_id)
        .setIfMissing({ players: [] })
        .insert("after", "players[-1]", [
          {
            controller: {
              _type: "reference",
              _ref: `${guestRef._id}`,
            },
            points: 0,
            status: {
              alive: true,
            },
            statuseffects: {
              none: true,
            },
          },
        ])
        .commit({ autoGenerateArrayKeys: true });

      const categoryQuery = `*[_type == "rooms" && room_id == "${_id}"]{category}`;
      const category = await client
        .fetch(categoryQuery)
        .then((res) => res[0].category);

      console.log("ACCEPTED INVITE FROM", _id);

      /*
           * !SEND EVENT TO GUEST SOCKET
           * DATA BEING SENT BACK TO GUEST IS THE HOST ID 
           * HOST ID IS THE SAME AS ROOM ID TO NAVIGATE TO ON GUEST SIDE
             TODO: ADD MEANINGFUL DATA TO EMIT EVENT
            */
      socket.emit("JOIN_HOST_ROOM", { _id, category });

      // * SEND EVENT TO HOST SOCKET
      userNamespace
        .to(`user_${host}`)
        .emit("INVITATION_ACCEPTED", { guestRef, host_id });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("ADD_GUEST", async (data, cb) => {
    const { room_id, guestRef, guestName } = data;

    // *FIND ROOM

    // * ADD GUEST TO ROOM
    console.log("this is guest ref", guestRef);

    // * ROOMQUERY TO GET  TARGET ROOM USING HOST ID
    // TODO:STREAMLINE QUERY TO INCLUDE MEANINGFUL DATA ONLY
    const roomQuery = `*[_type == "rooms" && room_id == "${room_id}"]{_id, players[]{...,controller -> {..., character -> {name}}}}`;
    const room = await client.fetch(roomQuery).then((res) => res[0]);

    // * DESTRUCTURE ID FROM QUERY RESULT
    const { _id } = room;
    console.log("this is room id", _id);

    // * GET ROOM TO PATCH USING DESTRUCTURED ID
    await client
      .patch(_id)
      .setIfMissing({ players: [] })
      .insert("after", "players[-1]", [
        {
          controller: {
            _type: "reference",
            _ref: `${guestRef}`,
          },
          points: 0,
          status: {
            alive: true,
          },
          statuseffects: {
            none: true,
          },
        },
      ])
      .commit({ autoGenerateArrayKeys: true });

    // * GET GUEST USERNAME FROM PLAYERS IN PATCHED USING GUESTREF FROM EVENT DATA
    // const username = players.find(player => player.controller._id == guestRef).controller.username
    console.log(guestName);

    // * SEND BACK USERNAME TO  HOST AS POPUP
    cb(guestName);
  });

  // ? NAVIGATE TO ROOM ID ASSIGNED BY SANITY ?
  socket.on("LAUNCH_ROOM", async (data, cb) => {
    const { room_id } = data;
    const roomQuery = `*[_type == "rooms" && room_id == "${room_id}"]{_id, category, players[]{...,controller -> {..., character -> {name}}}}`;
    const room = await client.fetch(roomQuery).then((res) => res[0]);

    const { _id: roomID, category, players: list } = room;

    const players = list.map((player) => ({
      socket: player.controller.socket,
    }));

    console.log(players);

    players.forEach((player) => {
      // io.to(`${player.socket}`).emit("ROOM_READY", {
      //   room_id,
      //   category,
      // });
      userNamespace.to(`${player.socket}`).emit("ROOM_READY", {
        room_id,
        category,
      });
    });

    await client
      .patch(roomID)
      .set({ game_started: true })
      .commit({ autoGenerateArrayKeys: true });

    cb({
      room_id,
      category,
      players,
    });
  });
}

// TODO:ADD TRY CATCH TO ALL DANGEROUS EVENTS
export function MatchEvents(socket, userNamespace) {
  // * function to increase user points and return user scores
  const increaseUserPoints = async (room_id, username, incorrect) => {
    const roomQuery = `*[_type == "rooms" && room_id == "${room_id}"]{_id,players[]{...,controller ->  {...}}}`;

    if (incorrect) {
      console.log(incorrect);
    }

    try {
      const room = await client
        .fetch(roomQuery)
        .then((res) => res[0])
        .catch((error) => {
          throw () => console.log(error);
        });

      if (!room) {
        throw console.log(room);
      }
      const { players, _id: roomID } = room;

      // !DONT ADD POINTS TO ROOM IF INCORRECT
      if (!incorrect) {
        const scores = players.map((player) => {
          return {
            points: player.points,
            username: player.controller.username,
          };
        });
        return new Promise((resolve) => {
          resolve(scores);
        });
      }

      // !ONLY ADD POINTS TO ROOM IF NOT INCORRECT
      if (incorrect) {
        // * ADD POINTS TO USER
        // ! LIST OF PLAYERS TO SEND BACK
        const returnList = players.map((player) => {
          if (player.controller.username == username) {
            return {
              username: player.controller.username,
              points: player.points + 10,
            };
          }

          return player;
        });

        // ! LIST TO ADD POINTS TO ROOM IN SERVER
        const updatedList = players.map((player) => {
          if (player.controller.username == username) {
            return {
              controller: {
                _type: "reference",
                _ref: `${player.controller._id}`,
              },
              points: player.points + 10,
            };
          }

          return {
            controller: {
              _type: "reference",
              _ref: `${player.controller._id}`,
            },
            points: player.points,
          };
        });

        await client
          .patch(`${roomID}`)
          .setIfMissing({ players: [] })
          .set({ players: updatedList })
          .commit({ autoGenerateArrayKeys: true });

        return new Promise((resolve) => {
          resolve(returnList);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function generateQuestionsIndex() {
    const randomNumber = Math.floor(Math.random() * 30); // Generate a random number between 0 and 30
    const number1 = randomNumber;
    const number2 = randomNumber + 20;

    return {
      start: number1,
      end: number2,
    };
  }

  socket.on("SET_ROOM", async (data, cb) => {
    const { room_id, username, category } = data;
    const { start, end } = generateQuestionsIndex();
    console.log(start, end);

    try {
      let categoryName = category.replace("_", " ");
      if (!category) {
        throw console.log("category not found");
      }

      console.log(categoryName);
      const roomQuery = `*[_type == "rooms" && room_id == "${room_id}"]{range, players[]{...,controller -> {..., character -> {...}}}}`;

      // TODO:RANDOMIZE QUESTION QUERY
      // ?HINT ADD QUESTIONS OBJECT TO ROOM AND THEN PATCH ROOM WITH THOSE QUESTIONS ON INITIAL LOAD.
      // ? OPTION 2 ADD RANGE OBJECT TO ROOM WITH START AND STOP AND THEN WHEN CREATING ROOM DO THE GENRATION FUNCTION THERE AND SET A FIXED START AND END POINT TO THE ROOM GEENRATED ON INITIAL ROOM CREATION
      // ?THEN INCLUDE THIS RANGE OBJECT IN THE ROOM QUERY AND FILTER THE QUESTION QUERY USING THE ROOM START AND END VARIABLE FROM RANGE OBJECT

      // const questionQuery = `*[_type == "questions" && category match "${categoryName}"][${start}...${end}]`;
      const room = await client.fetch(roomQuery).then((res) => res[0]);

      if (!room) {
        throw console.log("Room not found, check room_id and try again");
      }

      const { players, range } = room;
      const { start, end } = range;

      console.table([start, end]);

      // const questionQuery = `*[_type == "questions" && category match "${categoryName}"]`;
      const questionQuery = `*[_type == "questions" && category match "${categoryName}"][${start}...${end}]`;

      const questions = await client.fetch(questionQuery);

      if (questions.length < 1) {
        throw console.log(
          "No questions found please check category and try again"
        );
      }

      if (!username) {
        throw console.log("username not found, check username and try again");
      }

      const CurrentPlayer = players
        .filter((player) => player.controller.username == username)
        .map((player) => {
          const { traits } = player.controller.character;
          const { peeks, lives, ultimates } = traits;
          return {
            character: player.controller.character,
            characterAvatar: urlFor(player.controller.character.avatar).url(),
            username: player.controller.username,
            points: player.points,
            lives: lives,
            peeks: peeks,
            ultimates: ultimates,
            status: player.status,
            statuseffects: player.statuseffects,
            questions,
          };
        });

      const OtherPlayers = players
        .filter((player) => player.controller.username != username)
        .map((player) => {
          const { traits } = player.controller.character;
          const { peeks, lives, ultimates } = traits;
          return {
            character: player.controller.character,
            characterAvatar: urlFor(player.controller.character.avatar).url(),
            username: player.controller.username,
            points: player.points,
            lives,
            peeks,
            ultimates: ultimates,
            status: player.status,
            statuseffects: player.statuseffects,
            questions,
          };
        });

      if (!room_id) {
        throw console.log("room_id not found, check username and try again");
      }
      socket.join(room_id);

      cb({
        CurrentPlayer: CurrentPlayer[0],
        OtherPlayers,
        questions,
      });
    } catch (error) {
      console.log(error);
    }
    // io.in(roomID).emit("ping_room", room.players)
  });

  // *HANDLE ANSWER SEND BACK SCORES
  socket.on("SELECTED_OPTION", async (data) => {
    const { room_id, username, correct } = data;

    // *DETERMINE IF USER POINTS SHOULD BE INCREASED
    switch (true) {
      // * HANDLE CORRECT ANSWER
      case correct:
        console.log("correct answer");
        try {
          console.log(room_id);
          if (!room_id || !username) {
            throw console.log("no room id");
          }

          // * function to increase both userpoints and return user list
          const list = await increaseUserPoints(room_id, username, correct);
          socket.join(room_id);
          userNamespace.in(room_id).emit("RESPONSE_RECEIVED", list);
        } catch (error) {
          console.log(error);
        }
        break;
      // * HANDLE INCORRECT ANSWE
      case !correct:
        try {
          console.log("Incorrect answer");
          if (!room_id || !username) {
            throw console.log("no room id");
          }
          // * function to increase both userpoints and return user list
          const list = await increaseUserPoints(room_id, username, correct);
          socket.join(room_id);
          userNamespace.in(room_id).emit("RESPONSE_RECEIVED", list);
        } catch (error) {
          console.log(error);
        }
        break;

      default:
        break;
    }
  });

  socket.on("TALLY_GAME", async (data, cb) => {
    const { room_id } = data;
    const roomQuery = `*[_type == "rooms" && room_id == "${room_id}"]{players[]{...,controller ->  {...}}}`;

    try {
      const room = await client.fetch(roomQuery).then((res) => res[0]);

      if (!room) {
        throw console.log(
          "Room not found while talying game, check room_id or query"
        );
      }

      const { players } = room;
      socket.join(room_id);

      cb(players);
    } catch (error) {
      console.log(error);
    }
    // io.in(roomID).emit("RESPONSE_RECEIVED", CurrentPlayer);
  });

  // TODO:ADD TRY CATCH TO ALL DANGEROUS EVENTS
  socket.on("USE_POWER", (data, cb) => {
    const { name, room_id } = data;

    cb(name);
    userNamespace.in(room_id).emit("POWER_USED", name);

    switch (name) {
      case "Arhuanran":
        userNamespace.in(room_id).emit("POWER_USED", name);
        break;
      default:
        break;
    }

    // const OtherPlayers = rooms
    //   .find((room) => room.id == roomID)
    //   .players.filter((player) => {
    //     return player.username != userName;
    //   });
  });

  socket.on("DEBUFF", (data, cb) => {
    const { debuff, target_name, room_id, sender } = data;
    console.log(debuff);
    cb(debuff);
    userNamespace.in(room_id).emit("DEBUFF_USED", {
      debuff,
      target_name,
      sender,
    });
  });

  // TODO:ADD TRY CATCH TO ALL DANGEROUS EVENTS
  socket.on("PLAYER_DEATH", (data) => {
    const { room_id, username } = data;

    userNamespace.in(room_id).emit("PLAYER_DEATH", username);
  });

  // TODO:ADD TRY CATCH TO ALL DANGEROUS EVENTS
  socket.on("TIME_UP", (data, cb) => {
    const { choice, roomID, level, username } = data;
    cb(level);
  });
}

export default AllEvents;
