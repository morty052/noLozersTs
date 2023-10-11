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
  callPowers: (params: {
    answer: string;
    nextQuestion: string;
    thirdQuestion: string;
    socket: Socket;
    roomID: string;
    func: (lives: number, powerBars: number) => void;
  }) => void;
  ultimate: (params: {
    answer: string;
    nextQuestion: string;
    thirdQuestion: string;
    socket: Socket;
    roomID: string;
    func: (name: string) => void;
  }) => void;
  character: character;
  ultimateBars: number;
  partners: player[];
  teamUp: (player: player | undefined) => void;
  controller?: {
    username: string;
    socket?: string;
  };
};
