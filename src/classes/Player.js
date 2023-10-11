import { message } from "antd";

class Player {
  name;
  points;
  lives;
  partners;
  powerBars;
  ultimateBars;
  character;
  characterName;
  enemies;
  characterAvatar;
  status;
  statuseffects;
  tryTest;

  constructor({
    character,
    characterAvatar,
    lives,
    peeks,
    ultimates,
    status,
    statuseffects,
  }) {
    const { name: characterName } = character;
    this.characterAvatar = characterAvatar;
    this.characterName = characterName;
    this.powerBars = peeks;
    this.lives = lives;
    this.ultimateBars = ultimates;
    (this.status = status), (this.statuseffects = statuseffects);
    this.tryTest = this.Test;
    // handle character stats modifications
    // if (characterName == "Ife") {
    //   this.powerBars = 6;
    //   this.ultimateBars = 3;
    // }
    // if (characterName == "Athena") {
    //   this.powerBars = 3;
    //   this.ultimateBars = 4;
    // }
    // if (characterName == "Da Vinci") {
    //   this.powerBars = 6;
    //   this.ultimateBars = 2;
    // }
    // if (characterName == "Confucious") {
    //   this.powerBars = 8;
    // }

    // if (characterName == "Arhuanran") {
    //   this.lives = 5;
    //   this.powerBars = 2;
    // }

    this.name = name;
    this.points = 0;

    this.partners = [];
    this.character = character;
    console.log("this is you", this);

    this.takeDamage = this.Damage;

    this.increasePoints = this.incPoints;

    this.callPowers = this.Powers;

    this.ultimate = this.PowerUps;

    this.teamUp = (partner) => {
      console.log(partner);
      this.pushPartner(partner);
    };
  }

  Damage = () => {
    if (this.lives <= 0) {
      return console.log("This person died");
    }

    this.lives = this.lives - 1;

    console.log("Damage taken");
  };

  incPoints = () => {
    this.points = this.points + 10;
  };

  pushPartner = (partner) => {
    this.partners.push(partner);
  };

  findEnemy = () => {
    const enemy = this.enemies.find((enemy) => (enemy.name = "cvb"));
    console.log(enemy);
  };

  // * PLAYER CHARACTER ULTIMATE ACTIONS
  PowerUps = (props) => {
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
        if (this.powerBars == 0) {
          return message.error("no more power bars");
        }
        this.lives = this.lives + 1;
        this.powerBars = this.powerBars - 2;
        func("Ife");
        break;
      case "Da Vinci":
        if (this.powerBars == 0) {
          return message.error("no more power bars");
        }
        this.lives = this.lives + 1;
        this.powerBars = this.powerBars - 2;
        func("Da Vinci");
        break;

      default:
        break;
    }
  };

  // * PLAYER  CHARACTER ANSWER REVEAL FUNCTIONS
  Powers = (props) => {
    const { answer, func, nextQuestion, thirdQuestion } = props;
    const { name } = this.character;
    let powerBars = this.powerBars;

    const decreasePowerBars = () => {
      this.powerBars = powerBars - 1;
    };

    if (this.powerBars == 0) {
      return message.error("no more power bars");
    }

    switch (name) {
      case "Athena":
        console.log("Athena the wise");
        message.info(`${nextQuestion}`);
        decreasePowerBars();
        break;
      case "Washington":
        console.log("White Man");
        message.info(`${answer}`);
        decreasePowerBars();
        break;
      case "Ife":
        console.log("Black Queen");
        message.info(`${answer.substring(0, 2)}`);
        decreasePowerBars();
        break;
      case "Da Vinci":
        console.log("za Painter");
        message.info(`${thirdQuestion}`);
        decreasePowerBars();
        break;
      case "Confucious":
        console.log("za Painter");
        message.info(`${nextQuestion.substring(0, 2)}`);
        decreasePowerBars();
        break;
      case "Arhuanran":
        console.log(this.name);
        message.info(`${answer}`);
        decreasePowerBars();
        break;

      default:
        break;
    }
    // * handle ui changes and any further effects
    func();
  };

  // ? SOCKET TEST ?
  Test = (func) => {
    const { name } = this.character;
    func(name);
  };
}

export default Player;
