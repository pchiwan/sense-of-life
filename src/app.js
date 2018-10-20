const senseJoystick = require('sense-joystick')
const senseLeds = require('sense-hat-led')
const Game = require('./game')
const { GRID_SIZE } = require('./constants')

/* eslint-disable */
new Game(
  GRID_SIZE,
  senseJoystick,
  senseLeds
)
