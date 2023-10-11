
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, } from 'react-router-dom'
import Test from './views/Test'
import { Level, SinglePlayerLevel, GameMenu, SignUp, Lobby, Login} from './views'
import "./globals.css"
import { Layout, InvitationModal } from './components'
import { useState } from 'react'
import { CreateRoom, TopicScreen } from './views/gamemenu/components'





const Router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<Login/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<SignUp/>}/>
    <Route element={<Layout/>}>
    <Route path='/menu/*' element={<GameMenu/>}/>
    <Route path='/lobby/:room_id/:category/' element={<Lobby/>}/>
    <Route path='/test/' element={<Test/>}/>
    <Route path='/room/category' element={<TopicScreen/>}/>
    <Route path='/room/:room_id' element={<CreateRoom/>}/>
    <Route path='/level/:room_id/:category' element={<Level/>}/>
    <Route path='/singlelevel/:room/:username/:category' element={<SinglePlayerLevel/>}/>
    </Route>
    </>
  ))
  
  function App() {
  const [modalOpen, setmodalOpen] = useState(false)
    return(
      <>
     <RouterProvider router={Router}/>
     {/* <InvitationModal /> */}
      </>
    )

   
  }
  
  export default App
  