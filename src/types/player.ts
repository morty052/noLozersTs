import { Debuffs, characterName } from "@/classes/Player";
import { character } from "@/views/gamemenu/components/CharacterSelect";
import { Socket } from "socket.io-client";

export type player = {
  _id: string;
  socket?: string | undefined;
  username: string;
  characterAvatar: string;
  points?: number;
  lives?: number;
  ultimates: number;
  status: "";
  statuseffects: "";
  powerBars: number;
  peeks: number;
  questions: {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }[];
  partners?: player[];
  callDebuff: (props: {
    target_name: string;
    name: characterName;
    sender: string;
  }) => {
    debuff: Debuffs;
    target_name: string;
    sender: string;
  };
  Debuff: (d: Debuffs) => void | undefined;
  callPowers: (params: {
    answer: string;
    nextQuestion: string;
    thirdQuestion: string;
    socket: Socket;
    roomID: string;
    func: (lives: number, powerBars: number) => void;
  }) => void | undefined;
  ultimate: (params: {
    answer: string;
    nextQuestion: string;
    thirdQuestion: string;
    socket: Socket;
    roomID: string;
    func: (name: string) => void;
  }) => void | undefined;
  character: character;
  ultimateBars: number;
  teamUp: (player: player | undefined) => void;
  controller?: {
    username: string;
    socket?: string;
  };
};
