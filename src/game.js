const Grid = require('./grid')
const { flattenArray, sleep } = require('./utils')
const {
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_WHITE
} = require('./constants')

const INTERVAL_TIME = 1000
const LONG_PRESS_THRESHOLD = 3000

class Game {
  constructor (size, senseJoystick, senseLeds) {
    this.gridSize = size
    this.joystick = senseJoystick
    this.leds = senseLeds

    this.bindJoystick()
    this.resetGame()
    this.paintGrid()
  }

  resetGame () {
    this.grid = new Grid(this.gridSize)
    this.currentCoords = { x: 0, y: 0 }
    this.generations = 0
    this.displayCursor = true
    this.interval = null
    this.clickCount = 0
    this.prevGeneration = null
    this.pressStartTime = 0
    this.gameStarted = false
  }

  moveCursor (direction) {
    const { x, y } = this.currentCoords

    switch (direction) {
      case 'up':
        this.currentCoords.x = x - 1 >= 0 ? x - 1 : this.gridSize - 1
        break
      case 'down':
        this.currentCoords.x = x + 1 < this.gridSize ? x + 1 : 0
        break
      case 'left':
        this.currentCoords.y = y - 1 >= 0 ? y - 1 : this.gridSize - 1
        break
      case 'right':
        this.currentCoords.y = y + 1 < this.gridSize ? y + 1 : 0
        break
    }
  }

  getDateTime () {
    return new Date().getTime()
  }

  joystickClickHandler () {
    switch (this.clickCount) {
      case 0:
        this.selectCell()
        break
      case 1:
        this.gameStartMessage()
        break
      case 2:
        this.startGame()
        break
    }
    this.clickCount++
  }

  joystickPressHandler (val) {
    if (val === 'click') {
      this.pressStartTime = this.getDateTime()
      if (!this.gameStarted) {
        this.joystickClickHandler()
      }
    } else {
      this.moveCursor(val)
      this.paintGrid()
      this.clickCount = 0
    }
  }

  joystickReleaseHandler (val) {
    if (val === 'click') {
      // detect long press => reset game
      const pressStopTime = this.getDateTime()
      if (pressStopTime - this.pressStartTime >= LONG_PRESS_THRESHOLD) {
        this.resetGame()
        this.paintGrid()
      }
    }
  }

  bindJoystick () {
    this.joystick.getJoystick().then((joystick) => {
      joystick.on('press', this.joystickPressHandler.bind(this))
      joystick.on('release', this.joystickReleaseHandler.bind(this))
    })
  }

  async selectCell () {
    this.grid.riseCell(this.currentCoords.x, this.currentCoords.y)
    this.displayCursor = false
    this.paintGrid()

    await sleep(0.2)
    this.displayCursor = true
    this.paintGrid()
  }

  paintGrid () {
    return this.leds.setPixels(
      flattenArray(
        this.grid.reduce((cell, x, y) => {
          if (this.displayCursor &&
            this.currentCoords.x === x &&
            this.currentCoords.y === y) {
            return COLOR_WHITE
          }
          return cell.alive
            ? COLOR_BLUE
            : COLOR_BLACK
        })
      )
    )
  }

  startGame () {
    this.displayCursor = false
    this.generations = 0
    this.gameStarted = true
    this.gameLoop()
  }

  async stopGame () {
    clearInterval(this.interval)
    await sleep(1)
    this.gameOverMessage()
    await sleep(2)

    const isPlural = this.generations > 1
    const message = `${this.generations} ${isPlural ? 'generations' : 'generartion'}`
    this.leds.showMessage(message, 0.07, undefined, undefined, () => {
      this.leds.showMessage(message, 0.07, undefined, undefined, () => {
        this.resetGame()
        this.paintGrid()
      })
    })
  }

  gameLoop () {
    this.paintGrid()

    this.interval = setInterval(() => {
      const { liveCells, stringValue } = this.grid.tick()
      this.generations++
      this.paintGrid()

      if (!liveCells) {
        // our population has died, the game of life is over
        this.stopGame()
        return
      }

      if (stringValue === this.prevGeneration) {
        // our population has stagnated, the game of life is over
        this.stopGame()
        return
      }

      this.prevGeneration = stringValue
    }, INTERVAL_TIME)
  }

  gameStartMessage () {
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

  gameOverMessage () {
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
