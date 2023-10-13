import { FaStar } from "react-icons/fa";
import { useSocketcontext } from "@/hooks/useSocketContext";
import { All_Categories } from "@/constants";
import { useState } from "react";
import { useUserContext } from "@/contexts/userContext";

function TopicScreen() {
  const [category, setCategory] = useState("");

  // TODO GET USERNAME FROM SOMEWHERE ELSE
  const { username } = useUserContext();

  const { socket } = useSocketcontext();

  // * CREATE ROOM FUNCTION
  function handleCreation(id: string) {
    localStorage.setItem("category", id);
    const category = localStorage.getItem("category");
    // sset category
    // * SEND EVENT TO SERVER TO CREATE ROOM FROM CLIENT SIDE
    socket?.emit("CREATE_ROOM", { username, category }, (res) => {
      // *DISPATCH CREATE ROOM EVENT / SAVE ROOM ID TO EVENT STATE

      window.location.assign(`/menu/createroom/${res}`);
    });
  }

  return (
    <div className="w-full bg-white   px-2 py-6">
      <p className="text-center text-2xl font-semibold text-black">
        Select Category
      </p>
      <ul className="flex flex-col items-center gap-y-8 pt-4">
        {All_Categories?.map((category, index) => {
          const { name, id } = category;

          return (
            <li
              key={index}
              className="flex w-full cursor-pointer items-center  justify-between  rounded-lg  border p-2 text-xl font-semibold text-black shadow-lg"
              onClick={() => handleCreation(id)}
            >
              <span>{name}</span>
              <span>
                <FaStar />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TopicScreen;
