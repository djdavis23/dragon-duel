import GameService from "./GameService.js";

const gs = new GameService()
const activeChampion = document.getElementById("champion")
const activeDragon = document.getElementById("dragon")
const status = document.getElementById("status")

function drawChampions(champions) {
  let template = ''
  champions.forEach(champion => {
    template += `
      <div class="col-md-6 mb-2 pb-2 champbox">
        <div><img class="img-fluid" src="${champion.imgUrl}" alt="champion" /></div>
        <h5>Name:  ${champion.name}</h5>
        <p>Race:  ${champion.race}</p>
        <p>Class:  ${champion.class}</p>
        <p>Health:  ${champion.hp.toString()}</p>
        <p>Attacks: ${champion.attacks.toString()}</p>
        <button onclick="app.controllers.gameController.setChampion(${champion.id})">SELECT</button>
      </div>    
    `
    document.getElementById("champion-list").innerHTML = template
  })
}

function drawDragons(dragons) {
  let template = ''
  dragons.forEach(dragon => {
    template += `
      <div class="col-md-6 mb-2 pb-2 dragonbox">
        <div><img class="img-fluid" src="${dragon.imgUrl}" alt="Dragon" /></div>
        <h5>Name:  ${dragon.name}</h5>        
        <p>Health:  ${dragon.maxHP.toString()}</p>        
        <button onclick="app.controllers.gameController.setDragon(${dragon.id})">SELECT</button>
      </div>    
    `
    document.getElementById("dragon-list").innerHTML = template
  })
}

function drawChampion(champion) {
  let template = `
    <h4>${champion.name}</h4>
    <h4>Health:  <span id="curr-HP">${champion.hp}</span></h4>
    <div><img src="${champion.imgUrl}" height=400px" /></div>
  `
  Object.keys(champion.attacks).forEach(attack => {
    template += `
      <button class="btn btn-primary" onclick="app.controllers.gameController.attack('${attack})">${attack}</button>
    `
  })
  activeChampion.innerHTML = template

}

function drawDragon(dragon) {
  let template = `
    <h4>${dragon.name}</h4>
    <h4>Health:  <span id="curr-HP">${dragon.currentHP}</span></h4>
    <div><img class="img-fluid" src="${dragon.imgUrl}" /></div>
  `

  activeDragon.innerHTML = template
}

function drawGames(games) {

}

function logError(error) {
  console.log(error.message)
}

function setStatus(message) {
  status.innerText = message
}

export default class GameController {

  constructor() {
    //gs.getGames(drawGames)    
    gs.getChampions(drawChampions, logError)
    setStatus("Select a Champion")
  }

  getCombatants() {
    gs.getChampions(drawChampions, logError)

  }

  setChampion(championID) {
    gs.setChampion(championID)
    drawChampion(gs.myChampion)
    gs.getDragons(drawDragons, logError)
    setStatus("Select a Dragon")
  }


  setDragon(dragonID) {
    gs.setDragon(dragonID)
    drawDragon(gs.myDragon)
    setStatus("When ready, select FIGHT button to begin combat!")
  }

}