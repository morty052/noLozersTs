import { useReducer, useEffect } from "react"





function UsernameInput({ username, setUsername, setUser }) {
    return (
      <div className="flex items-center gap-x-4">
        <input
          className="w-72"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
        />
        <button className="text-white" onClick={() => setUser()}>
          Set username
        </button>
      </div>

    );
  }

  export default UsernameInput