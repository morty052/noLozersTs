import { player } from "@/types/player";

type TscreenProps = {
  question: string;
  CurrentPlayer: player | null;
};

const Screen = ({ CurrentPlayer, question }: TscreenProps) => {
  return (
    <div className="relative w-full px-2 pt-2 ">
      <div className="grid h-52 place-content-center rounded-lg  border px-4 text-center">
        <p className="text-xl font-medium">{question}</p>
      </div>
      <img
        className="absolute right-4 top-4 h-10 w-10 rounded-full object-cover"
        src={CurrentPlayer?.characterAvatar}
        alt=""
      />
      <div className="absolute left-4 top-4">
        <p className="text-xl font-black">{CurrentPlayer?.points}</p>
      </div>
    </div>
  );
};

export default Screen;
