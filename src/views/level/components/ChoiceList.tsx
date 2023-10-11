import {shuffle} from "lodash"
import { Choice } from ".";



type Props = {
    choices:string[],
    handleAnswer:(c:string)=> void,
    correct_answer:string
}



const ChoiceList = ({ choices, handleAnswer, correct_answer }:Props) => {
    const l = choices ? [correct_answer, ...choices] : [];
  
    const list = shuffle(l);
  
    return (
      <div className="flex flex-col gap-y-6 px-2 pt-6">
        {list?.map((i:string, index:number) => (
          <Choice func={() => handleAnswer(i)} text={i} key={index} />
        ))}
      </div>
    );
  };

  export default ChoiceList