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
    } = enemy;
    return new Player({
      character,
      characterAvatar,
      lives,
      status,
      statuseffects,
      ultimates,
      peeks,
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
  } = CurrentPlayer;

  const player = new Player({
    character,
    characterAvatar,
    lives,
    ultimates,
    status,
    statuseffects,
    peeks,
  });
  console.log(characterAvatar);

  return { enemies, player };
};

export default SetPlayers;
