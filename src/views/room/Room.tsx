import { useUser } from "@clerk/clerk-react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { All_Categories } from "@/constants";
import { useSocketcontext } from "@/hooks/useSocketContext";
import { Lobby, OnlineFriends } from "../index";

function TopicSwitcher({
  setswitchingCategory,
}: {
  setswitchingCategory: (bool: boolean) => void;
}) {
  const { socket } = useSocketcontext();
  const { room_id } = useParams();

  function handleSwitch(category: string) {
    socket?.emit("SET_CATEGORY", { category, room_id }, (res: string) => {
      console.log(res);
      setswitchingCategory(false);
    });
  }

  return (
    <div className="flex h-3/4 flex-col gap-y-6 overflow-scroll px-2 pt-8">
      {All_Categories.map((category, index) => (
        <button
          className="inline-flex justify-center rounded-2xl border border-white p-2 text-white shadow shadow-white"
          onClick={() => handleSwitch(category.id)}
          key={index}
        >
          <span className="font-medium">{category.name}</span>
        </button>
      ))}
    </div>
  );
}

function Room() {
  const { isLoaded } = useUser();
  const { room_id } = useParams();
  const { socket } = useSocketcontext();

  if (!isLoaded) {
    return <p>....loading</p>;
  }

  function handleGameStart() {
    console.log("clicked");
    socket?.emit(
      "LAUNCH_ROOM",
      { room_id },
      (res: { category: string; room_id: string; players: player[] }) => {
        console.log(res);
        const { category, room_id, players } = res;

        // TODO: HANDLE NAVIGATION
        console.table([category, room_id, players]);
        // window.location.assign(`/level/${room_id}/${category}`)
      }
    );
  }

  // ?CREATE ROOM ON INITIAL LOAD ?

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b  from-purple-900 to-gray-700">
        {/* BACK BUTTON */}
        <div className="fixed left-1 top-1 flex items-center gap-x-2 text-white">
          <span>&#8592;</span> <span>Exit</span>
        </div>

        {/* CONTAINER */}
        <div className="px-2 pt-14">
          {/*LINKS  */}
          <div className="flex gap-x-4 px-2">
            <Link
              className="inline-flex w-28 justify-center rounded-2xl border border-white p-2 text-white shadow shadow-white"
              to={"category"}
            >
              <span>Category</span>
            </Link>
            <Link
              className="inline-flex w-28 justify-center rounded-2xl border border-white p-2 text-white shadow shadow-white"
              to={"players"}
            >
              <span>Players</span>
            </Link>
            <Link
              className="inline-flex w-28 justify-center rounded-2xl border border-white p-2 text-white shadow shadow-white"
              to={`/lobby/${room_id}`}
            >
              <span>Lobby</span>
            </Link>
          </div>

          {/* ROUTES */}
          <Routes>
            <Route path="/" element={<Lobby />} />
            <Route path="/lobby" element={<TopicSwitcher />} />
            <Route path="/players" element={<OnlineFriends />} />
          </Routes>

          {/* START GAME BUTTON */}
        </div>
      </div>
      <div
        onClick={() => handleGameStart()}
        className="absolute inset-x-0 bottom-4 flex justify-center "
      >
        <button
          type="button"
          onClick={() => handleGameStart()}
          className="z-10 inline-flex w-full max-w-md justify-center rounded-2xl border border-white p-2  shadow shadow-white"
        >
          <span className="text-white">Start Game</span>
        </button>
      </div>
    </>
  );
}

export default Room;
