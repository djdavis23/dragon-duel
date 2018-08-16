import Champion from "../models/Champion.js"
import Dragon from "../models/Dragon.js"
import Game from "../models/Game.js"

//@ts-ignore
const ddAPI = axios.create({
  baseURL: "https://dragon-duel.herokuapp.com/api/",
  timeout: 3000
})

//placeholders to store data retrieved from the server
let champions = []
let dragons = []
let myChampion = {}
let myDragon = {}
let myGame = {}


export default class GameService {

  //retrieves saved games from the server
  //not in use at this time
  getGames(drawGames, logError) {
    ddAPI.get("games")
      .then(res => console.log(res))
      .catch(logError)
  }

  //requests complete list of champions from the server
  getChampions(draw, error) {
    ddAPI.get("champions")
      .then(res => {
        res.data.forEach(c => {
          champions.push(new Champion(c))
        })
        draw(champions)
      })
      .catch(error)
  }

  //requests complete list of dragons from the server
  getDragons(draw, error) {
    ddAPI.get("dragons")
      .then(res => {
        res.data.forEach(d => {
          dragons.push(new Dragon(d))
        })
        draw(dragons)
      })
      .catch(error)
  }

  //sets the active champion based on user selection
  setChampion(championID) {
    myChampion = champions[championID]
  }

  //getter method to provide controller a copy of the private champion
  get myChampion() {
    return {
      id: myChampion.id,
      name: myChampion.name,
      class: myChampion.class,
      race: myChampion.race,
      hp: myChampion.hp,
      imgUrl: myChampion.imgUrl,
      attacks: myChampion.attacks
    }
  }

  //sets active dragon to the user-selecte dragon
  setDragon(dragonID) {
    myDragon = dragons[dragonID]
  }

  //returns copy of private dragon to the controller
  get myDragon() {
    return {
      id: myDragon.id,
      name: myDragon.name,
      currentHP: myDragon.currentHP,
      maxHP: myDragon.maxHP,
      imgUrl: myDragon.imgUrl
    }
  }

  //posts the new game to the server and instantiates a local copy
  startGame(error) {
    ddAPI.post("games", {
      dragonId: myDragon.id,
      championId: myChampion.id
    })
      .then(res => {
        myGame = new Game(res.data.game)
        myGame.dragon = myDragon
        myGame.champion = myChampion
      })
      .catch(error)
  }

  //sends attack data to and receives related updates from the server
  attack(typeAttack, updateGame, logError) {
    ddAPI.put("games/" + myGame.id, {
      attack: typeAttack
    })
      .then(res => {
        myDragon.currentHP = res.data._dragon.currentHP
        myChampion.hp = res.data._champion.hp
        myGame.history = res.data.history
        updateGame(myGame)
      })
      .catch(logError)
  }

  //removes game from the server
  deleteGame(game, logError) {
    ddAPI.delete("games" + game.id)
      .then(res => console.log(res))
      .catch(logError)
  }

}