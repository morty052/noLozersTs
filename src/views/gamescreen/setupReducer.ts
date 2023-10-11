import { All_Categories } from "../../constants";


export const setupActions = {
    PLAY_ONLINE: "PLAY_ONLINE",
    PLAY_ALONE: "PLAY_ALONE",
    SET_CATEGORY:"SET_CATEGORY",
    SET_CHARACTER:"SET_CHARACTER"
  };

 export  const state = {
    category: "",
    username: "",
    character:"",
    categories: All_Categories,
    singlePlayer: false,
    multiPlayer: false,
    playModeSet:false,
    characterSet:false,

  };

function setupReducer(state, action) {
    switch (action.type) {
      case "PLAY_ONLINE":
        return { ...state, multiPlayer: true, playModeSet:true  };
      case "PLAY_ALONE":
        return { ...state, singlePlayer:true,  playModeSet:true  };
      case "SET_CATEGORY":
        console.log(action.payload)
        return { ...state, category:action.payload };
      case "SET_CHARACTER":
        console.log(action.payload)
        return { ...state, character:action.payload, characterSet:true };
      default:
        break;
    }
  }

  export default setupReducer