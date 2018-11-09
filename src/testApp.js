const Game = require('./game')
const { GRID_SIZE } = require('./constants')

module.exports = (senseJoystick, senseLeds) => {
  /* eslint-disable */
  new Game(
    GRID_SIZE,
    senseJoystick,
    senseLeds
  )
}
