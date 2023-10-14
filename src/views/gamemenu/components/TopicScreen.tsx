import { FaStar } from "react-icons/fa";
import { useSocketcontext } from "@/hooks/useSocketContext";
import { All_Categories } from "@/constants";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function TopicScreen() {
  // TODO DO SOMETHING WITH SIGNED IN STATE
  const { user, isLoaded } = useUser();

  const { socket } = useSocketcontext();

  const username = user?.username;

  const navigate = useNavigate();

  // * CREATE ROOM FUNCTION
  function handleCreation(id: string) {
    // * SET CATEGORY CHOICE
    localStorage.setItem("category", id);

    // * RETREIVE CATEGORY
    const category = localStorage.getItem("category");

    // * SEND EVENT TO SERVER TO CREATE ROOM FROM CLIENT SIDE
    socket?.emit("CREATE_ROOM", { username, category }, (res: string) => {
      // *DISPATCH CREATE ROOM EVENT / SAVE ROOM ID TO EVENT STATE
      // !ORIGINAL FUNCTION
      // window.location.assign(`/menu/createroom/${res}`);

      navigate(`/lobby/${res}`);
    });
  }

  if (!isLoaded) {
    return <p>....loading</p>;
  }

  return (
    <div className="w-full   px-2 py-6">
      <p className="text-center text-2xl font-semibold text-white">
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
