import { createRoot } from "react-dom/client";
import "tailwindcss/tailwind.css";
import App from "./App";
import { SocketContextProvider } from "./contexts/SocketContext";

const container = document.getElementById("root") as HTMLDivElement;
const root = createRoot(container);

root.render(
//   <SocketContextProvider>
//   </SocketContextProvider>
    <App />
);
