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
} from "./views";
import "./globals.css";
import { Layout } from "./components";
import { CreateRoom, TopicScreen } from "./views/gamemenu/components";
import { UserContextProvider } from "./contexts/userContext";

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      {/* HOME OF THE SOCKET */}
      <Route element={<Layout />}>
        <Route path="/menu/*" element={<GameMenu />} />
        <Route path="/lobby/:room_id/:category/" element={<Lobby />} />
        <Route path="/test/" element={<Test />} />
        <Route path="/room/category" element={<TopicScreen />} />
        <Route path="/room/:room_id" element={<CreateRoom />} />
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
      <UserContextProvider>
        <RouterProvider router={Router} />
      </UserContextProvider>
      {/* <InvitationModal /> */}
    </>
  );
}

export default App;
