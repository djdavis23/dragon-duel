import GameService from "./GameService.js";

const gs = new GameService()
const activeChampion = document.getElementById("champion")
const activeDragon = document.getElementById("dragon")
const status = document.getElementById("status")
const attackButtons = document.getElementsByClassName("btn-attack")
const startButton = document.getElementById("btn-start")
const pauseButton = document.getElementById("btn-pause")
const newButton = document.getElementById("btn-new")


//draws the list of available champions to the UI for the user to review/select
function drawChampions(champions) {
  let template = ''
  champions.forEach(champion => {
    let myAttacks = Object.keys(champion.attacks)
    template += `
      <div class="col-md-6 mb-2 pb-2 champbox">
        <div><img class="img-fluid" src="${champion.imgUrl}" alt="champion" /></div>
        <h5>Name:  ${champion.name}</h5>
        <p>Race:  ${champion.race}</p>
        <p>Class:  ${champion.class}</p>
        <p>Health:  ${champion.hp.toString()}</p>
        <p>Attacks: ${myAttacks.toString()}</p>
        <button onclick="app.controllers.gameController.setChampion(${champion.id})">SELECT</button>
      </div>    
    `
    document.getElementById("champion-list").innerHTML = template
  })
}

//draws list of available dragons to UI for the user to review/select
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

//draws the user-selected champion to the game board
function drawChampion(champion) {
  let template = `
    <h4>${champion.name}</h4>
    <h4>Health:  <span id="curr-HP">${champion.hp}</span></h4>
    <div><img src="${champion.imgUrl}" height=400px" /></div>
  `
  Object.keys(champion.attacks).forEach(attack => {
    template += `
      <button class="btn btn-danger btn-attack" onclick="app.controllers.gameController.attack('${attack}')">${attack}</button>
    `
  })
  activeChampion.innerHTML = template

}

//draws the user-selected dragon to the game board
function drawDragon(dragon) {
  let template = `
    <h4>${dragon.name}</h4>
    <h4>Health:  <span id="curr-HP">${dragon.currentHP}</span></h4>
    <div><img class="img-fluid" src="${dragon.imgUrl}" /></div>
  `

  activeDragon.innerHTML = template
}

//enables and disables buttons as needed based on game status
function toggleButtons(attackDisabled, startDisabled) {

  if (attackDisabled) {
    attackButtons[0].setAttribute('disabled', 'disabled')
    attackButtons[1].setAttribute('disabled', 'disabled')
    attackButtons[2].setAttribute('disabled', 'disabled')
  }
  else {
    attackButtons[0].removeAttribute('disabled')
    attackButtons[1].removeAttribute('disabled')
    attackButtons[2].removeAttribute('disabled')

  }
  if (startDisabled) {
    startButton.setAttribute('disabled', 'disabled')
  }
  else {
    startButton.removeAttribute('disabled')
  }
}

//logs all HTTP request errors to the console
function logError(error) {
  console.log(error.message)
}

//updates the status bar based on game play
function setStatus(message) {
  status.innerText = message
}

//updates UI after each attack
function updateGame(game) {
  drawChampion(game.champion)
  drawDragon(game.dragon)
  setStatus(game.history[game.history.length - 1])
  if (game.champion.hp <= 0 || game.dragon.currentHP <= 0) {
    toggleButtons(true, true)
    gs.deleteGame(game, logError)
    if (game.champion.hp <= 0 && game.dragon.currentHP <= 0) {
      setStatus("YOU\'RE BOTH DEAD!!")
    }
    else if (game.champion.hp <= 0) {
      setStatus("YOU LOSE")
    }
    else {
      setStatus("YOU WIN!!!!")
    }
  }
}

export default class GameController {

  constructor() {
    gs.getChampions(drawChampions, logError)
    setStatus("Select a Champion")
  }

  //sets the active champion based on user selection
  setChampion(championID) {
    gs.setChampion(championID)
    drawChampion(gs.myChampion)
    toggleButtons(true, true)
    gs.getDragons(drawDragons, logError)
    if (gs.myDragon.id == undefined) {
      setStatus("Select a Dragon")
    }
  }

  //sets the active dragon based on user selection
  setDragon(dragonID) {
    gs.setDragon(dragonID)
    drawDragon(gs.myDragon)
    setStatus("When ready, select FIGHT button to begin combat!")
    toggleButtons(true, false)
  }

  //event handler for UI "FIGHT" button
  startGame(logError) {
    gs.startGame()
    toggleButtons(false, true)
    document.getElementById("champion-list").style.display = "none"
    document.getElementById("dragon-list").style.display = "none"
    setStatus("GAME ON!")
  }

  //event handler for champion attack buttons
  attack(typeAttack) {
    gs.attack(typeAttack, updateGame, logError)
  }

}