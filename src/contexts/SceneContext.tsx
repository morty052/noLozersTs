import { createContext, useContext, useState, useEffect, useReducer,  } from "react";
import SceneReducer from "../reducers/SceneReducer";


const SceneContext = createContext({
    blinking:false,
    finished:false,
    backgroundEffect:"bg-black",
    timeUp:false,
})

export const SceneProvider = ({children}) => {
const [blinking, setblinking] = useState(false)
const [finished, setfinished] = useState(false)
const [background, setbackground] = useState("bg-red-300")

const ActiveScene = {
    blinking:true,
    finished:false,
    responseReceived:false,
    climaxReceived:false,
    finaleReceived:false,
    bg:"bg-black",
    timeUp:"",
    event:false,
    object:false
  
}

const [SceneState, SceneDispatch] = useReducer(SceneReducer, ActiveScene)

    return(
        <SceneContext.Provider value={{SceneDispatch, SceneState}}>
              {children}
        </SceneContext.Provider>
    )
}

export const useSceneContext = () => useContext(SceneContext)