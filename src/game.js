const Grid = require('./grid')
const { flattenArray } = require('./utils')
const {
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_WHITE,
  GRID_SIZE
} = require('./constants')

class Game {
  constructor (senseJoystick, senseLeds) {
    this.g = new Grid(GRID_SIZE)
    this.currentCoords = { x: 0, y: 0 }
    this.displayCursor = true
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

  bindJoystick () {
    this.joystick.getJoystick().then((joystick) => {
      joystick.on('press', (val) => {
        if (val === 'click') {
          this.g.riseCell(this.currentCoords.x, this.currentCoords.y)
          this.paintGrid()
        } else {
          this.moveCursor(val)
          this.paintGrid()
        }
      })
    })
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
}

module.exports = Game
