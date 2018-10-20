const Game = require('./game')

describe('Game class', () => {
  const GRID_SIZE = 4
  let game
  let joystickMock
  let ledsMock
  let setPixelsMock
  let showMessageMock

  beforeEach(() => {
    setPixelsMock = jest.fn()
    showMessageMock = jest.fn((_, callback) => callback())

    joystickMock = {
      getJoystick: () => Promise.resolve({ on: () => {} })
    }
    ledsMock = {
      setPixels: setPixelsMock,
      showMessage: showMessageMock,
      sleep: () => {}
    }
    game = new Game(GRID_SIZE, joystickMock, ledsMock)
  })

  describe('moveCursor', () => {
    test('when direction is UP, decrements X coordinate', () => {
      game.moveCursor('up')
      expect(game.currentCoords).toEqual({ x: 3, y: 0 })
    })
    test('when direction is DOWN, increments X coordinate', () => {
      game.moveCursor('down')
      expect(game.currentCoords).toEqual({ x: 1, y: 0 })
    })
    test('when direction is LEFT, decrements Y coordinate', () => {
      game.moveCursor('left')
      expect(game.currentCoords).toEqual({ x: 0, y: 3 })
    })
    test('when direction is RIGHT, increments Y coordinate', () => {
      game.moveCursor('right')
      expect(game.currentCoords).toEqual({ x: 0, y: 1 })
    })
  })

  describe('joystickPressHandler', () => {
    describe('when joystick is clicked', () => {
      test(`calls joystickClickHandler if game hasn't started`, () => {
        const joystickClickHandlerMock = jest.fn()
        game.joystickClickHandler = joystickClickHandlerMock

        game.joystickPressHandler('click')
        expect(joystickClickHandlerMock).toHaveBeenCalled()
      })
      test(`does not calls joystickClickHandler if game has started`, () => {
        const joystickClickHandlerMock = jest.fn()
        game.joystickClickHandler = joystickClickHandlerMock
        game.gameStarted = true

        game.joystickPressHandler('click')
        expect(joystickClickHandlerMock).not.toHaveBeenCalled()
      })
    })
    describe('when joystick is moved to any direction', () => {
      test('resets the click counter', () => {
        game.joystickPressHandler('')
        expect(game.clickCount).toEqual(0)
      })
    })
  })

  describe('joystickReleaseHandler', () => {
    test('calls resetGame if the joystick was pressed for long', () => {
      const getDateTimeMock = () => 4000
      const resetGameMock = jest.fn()
      game.getDateTime = getDateTimeMock
      game.resetGame = resetGameMock
      game.pressStartTime = 1000

      game.joystickReleaseHandler('click')
      expect(resetGameMock).toHaveBeenCalled()
    })
  })

  describe('joystickClickHandler', () => {
    describe('when joystick is cliked', () => {
      test('calls selectCell if clickCount is 0', () => {
        const selectCellMock = jest.fn()
        game.selectCell = selectCellMock

        game.joystickPressHandler('click')
        expect(selectCellMock).toHaveBeenCalled()
      })
      test('calls gameStartConfirmation if clickCount is 1', () => {
        const gameStartMessageMock = jest.fn()
        game.gameStartMessage = gameStartMessageMock

        game.joystickPressHandler('click')
        game.joystickPressHandler('click')
        expect(gameStartMessageMock).toHaveBeenCalled()
      })
      test('calls startGame if clickCount is 1', () => {
        const startGameMock = jest.fn()
        game.startGame = startGameMock

        game.joystickPressHandler('click')
        game.joystickPressHandler('click')
        game.joystickPressHandler('click')
        expect(startGameMock).toHaveBeenCalled()
      })
    })
  })

  describe('paintGrid', () => {
    test(`sends a flattened grid to senseLeds's setPixels method`, () => {
      game.paintGrid()
      expect(setPixelsMock).toHaveBeenCalled()
      expect(setPixelsMock.mock.calls[0][0]).toBeInstanceOf(Array)
      expect(setPixelsMock.mock.calls[0][0].length).toEqual(GRID_SIZE * GRID_SIZE)
    })
  })

  describe('loopMessage', () => {
    describe('when a stopCondition function is not provided', () => {
      test(`calls senseLeds's showMessage method only once`, () => {
        game.loopMessage('foobar')
        expect(showMessageMock).toHaveBeenCalledTimes(1)
      })
    })
    describe('when a stopCondition function is provided', () => {
      test(`calls senseLeds's showMessage method in loop until stopConditionFn returns true`, () => {
        let counter = 0
        const stopConditionFn = () => ++counter === 3

        game.loopMessage('foobar', stopConditionFn)
        expect(showMessageMock).toHaveBeenCalledTimes(3)
      })
    })
  })
})
