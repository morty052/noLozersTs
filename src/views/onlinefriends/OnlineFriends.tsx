import { player } from "@/types";
import { useState, useEffect } from "react";
import { useSocketcontext } from "@/hooks/useSocketContext";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
function OnlineFriends() {
  const { socket } = useSocketcontext(); //* GET SOCKET

  const { room_id } = useParams(); // * GET ROOM ID

  const { user, isLoaded } = useUser(); //  * GET USER
  const username = user?.username;

  const [players, setplayers] = useState([]); //   *PLAYERS

  const [friends, setfriends] = useState([]); //   *FRIENDS

  // * PLAYER SEARCH QUERY
  const [playerName, setplayerName] = useState("");

  // * FILTER PLAYERS USING SEARCH QUERY
  const results =
    players?.length > 1
      ? players.filter((player: player) => player.username.includes(playerName))
      : [];

  // * FRIEND REQUEST HANDLER
  function handleFriendRequest(target: string) {
    // TODO: Implement friend request handling logic here
    // You can access the player object to get information about the friend request
    // For example, you can access player.username to get the username of the player who sent the friend request
    // You can use this information to display a notification or update the UI accordingly

    socket?.emit("FRIEND_REQUEST", { username: target, sender: username });
  }

  // * INVITE PLAYER FUNCTION
  function invitePlayer(target_user: string | undefined) {
    /* 
      TODO:CHANGE USERNAME LOCATION FROM LOCAL STORAGE
      TODO:ADD ROOM_ID TO INVITATION REQUEST
      * THE USERNAME IS THE USERNAME OF THE SENDER
      * THE SOCKET ID BELONGS TO TARGET USER
      */

    // !original function
    // socket?.emit("SEND_INVITATION", { socket_id, username:hostName, room_id });

    socket?.emit("SEND_INVITATION", { target_user, room_id, sender: username });
  }

  // *FETCH FRIENDS AND PLAYERS
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    // * FETCH ONLY FRIENDS OF CURRENT PLAYER
    async function fetchFriends() {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "insomnia/8.0.0",
        },
        body: `{"username":"${username}"}`,
      };
      const { onlineFriends } = await fetch(
        "http://localhost:3000/friends",
        options
      )
        .then((res) => res.json())
        .then((res) => res);
      console.log(onlineFriends);
      //   CreateRoomDispatch({
      //     type: "FETCH_FRIENDS",
      //     payload: { friends: onlineFriends },
      //   });
      setfriends(onlineFriends);
    }

    //  * FETCH ALL PLAYERS
    async function fetchPlayers() {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"username":"${username}"}`,
      };
      const { players } = await fetch("http://localhost:3000/players", options)
        .then((res) => res.json())
        .then((res) => res);
      console.log(players.length);

      //   CreateRoomDispatch({
      //     type: "FETCH_PLAYERS",
      //     payload: { players: players },
      //   });
      setplayers(players);
    }

    fetchFriends();
    fetchPlayers();
  }, [socket, isLoaded]);
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="px-2 pt-10">
      <form action="">
        <div className="flex flex-col gap-y-4">
          <div className="relative">
            <input
              value={playerName}
              onChange={(e) => setplayerName(e.target.value)}
              className="h-10 w-full rounded-lg border p-2 placeholder:text-center"
              placeholder="Type to search players"
              type="text"
              name=""
              id=""
            />
            <p className="mt-1 text-center text-xs text-gray-50">
              Search players by username
            </p>

            <aside
              className={`${
                !playerName ? "hidden" : "block"
              } absolute inset-x-0 top-12 z-10 rounded-xl border bg-white p-4 shadow-xl`}
            >
              Display message if no results match search
              {playerName && results.length < 1 && (
                <p>No results match your search</p>
              )}
              {results?.map((player: player, index: number) => (
                <p
                  onClick={() => {
                    handleFriendRequest(player.username);
                    setplayerName("");
                  }}
                  key={index}
                >
                  {player.username}
                </p>
              ))}
              <div className="mt-2 bg-red-300">
                <p>Click on player to send invite</p>
              </div>
            </aside>
          </div>
          {/* <Button
            onClick={(e) => {
              e.preventDefault();
              handleCreation();
            }}
          >
            Search Players
          </Button> */}
        </div>
      </form>

      <div className="pt-8">
        <h3 className="text-2xl font-bold text-white">Online Friends:</h3>
      </div>
      {friends?.map((friend: player, index) => {
        return (
          <p
            onClick={() => invitePlayer(friend.username)}
            className="font-medium text-white"
            key={index}
          >
            {friend.username}
          </p>
        );
      })}
    </div>
  );
}

export default OnlineFriends;
