import GameController from "./app/components/GameController.js"

class App {
  constructor() {
    this.controllers = {
      gameController: new GameController()
    }
  }
}
//@ts-ignore
window.app = new App()