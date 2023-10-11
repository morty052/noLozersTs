export const EVENT_ACTIONS = {
    END_PHASE_ONE_NARRATION: "END_PHASE_ONE_NARRATION",
    END_PHASE_ONE: "END_PHASE_ONE",
    END_PHASE_TWO_NARRATION: "END_PHASE_TWO_NARRATION",
    END_PHASE_TWO: "END_PHASE_TWO",
    END_PHASE_THREE_NARRATION: "END_PHASE_THREE_NARRATION",
    END_PHASE_THREE: "END_PHASE_THREE",
    SETUP_FINALE: "SETUP_FINALE",
  };


const EventReducer = (state, action) => {
    const { setup } = state;
    const { openingScene, response } = setup;
  
    switch (action.type) {
      case "END_PHASE_ONE_NARRATION":
        return {
          ...state,
          setup: {
            ...setup,
            openingScene: {
              ...openingScene,
              started: false,
              ended: true,
            },
          },
        };
      case "END_PHASE_ONE":
        return {
          ...state,
          setup: {
            ...setup,
            phaseOne: false,
            phaseTwo: true,
            response: {
              ...response,
              started: true,
              ended: false,
            },
          },
        };
  
      case "END_PHASE_TWO_NARRATION":
        return {
          ...state,
          setup: {
            ...setup,
            response: {
              ...response,
              started: false,
              ended: true,
            },
          },
        };
  
      case "END_PHASE_TWO":
        return {
          ...state,
          setup: {
            ...setup,
            phaseOne: false,
            phaseTwo: false,
            phaseThree: true,
            response: {
              ...response,
              started: false,
              ended: false,
            },
          },
        };
      case "SETUP_FINALE":
        return {
          ...state,
          setup: {
            ...setup,
            ended: true,
            memory:true,
            phaseOne: false,
            phaseTwo: false,
            phaseThree: true,
            response: {
              ...response,
              started: false,
              ended: false,
            },
          },
        };
      default:
        break;
    }
  };

  export default EventReducer