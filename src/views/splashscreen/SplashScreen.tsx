import { Button } from "@/components";
import aroan from "@/assets/aroan.jpeg";
import { FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

function SplashScreen() {
  return (
    <div className="flex min-h-screen">
      <div className="  w-full flex-1 space-y-6 bg-gradient-to-b  from-purple-900 to-gray-700 px-2 py-4">
        {/* HERO TEXT */}
        <div className=" flex flex-col  items-center">
          <p className="text-4xl font-black tracking-wide text-white">
            Battle Trivia
          </p>
          <p className="text-lg font-medium text-white">
            Unique trivia game with friends and family
          </p>
        </div>

        {/* IMAGE */}
        <div className="flex  justify-center">
          <img className=" w-3/4 rounded-xl" src={aroan} alt="Aroan" />
        </div>

        {/* BUTTONS */}
        <div className="flex  flex-col items-center gap-y-4 px-12">
          <Link className="w-full" to={"/login"}>
            <Button className="w-full bg-white text-xl text-blue-400">
              Login
            </Button>
          </Link>
          <Link className="w-full" to={"/signup"}>
            <Button className="w-full bg-blue-400 text-xl">Sign up</Button>
          </Link>
        </div>

        {/* Follow us on Twitter */}
        <div className="flex justify-center">
          <a className=" flex items-center gap-x-2 text-sm font-medium text-white">
            Follow us on Twitter{" "}
            <span className="text-blue-400">
              <FaTwitter />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
