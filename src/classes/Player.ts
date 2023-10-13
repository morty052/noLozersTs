/* eslint-disable @typescript-eslint/ban-ts-comment */
import { player } from "@/types";
import { message } from "antd";

export type Debuffs = "crushed" | "confused" | "snared" | "empowered" | "none";
export type characterName =
  | "Arhuanran"
  | "Athena"
  | "Da Vinci"
  | "Ife"
  | "Washington"
  | "Confucious";

class Player {
  username;
  points;
  lives;
  powerBars;
  ultimateBars;
  character;
  characterName;
  characterAvatar;
  status;
  statuseffects;
  tryTest;
  takeDamage;
  increasePoints;
  callPowers;
  ultimate;
  callDebuff;
  Debuff;
  teamUp;
  partners?: player[];
  enemies?: player[];
  questions: {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }[];

  constructor({
    character,
    characterAvatar,
    lives,
    peeks,
    ultimates,
    status,
    statuseffects,
    username,
    questions,
  }: player) {
    const { name: characterName } = character;
    this.characterAvatar = characterAvatar;
    this.characterName = characterName;
    this.powerBars = peeks;
    this.lives = lives;
    this.ultimateBars = ultimates;
    (this.status = status), (this.statuseffects = statuseffects);

    this.questions = questions;

    this.callDebuff = (props: {
      target_name: string;
      name: characterName;
      sender: string;
    }): { debuff: Debuffs; target_name: string; sender: string } => {
      return this.SendDebuff(props);
    };

    this.Debuff = (props: {
      debuff: Debuffs;
      target_name: string;
      sender: string;
    }) => {
      this.ApplyDebuff(props);
    };
    this.tryTest = (number: number) => {
      this.Test(number);
    };

    this.username = username;
    this.points = 0;

    this.character = character;

    this.takeDamage = this.Damage;

    this.increasePoints = this.incPoints;

    this.callPowers = this.Powers;

    this.ultimate = this.PowerUps;

    this.teamUp = (partner: player) => {
      this.pushPartner(partner);
    };
  }

  // Damage = () => {
  //   if (this.lives <= 0) {
  //     return console.log("This person died");
  //   }

  //   this.lives = this.lives - 1;

  //   console.log("Damage taken");
  // };

  Damage = () => {
    if (this.lives !== undefined && this.lives <= 0) {
      return console.log("This person died");
    }

    if (this.lives !== undefined) {
      this.lives = this.lives - 1;
    }

    console.log("Damage taken");
  };

  incPoints = () => {
    this.points = this.points + 10;
  };

  pushPartner = (partner: player) => {
    this.partners?.push(partner);
  };

  findEnemy = () => {
    const enemy = this.enemies?.find((enemy) => (enemy.username = "cvb"));
    console.log(enemy);
  };

  // * PLAYER CHARACTER ULTIMATE ACTIONS
  PowerUps = (props: { func: (name: string) => void }) => {
    const { func } = props;

    // * destructure name from player characater passed in player contructor
    const { name } = this.character;

    /*
     * handle player lives and powerbars from within Player object
     * send back character name to handle changes in ui
     */
    switch (name) {
      case "Arhuanran":
        this.powerBars = this.powerBars + 2;
        func("Arhuanran");
        break;
      case "Ife":
        if (this.ultimateBars == 0) {
          return message.error("no more ultimates");
        }

        if (this.lives) {
          this.lives = this.lives + 1;
        }
        this.powerBars = this.powerBars - 2;
        this.ultimateBars = this.ultimateBars - 1;
        func("Ife");
        break;
      case "Da Vinci":
        if (this.powerBars == 0) {
          return message.error("no more power bars");
        }
        if (this.lives) {
          this.lives = this.lives + 1;
        }
        this.powerBars = this.powerBars - 2;
        func("Da Vinci");
        break;

      default:
        break;
    }
  };

  // * PLAYER  CHARACTER ANSWER REVEAL FUNCTIONS
  Powers = (props: { func: () => void; level: number }) => {
    const { func, level } = props;
    const { name } = this.character;
    const powerBars = this.powerBars;
    // let level = 0;

    const { correct_answer } = this.questions && this.questions[level];

    const nextQuestion = this.questions && this.questions[level + 1];
    const thirdQuestion = this.questions && this.questions[level + 2];
    const { correct_answer: nextAnswer } = nextQuestion;
    const { correct_answer: thirdAnswer } = thirdQuestion;

    const decreasePowerBars = () => {
      this.powerBars = powerBars - 1;
    };

    if (this.powerBars == 0) {
      return message.error("no more power bars");
    }

    switch (name) {
      case "Athena":
        message.info(`${nextAnswer}`);
        decreasePowerBars();
        break;
      case "Washington":
        console.log("White Man");
        message.info(`${correct_answer}`);
        decreasePowerBars();
        break;
      case "Ife":
        console.log("Black Queen");
        message.info(`${thirdAnswer}`);
        decreasePowerBars();
        break;
      case "Da Vinci":
        console.log("za Painter");
        message.info(`${thirdAnswer}`);
        decreasePowerBars();
        break;
      case "Confucious":
        console.log("za Painter");
        message.info(`${correct_answer.substring(0, 2)}`);
        decreasePowerBars();
        break;
      case "Arhuanran":
        message.info(`${correct_answer}`);
        decreasePowerBars();
        break;

      default:
        break;
    }

    // * HANDLE UI CHANGES AND ANY FUTHER EFFECTS
    func();
  };

  ApplyDebuff = (props: {
    debuff: Debuffs;
    target_name: string;
    sender: string;
  }) => {
    const { debuff, target_name } = props;
    console.log(props);

    if (target_name == this.username) {
      console.log(`this player ${target_name} got ${debuff}`);
      // this.lives = 0;
      // console.log(this.lives);
    } else {
      return console.log("not you");
    }
    // switch (debuffs) {
    //   case "confused":
    //     this.powerBars = this.powerBars - 1;
    //     break;
    //   case "crushed":
    //     this.lives = this.lives && this.lives - 1;
    //     break;
    //   case "empowered":
    //     break;
    //   case "none":
    //     break;
    //   case "snared":
    //     break;

    //   default:
    //     break;
    // }
  };

  SendDebuff = (props: {
    target_name: string;
    name: characterName;
  }): { debuff: Debuffs; target_name: string; sender: string } => {
    const { target_name, name } = props;
    const sender = this.username;

    const deterMineDebuff = () => {
      let debuff: Debuffs;
      switch (name) {
        case "Ife":
          debuff = "confused";
          return debuff;
        case "Arhuanran":
          debuff = "crushed";
          return debuff;
        default:
          break;
      }
    };

    const debuff = deterMineDebuff();

    return {
      // @ts-ignore
      debuff,
      target_name,
      sender,
    };
  };

  // ? SOCKET TEST ?
  Test = (message: number): number => {
    console.log(message);
    return message;
  };
}

export default Player;
