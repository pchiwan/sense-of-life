const senseJoystick = require('sense-joystick')
const senseLeds = require('sense-hat-led')
const Game = require('./game')

/* eslint-disable */
new Game(
  senseJoystick,
  senseLeds
)
