import Player from "@/classes/Player";
import { player } from "@/types";

const SetPlayers = (CurrentPlayer: player, otherPlayers: player[]) => {
  // CHANGE NAME LATER VERY IMPORTANT userName to username
  const enemies = otherPlayers?.map((enemy: player) => {
    const {
      character,
      characterAvatar,
      lives,
      status,
      statuseffects,
      ultimates,
      peeks,
      username,
      questions,
    } = enemy;
    return new Player({
      character,
      characterAvatar,
      lives,
      status,
      statuseffects,
      ultimates,
      peeks,
      username,
      questions,
    });
  });

  // CHANGE NAME LATER VERY IMPORTANT from userName to username
  const {
    character,
    characterAvatar,
    lives,
    ultimates,
    status,
    statuseffects,
    peeks,
    username,
    questions,
  } = CurrentPlayer;

  const player = new Player({
    character,
    characterAvatar,
    lives,
    ultimates,
    status,
    statuseffects,
    peeks,
    username,
    questions,
  });
  console.log(characterAvatar);

  return { enemies, player };
};

export default SetPlayers;
