const Grid = require('./grid')
const Cell = require('./cell')
const { gridReducer } = require('./utils')

describe('Grid class', () => {
  const GRID_SIZE = 4
  let grid

  beforeEach(() => {
    grid = new Grid(GRID_SIZE)
  })

  describe('encode', () => {
    test(`returns a grid's "string value" (its values flattened and joined)`, () => {
      expect(grid.encode()).toEqual('0000000000000000')
    })
  })

  describe('newGeneration', () => {
    test(`returns the next generation of the current grid`, () => {
      grid.load([
        [1, 0, 0, 1],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
      ])
      const expected = [
        [0, 0, 0, 0],
        [1, 0, 1, 0],
        [1, 0, 1, 0],
        [0, 0, 0, 0]
      ]
      expect(gridReducer(grid.newGeneration(), cell => cell.alive ? 1 : 0)).toEqual(expected)
    })
  })

  describe('findAliveCells', () => {
    test('returns the count of live cells in the grid', () => {
      grid.load([
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ])
      expect(grid.findAliveCells()).toEqual(4)
    })
  })

  describe('countAliveNeighbours', () => {
    test('returns the number of living neighbours for a given grid cell', () => {
      grid.load([
        [1, 1, 1, 0],
        [1, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
      ])
      expect(grid.countAliveNeighbours(0, 0)).toEqual(2)
      expect(grid.countAliveNeighbours(1, 1)).toEqual(8)
    })
  })

  describe('tick', () => {
    test('given a grid, returns its next generation string value and its count of live cells', () => {
      grid.load([
        [1, 0, 0, 1],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
      ])
      const expected = '0000101010100000'
      const nextGenerationGrid = grid.tick()
      expect(nextGenerationGrid.stringValue).toEqual(expected)
      expect(nextGenerationGrid.liveCells).toEqual(4)
    })
  })

  describe('getNextGenCell', () => {
    test('returns a dead cell when cell is alive and has less than 2 living neighbours', () => {
      expect(grid.getNextGenCell(new Cell(true), 1).dead).toBeTruthy()
    })
    test('returns a dead cell when cell is alive and has more than 3 living neighbours', () => {
      expect(grid.getNextGenCell(new Cell(true), 4).dead).toBeTruthy()
    })
    test('returns a live cell when is dead and has exactly 3 living neighbours', () => {
      expect(grid.getNextGenCell(new Cell(), 3).alive).toBeTruthy()
    })
    test('in other cases, returns exact same cell', () => {
      const aliveCell = new Cell(true)
      const deadCell = new Cell()
      expect(grid.getNextGenCell(aliveCell, 2)).toBe(aliveCell)
      expect(grid.getNextGenCell(aliveCell, 3)).toBe(aliveCell)
      expect(grid.getNextGenCell(deadCell, 1)).toBe(deadCell)
      expect(grid.getNextGenCell(deadCell, 2)).toBe(deadCell)
      expect(grid.getNextGenCell(deadCell, 4)).toBe(deadCell)
    })
  })
})
