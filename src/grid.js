const Cell = require('./cell')
const {
  createGrid,
  flattenArray,
  gridReducer
} = require('./utils')

/**
 * The grid class
 */
class Grid {
  constructor (size) {
    this.grid = []
    this.gridSize = size

    this.init()
  }

  init () {
    this.grid = createGrid(this.gridSize, () => new Cell(false))
  }

  tick () {
    this.grid = this.newGeneration()

    return {
      stringValue: this.encode(),
      liveCells: this.findAliveCells()
    }
  }

  riseCell (i, j) {
    this.grid[i][j].live()
  }

  newGeneration () {
    return gridReducer(this.grid, (cell, i, j) => {
      let aliveNeighbours = this.countAliveNeighbours(i, j)
      return this.getNextGenCell(cell, aliveNeighbours)
    })
  }

  findAliveCells () {
    return this.grid.reduce((liveCellsInRow, row) => {
      return liveCellsInRow + row.reduce((liveCells, cell) => {
        return liveCells + (cell.alive ? 1 : 0)
      }, 0)
    }, 0)
  }

  countAliveNeighbours (i, j) {
    let aliveNeighbours = 0
    // check 8 neighbours clockwise
    aliveNeighbours += this.checkNeighbour(this.getPrevIndex(i), this.getPrevIndex(j)) // top left cell
    aliveNeighbours += this.checkNeighbour(i, this.getPrevIndex(j)) // top cell
    aliveNeighbours += this.checkNeighbour(this.getNextIndex(i), this.getPrevIndex(j)) // top right cell
    aliveNeighbours += this.checkNeighbour(this.getNextIndex(i), j) // right cell
    aliveNeighbours += this.checkNeighbour(this.getNextIndex(i), this.getNextIndex(j)) // bottom right cell
    aliveNeighbours += this.checkNeighbour(i, this.getNextIndex(j)) // bottom cell
    aliveNeighbours += this.checkNeighbour(this.getPrevIndex(i), this.getNextIndex(j)) // bottom left cell
    aliveNeighbours += this.checkNeighbour(this.getPrevIndex(i), j) // left cell

    return aliveNeighbours
  }

  checkNeighbour (i, j) {
    return this.grid[i][j].alive ? 1 : 0
  }

  getPrevIndex (i) {
    return i - 1 < 0 ? this.gridSize - 1 : i - 1
  }

  getNextIndex (i) {
    return i + 1 === this.gridSize ? 0 : i + 1
  }

  getNextGenCell (cell, aliveNeighbours) {
    if (aliveNeighbours < 2 && cell.alive) {
      // cell dies, as if caused by under-population
      return cell.die()
    } else if (aliveNeighbours > 3 && cell.alive) {
      // cell dies, as if caused by overcrowding
      return cell.die()
    } else if (aliveNeighbours === 3 && cell.dead) {
      // cell becomes live, as if by reproduction
      return cell.live()
    }
    return cell // cell lives on to the next generation
  }

  encode () {
    return flattenArray(
      gridReducer(this.grid, cell => cell.alive ? 1 : 0)
    ).join('')
  }

  reduce (callbackFn) {
    return gridReducer(this.grid, callbackFn)
  }

  load (grid) {
    this.grid = gridReducer(grid, (cell, i, j) => new Cell(!!cell))
  }
}

module.exports = Grid
