import { shuffle } from "lodash";
import { Choice } from ".";
import { useState } from "react";

type Props = {
  choices: string[];
  handleAnswer: (c: string) => void;
  correct_answer: string;
  setconfused: (c: boolean) => void;
  confused: boolean;
};

const ChoiceList = ({
  choices,
  handleAnswer,
  correct_answer,
  confused,
  setconfused,
}: Props) => {
  const l = choices ? [correct_answer, ...choices] : [];

  const list = shuffle(l);

  const shitText = "SHIT";

  const handleAnswerinteraction = (i: string) => {
    if (confused) {
      setconfused(false);
    }
    handleAnswer(i);
  };

  return (
    <div className="flex flex-col gap-y-6 px-2 pt-6">
      {list?.map((i: string, index: number) => (
        <Choice
          func={() => handleAnswerinteraction(i)}
          text={!confused ? i : shitText}
          key={index}
        />
      ))}
    </div>
  );
};

export default ChoiceList;
