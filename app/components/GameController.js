import GameService from "./GameService.js";

const gs = new GameService()

export default class GameController {


  test() {
    console.log("controller here")
    gs.test();
  }
}