const Grid = require('./grid')

describe('Grid class', () => {
  test('encode', () => {
    const grid = new Grid(4)
    expect(grid.encode()).toEqual('0000000000000000')
  })
})
