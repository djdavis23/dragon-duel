import Champion from "../models/Champion.js"
import Dragon from "../models/Dragon.js"
import Game from "../models/Game.js"

//@ts-ignore
const ddAPI = axios.create({
  baseURL: "https://dragon-duel.herokuapp.com/api/",
  timeout: 3000
})

let champions = []
let dragons = []
let myChampion = {}
let myDragon = {}
let myGame = {}


export default class GameService {

  getGames(drawGames, logError) {
    ddAPI.get("games")
      .then(res => console.log(res))
      .catch(logError)
  }

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

  setChampion(championID) {
    myChampion = champions[championID]
  }

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

  setDragon(dragonID) {
    myDragon = dragons[dragonID]
  }

  get myDragon() {
    return {
      id: myDragon.id,
      name: myDragon.name,
      currentHP: myDragon.currentHP,
      maxHP: myDragon.maxHP,
      imgUrl: myDragon.imgUrl
    }
  }

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
  deleteGame(game, logError) {
    ddAPI.delete("games" + game.id)
      .then(res => console.log(res))
      .catch(logError)
  }

}