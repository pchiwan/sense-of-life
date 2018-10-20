const Game = require('./game')

const mockJoystick = {
  getJoystick: () => Promise.resolve({ on: () => {} })
}

const mockLeds = {
  setPixels: arr => arr
}

describe('Game class', () => {
  test('pixel array has 64 elements', () => {
    const app = new Game(mockJoystick, mockLeds) // eslint-disable-line
    expect(app.paintGrid().length).toEqual(64)
  })
})
