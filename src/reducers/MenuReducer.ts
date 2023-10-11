type TpayLoadProps = {
  invitationHost: string;
  host: "",
  room_id:string,
  username: string;
  socket_id: string;
  category:string | undefined,
  _id:string
};

type MenuActions = {
  type: "SET_SINGLE_PLAYER" | "SET_MULTIPLAYER" | "HANDLE_INVITE" | "ACCEPT_INVITE" | "SEARCH_PLAYERS" | "CLOSE_MODAL" | "SET_CATEGORY";
  payload?: TpayLoadProps | null;
};

export const defaultMenuState = {
  invitationReceived: false,
  inviteSent: false,
  host: {
    username: "",
    socket_id: "",
    host_room:"",
    _id:""
  },
  category:"",
  modeSelected:false,
  mode:""
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MenuReducer(state: any, action: MenuActions) {
  const { type, payload } = action;

  switch (type) {
    case "HANDLE_INVITE":
      console.log(payload?._id);
      // TODO GET CATEGORY FROM SOMEWHERE ELSE
      // TODO INCOPRATE PROPER TYPING FOR REDUCER
      // * CATEGORY IS GOTTEN FROM PAYLOAD WHICH IS GOTTEN FROM INVITATION EVENT
      localStorage.setItem("category", payload?.category)
      return {
        ...state,
        host: {
          username: payload?.username,
          socket_id: payload?.socket_id,
          host_room:payload?.room_id,
          _id:payload?._id
        },
        invitationReceived: true,
      };
    case "CLOSE_MODAL":
      return { ...state, invitationReceived: false };
      case "SET_SINGLE_PLAYER":
        return {...state, mode:"SINGLE_PLAYER"}
        case "SET_MULTIPLAYER":
          return {...state, mode:"MULTI_PLAYER"}
    default:
      return { ...state };
  }
}

export default MenuReducer;
