import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Test from "./views/Test";
import {
  Level,
  SinglePlayerLevel,
  GameMenu,
  SignUp,
  Lobby,
  Login,
  SplashScreen,
  OnlineFriends,
  Room,
} from "./views";
import "./globals.css";
import { Layout } from "./components";
import {
  CreateRoom,
  TopicScreen,
  CharacterSelect,
} from "./views/gamemenu/components";

import { ClerkProvider } from "@clerk/clerk-react";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      {/* HOME OF THE SOCKET */}
      <Route element={<Layout />}>
        <Route path="/menu/*" element={<GameMenu />} />
        <Route path="/character" element={<CharacterSelect />} />
        <Route path="/friends" element={<OnlineFriends />} />
        <Route path="/category" element={<TopicScreen />} />
        <Route path="/lobby/:room_id/*" element={<Room />} />
        {/* <Route path="/lobby/:room_id/:category/" element={<Lobby />} /> */}
        <Route path="/room/:room_id/*" element={<CreateRoom />} />
        <Route path="/level/:room_id/:category" element={<Level />} />
        <Route
          path="/singlelevel/:room/:username/:category"
          element={<SinglePlayerLevel />}
        />
      </Route>
    </>
  )
);

function App() {
  return (
    <>
      <ClerkProvider publishableKey={clerkPubKey}>
        <RouterProvider router={Router} />
      </ClerkProvider>
      {/* <InvitationModal /> */}
    </>
  );
}

export default App;
