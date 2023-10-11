export const SceneState = {
    blinking:true,
    finished:false,
    bg:"",
    timeUp:"",
  
}



const SceneReducer = (state, action) => {

    console.log("used")

    switch (action.type) {
      case "END_SCENE":
        return {...state, finished:true }
        
      case "END_RESPONSE":
        return {...state, responseReceived:true }

      case "END_CLIMAX":
        return {...state, climaxReceived:true }

      case "END_FINALE":
        return {...state, finaleReceived:true }

      case "ADJUST_SCREEN":
        return {...state }

      case "ACTIVATE_EVENT":
        return {...state, event:true, object:action.payload, }
    
      default:
        break;
    }
  
  }

  export default SceneReducer