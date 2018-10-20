const {
  createArray,
  createGrid,
  flattenArray,
  gridReducer
} = require('./utils')

const GRID_SIZE = 4

describe('createArray', () => {
  describe('when size is not provided', () => {
    test('creates an empty array', () => {
      expect(createArray()).toEqual([])
    })
  })
  describe('when callbackFn is not provided', () => {
    test('creates an empty array of given size', () => {
      const arr = createArray(GRID_SIZE)
      expect(arr.length).toEqual(GRID_SIZE)
      expect(arr.join('')).toEqual('')
    })
  })
  describe('when callbackFn is provided', () => {
    test('creates an array of given size and uses callbackFn to fill it', () => {
      const arr = createArray(GRID_SIZE, () => 1)
      expect(arr.length).toEqual(GRID_SIZE)
      expect(arr.join('')).toEqual('1111')
    })
  })
})

describe('createGrid', () => {
  describe('when size is not provided', () => {
    test('creates an empty array', () => {
      expect(createGrid()).toEqual([])
    })
  })
  describe('when callbackFn is not provided', () => {
    test('creates an empty array of arrays of given size', () => {
      const grid = createGrid(GRID_SIZE)
      expect(grid.length).toEqual(GRID_SIZE)
      grid.forEach(row => expect(row.length).toEqual(GRID_SIZE))
      expect(flattenArray(grid).join('')).toEqual('')
    })
  })
  describe('when callbackFn is provided', () => {
    test('creates an array of arrays of given size and uses callbackFn to fill it', () => {
      const grid = createGrid(GRID_SIZE, () => 1)
      expect(grid.length).toEqual(GRID_SIZE)
      grid.forEach(row => expect(row.length).toEqual(GRID_SIZE))
      expect(flattenArray(grid).join('')).toEqual('1111111111111111')
    })
  })
})

describe('flattenArray', () => {
  test('returns a new array with all sub-array elements concatenated up to one depth level', () => {
    expect(flattenArray([1, 2, 3, 4])).toEqual([1, 2, 3, 4])
    expect(flattenArray([1, 2, [3, 4]])).toEqual([1, 2, 3, 4])
    expect(flattenArray([1, 2, [3, [4]]])).toEqual([1, 2, 3, [4]])
  })
})

describe('gridReducer', () => {
  test('executes given callbackFn for every cell in the grid', () => {
    const callbackFn = jest.fn()
    const grid = createGrid(GRID_SIZE, () => 0)
    gridReducer(grid, callbackFn)
    expect(callbackFn).toHaveBeenCalledTimes(GRID_SIZE * GRID_SIZE)
  })
})
