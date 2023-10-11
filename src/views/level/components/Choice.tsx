import React from 'react'

type Props = {
text:string,
func:() => void
}

const Choice = ({ text, func }:Props) => {
    return (
      <div className="flex">
        <button
          className="w-full rounded-xl border px-4 py-2 "
          onClick={() => func()}
        >
          {text}
        </button>
      </div>
    );
  };

export default Choice