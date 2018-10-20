const Cell = require('./cell')
const { createArray } = require('./utils')

/**
 * The grid class
 */
class Grid {
  constructor (size) {
    this.grid = []
    this.gridSize = size

    this.createGrid()
  }

  createGrid () {
    this.grid = createArray(this.gridSize, () => (
      createArray(this.gridSize, () => new Cell(false))
    ))
  }

  tick () {
    this.grid = this.newGeneration()

    return {
      currentGrid: this.encode(),
      liveCells: this.findLiveCells()
    }
  }

  riseCell (i, j) {
    this.grid[i][j].live()
  }

  reduceGrid (paintCallbackFn) {
    return this.grid.map((row, rowIndex) => {
      return row.map((cell, cellIndex) => {
        return paintCallbackFn(cell.alive, rowIndex, cellIndex)
      })
    })
  }

  cloneGrid () {
    return this.grid.map(row => {
      return row.map(cell => new Cell(cell.alive))
    })
  }

  newGeneration () {
    let newGrid = this.cloneGrid()
    this.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        let liveNeighbours = this.checkNeighbours(i, j)
        newGrid[i][j] = this.getNewCell(cell, liveNeighbours)
      })
    })
    return newGrid
  }

  findLiveCells () {
    return this.grid.reduce((liveCellsInRow, row) => {
      return liveCellsInRow + row.reduce((liveCells, cell) => {
        return liveCells + (cell.alive ? 1 : 0)
      }, 0)
    }, 0)
  }

  checkNeighbours (i, j) {
    let liveNeighbours = 0
    // check 8 neighbours clockwise
    liveNeighbours += this.checkNeighbour(this.getPrevIndex(i), this.getPrevIndex(j)) // top left cell
    liveNeighbours += this.checkNeighbour(i, this.getPrevIndex(j)) // top cell
    liveNeighbours += this.checkNeighbour(this.getNextIndex(i), this.getPrevIndex(j)) // top right cell
    liveNeighbours += this.checkNeighbour(this.getNextIndex(i), j) // right cell
    liveNeighbours += this.checkNeighbour(this.getNextIndex(i), this.getNextIndex(j)) // bottom right cell
    liveNeighbours += this.checkNeighbour(i, this.getNextIndex(j)) // bottom cell
    liveNeighbours += this.checkNeighbour(this.getPrevIndex(i), this.getNextIndex(j)) // bottom left cell
    liveNeighbours += this.checkNeighbour(this.getPrevIndex(i), j) // left cell

    return liveNeighbours
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

  getNewCell (cell, liveNeighbours) {
    if (liveNeighbours < 2 && cell.alive) {
      // cell dies, as if caused by under-population
      return cell.die()
    } else if (liveNeighbours > 3 && cell.alive) {
      // cell dies, as if caused by overcrowding
      return cell.die()
    } else if (liveNeighbours === 3 && cell.dead) {
      // cell becomes live, as if by reproduction
      return cell.live()
    }
    return cell // cell lives on to the next generation
  }

  encode () {
    return this.grid.map(
      row => row.map(
        cell => cell.alive ? 1 : 0
      ).join('')
    ).join('')
  }
}

module.exports = Grid
