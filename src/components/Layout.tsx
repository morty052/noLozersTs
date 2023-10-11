import { SocketContextProvider } from "@/contexts/SocketContext"
import { Outlet } from "react-router-dom"


function Layout() {
    return(
      <SocketContextProvider>
        <Outlet/>
      </SocketContextProvider>
    )
  }

  export default Layout