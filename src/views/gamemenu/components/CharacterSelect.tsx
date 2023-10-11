import { useEffect, useReducer, useState } from "react";
// import characters from "@/constants/characters"
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { useSocketcontext } from "@/hooks/useSocketContext";
import { FaChevronLeft, FaChevronRight, FaEye, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export type character = {
  name: "Arhuanran" | "Athena" | "Da Vinci" | "Ife" | "Washington";
  bio: string;
  avatar?: string;
  traits?: {
    peeks: number;
    peekType: string;
    lives: 2 | 3 | 4 | 6;
    ultimate: "REJUVENATE" | "INVENT" | "CONQUER" | "FORSEE";
  };
};

type Tstate = {
  index: number;
  characters: [] | character[];
  activeCharacter: character | null;
};

type TCharacterActions = "INIT" | "NEXT" | "PREV";

type ACTION = {
  type: TCharacterActions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

export function MiniCharacterSelect({
  func,
}: {
  func: (character: character) => void;
}) {
  const [characters, setcharacters] = useState<null | character[]>(null);
  const { socket } = useSocketcontext();

  // TODO CHANGE LOCATION OF USERNAME
  const username = localStorage.getItem("username");

  async function handleCharacter(character: character) {
    func(character);
    socket?.emit("SET_CHARACTER", { character, username });
  }

  useEffect(() => {
    async function fetchCharacters() {
      await fetch("http://localhost:3000/characters")
        .then((res) => res.json())
        .then((res: { characters: character[] }) => {
          console.log(res);
          setcharacters(res.characters);
          console.log(res);
        });
    }

    fetchCharacters();
    // CharacterDispatch({type:INIT})

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="absolute -top-48 z-10 min-h-[180px] w-full max-w-xs rounded-xl bg-red-300 p-4 shadow-xl">
      {!characters ? (
        <div className=" flex h-[70px] w-full flex-col items-center justify-center ">
          <p>..loading</p>
        </div>
      ) : (
        <div className="space-y-2">
          {characters?.map((character, index) => (
            <div key={index} className="flex items-center gap-x-2">
              <img
                className="w-8  rounded-full object-contain"
                src={character.avatar}
                alt=""
              />
              <p
                onClick={() => handleCharacter(character as character)}
                className="text-xs font-medium"
              >
                {character.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CharacterSelect({ func }: { func: (character: character) => void }) {
  const state = {
    index: 0,
    characters: [],
    activeCharacter: null,
  };

  function reducer(state: Tstate, action: ACTION) {
    const { index } = state;
    const { type } = action;

    switch (type) {
      case "INIT":
        console.log(action.payload);
        return { ...state, characters: action.payload };

      case "NEXT":
        console.log(index);
        if (index + 1 == action.payload) {
          return { ...state, index: 0 };
        }

        return { ...state, index: index + 1 };
      case "PREV":
        console.log(index);
        if (index - 1 < 0) {
          return { ...state, index: 0 };
        }
        return { ...state, index: index - 1 };

      default:
        return { ...state };
    }
  }

  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [CharacterState, CharacterDispatch] = useReducer(reducer, state);

  const { index, characters } = CharacterState;
  const { socket } = useSocketcontext();

  const activeCharacter: "" = characters ? characters[index] : [];

  useEffect(() => {
    async function fetchCharacters() {
      const { characters } = await fetch("http://localhost:3000/characters")
        .then((res) => res.json())
        .then((res) => res);
      console.log(characters);
      CharacterDispatch({ type: "INIT", payload: characters });
    }

    fetchCharacters();
    // CharacterDispatch({type:INIT})

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeCharacter) {
    return <p>...loadiing</p>;
  }

  const { avatar, bio, name, traits } = activeCharacter;
  const { peeks, lives, ultimate, peektype } = traits;

  const username = localStorage.getItem("username");

  function handleCharacter(activeCharacter: character) {
    func(activeCharacter);
    socket?.emit("SET_CHARACTER", { character: activeCharacter, username });
  }

  return (
    <main className="grid h-screen grid-rows-2 ">
      {/* CHARACTER DISPLAY */}
      <section className=" relative border border-black bg-white ">
        {/* Back Button */}
        <div
          onClick={() => navigate(-1)}
          className="absolute left-1 top-1 flex items-center gap-x-2 border bg-white/50 p-1 text-black"
        >
          <span className="">&#8592;</span> <p className="text-sm">Back</p>
        </div>

        {/* Image */}
        <img className=" h-full w-full object-cover" src={avatar} alt="" />

        {/* Controls */}
        <div
          onClick={() =>
            CharacterDispatch({ type: "PREV", payload: characters.length })
          }
          className="absolute top-1/2 grid h-10 w-10 place-content-center rounded-full border border-blue-500 bg-gray-50/50 p-2"
        >
          <p>
            <FaChevronLeft />
          </p>
        </div>
        <div
          onClick={() =>
            CharacterDispatch({ type: "NEXT", payload: characters.length })
          }
          className="absolute right-0 top-1/2 grid h-10 w-10 place-content-center rounded-full border border-blue-500 bg-gray-50/50 p-2"
        >
          <p>
            <FaChevronRight />
          </p>
        </div>

        {/* NAME  */}
        <div className="absolute bottom-1 left-1 w-40 rounded-lg bg-white/50 p-1 text-center">
          <p className="text-3xl font-semibold">{name}</p>
        </div>
      </section>

      {/* Tabs */}
      <section className="overflow-scroll pt-4 ">
        <Tabs defaultValue="BIO" className="">
          <TabsList className="space-x-4">
            <TabsTrigger className="w-20 bg-red-200" value="BIO">
              Bio
            </TabsTrigger>
            <TabsTrigger className="w-20 bg-red-200" value="TRAITS">
              Traits
            </TabsTrigger>
            <Button onClick={() => handleCharacter(activeCharacter)}>
              Select Character
            </Button>
          </TabsList>

          <TabsContent className="p-2 " value="BIO">
            <div className=" h-60 rounded-lg border border-dashed border-black p-2 ">
              <p className=" font-medium first-letter:uppercase">{bio}</p>
            </div>
          </TabsContent>
          <TabsContent value="TRAITS">
            {/* TRAITS HEADER */}
            <div className="p-2 ">
              <span className="text-lg font-semibold tracking-wide">
                Traits
              </span>
            </div>

            {/* TRAITS CONTAINER */}
            <ul className="space-y-4 px-2 pb-8">
              <li className="flex items-center justify-between gap-x-4 rounded-lg border border-black px-8 py-1.5 shadow-md">
                <p className=" text-lg font-medium">Peeks </p>
                <span className="flex items-center justify-between gap-x-2 text-lg">
                  {peeks}
                  <FaEye />{" "}
                </span>
              </li>
              <li className="flex items-center justify-between gap-x-4 rounded-lg border border-black px-8 py-1.5 shadow-md">
                <p className=" text-lg font-medium">Lives </p>
                <span className="flex items-center justify-between gap-x-2 text-lg">
                  {lives}
                  <span>
                    <FaHeart />
                  </span>{" "}
                </span>
              </li>
              <li className="flex  flex-col  rounded-lg border border-black px-2 py-1.5 shadow-md">
                <p className=" text-lg font-semibold">Peek Type </p>
                <div className="text-base font-medium">{peektype} </div>
              </li>
              <li className="flex h-[100px] flex-col  rounded-lg border border-black px-2 py-1.5 shadow-md">
                <p className=" text-lg font-semibold">Ultimate </p>
                <div className="text-base font-medium">{ultimate}</div>
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}

export default CharacterSelect;
