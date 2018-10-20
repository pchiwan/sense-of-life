const Grid = require('./grid')
const { flattenArray } = require('./utils')
const {
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_WHITE,
  GRID_SIZE
} = require('./constants')

const INTERVAL_TIME = 1000

class Game {
  constructor (senseJoystick, senseLeds) {
    this.g = new Grid(GRID_SIZE)
    this.currentCoords = { x: 0, y: 0 }
    this.generations = 0
    this.displayCursor = true
    this.interval = null
    this.clickTimes = 0
    this.prevGeneration = null

    this.joystick = senseJoystick
    this.leds = senseLeds

    this.bindJoystick()
    this.paintGrid()
  }

  moveCursor (direction) {
    const { x, y } = this.currentCoords

    switch (direction) {
      case 'up':
        this.currentCoords.x = x - 1 >= 0 ? x - 1 : GRID_SIZE - 1
        break
      case 'down':
        this.currentCoords.x = x + 1 < GRID_SIZE ? x + 1 : 0
        break
      case 'left':
        this.currentCoords.y = y - 1 >= 0 ? y - 1 : GRID_SIZE - 1
        break
      case 'right':
        this.currentCoords.y = y + 1 < GRID_SIZE ? y + 1 : 0
        break
    }
  }

  clickHandler () {
    switch (this.clickTimes) {
      case 0:
        this.selectCell()
        break
      case 1:
        this.gameStartConfirmation()
        break
      case 2:
        this.startGame()
        break
    }
    this.clickTimes++
  }

  bindJoystick () {
    this.joystick.getJoystick().then((joystick) => {
      joystick.on('press', (val) => {
        if (val === 'click') {
          this.clickHandler()
        } else {
          this.moveCursor(val)
          this.paintGrid()
          this.clickTimes = 0
        }
      })
    })
  }

  selectCell () {
    this.g.riseCell(this.currentCoords.x, this.currentCoords.y)
    this.displayCursor = false
    this.paintGrid()

    setTimeout(() => {
      this.displayCursor = true
      this.paintGrid()
    }, 200)
  }

  paintGrid () {
    return this.leds.setPixels(
      flattenArray(
        this.g.reduceGrid((value, x, y) => {
          if (this.displayCursor &&
            this.currentCoords.x === x &&
            this.currentCoords.y === y) {
            return COLOR_WHITE
          }
          return value ? COLOR_BLUE : COLOR_BLACK
        })
      )
    )
  }

  gameStartConfirmation () {
    const _ = COLOR_BLACK
    const X = COLOR_WHITE
    const message = [
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      X, X, X, _, _, X, _, X,
      X, _, X, _, _, X, X, _,
      X, _, X, _, _, X, _, X,
      X, X, X, _, _, X, _, X,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _
    ]

    this.leds.setPixels(message)
  }

  startGame () {
    this.displayCursor = false
    this.generations = 0
    this.gameLoop()
  }

  stopGame () {
    clearInterval(this.interval)
    setTimeout(() => {
      this.gameOver()
    }, 1000)
  }

  gameLoop () {
    this.paintGrid()

    this.interval = setInterval(() => {
      const result = this.g.tick()
      this.generations++
      this.paintGrid()

      if (!result.liveCells) {
        // our population has died, the game of life is over
        this.stopGame()
        return
      }

      if (result.currentGrid === this.prevGeneration) {
        // our population has stagnated, the game of life is over
        this.stopGame()
        return
      }

      this.prevGeneration = result.currentGrid
    }, INTERVAL_TIME)
  }

  gameOver () {
    const _ = COLOR_BLACK
    const X = COLOR_WHITE
    const message = [
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      X, _, X, _, _, X, X, X,
      X, X, _, _, _, X, _, X,
      X, _, X, _, _, X, _, X,
      X, _, X, _, _, X, X, X,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _
    ]

    this.leds.setPixels(message)
  }
}

module.exports = Game
