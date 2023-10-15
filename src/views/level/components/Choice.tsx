import { TstatusTypes } from "./ChoiceList";

type Props = {
  text: string;
  func: () => void;
  statusEffects?: TstatusTypes | null;
};

const Choice = ({ text, func, statusEffects }: Props) => {
  return (
    <div className="flex">
      <button
        type="button"
        className={`w-full rounded-xl border px-4 py-2 ${
          statusEffects && "bg-black text-black"
        }`}
        onClick={() => func()}
      >
        {text}
      </button>
    </div>
  );
};

export default Choice;
