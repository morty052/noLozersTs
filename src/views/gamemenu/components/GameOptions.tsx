import { Link } from "react-router-dom";

// interface IgameProps{
//   setSinglePlayer:(mode:string) => void,
//   setMultiplayer:(mode:string) => void
// }

function GameOptions() {
  return (
    <div className="">
      <Link
        to={"options/ONLINE"}
        className=" mx-auto  flex w-72 justify-center rounded-full border border-red-200 p-2"
      >
        <p className="animate-pulse text-2xl font-semibold text-white">
          Play Online
        </p>
      </Link>

      <Link
        to={"options/OFFLINE"}
        className=" mx-auto mt-6  flex w-72 justify-center rounded-full border border-red-200 p-2"
      >
        <p className="animate-pulse text-2xl font-semibold text-white">
          Play Alone
        </p>
      </Link>
    </div>
  );
}

export default GameOptions;
