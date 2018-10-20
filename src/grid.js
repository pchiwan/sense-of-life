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

  // loadGrid (table) {
  //   if (table.length !== this.grid.length) {
  //     return
  //   }

  //   table.forEach((tr, x) => {
  //     tr.forEach((td, y) => {
  //       if (td) {
  //         this.grid[x][y].live()
  //       } else {
  //         this.grid[x][y].die()
  //       }
  //     })
  //   })
  // }

  tick () {
    this.grid = this.newGeneration()

    return {
      currentGrid: this.encode(),
      liveCells: this.findLiveCells()
    }
  }

  riseCell (x, y) {
    this.grid[x][y].live()
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
    this.grid.forEach((row, x) => {
      row.forEach((cell, y) => {
        let liveNeighbours = this.checkNeighbours(x, y)
        newGrid[x][y] = this.getNewCell(cell, liveNeighbours)
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

  checkNeighbours (x, y) {
    let liveNeighbours = 0
    // check 8 neighbours clockwise
    liveNeighbours += this.checkNeighbour(this.getPrevIndex(x), this.getPrevIndex(y)) // top left cell
    liveNeighbours += this.checkNeighbour(x, this.getPrevIndex(y)) // top cell
    liveNeighbours += this.checkNeighbour(this.getNextIndex(x), this.getPrevIndex(y)) // top right cell
    liveNeighbours += this.checkNeighbour(this.getNextIndex(x), y) // right cell
    liveNeighbours += this.checkNeighbour(this.getNextIndex(x), this.getNextIndex(y)) // bottom right cell
    liveNeighbours += this.checkNeighbour(x, this.getNextIndex(y)) // bottom cell
    liveNeighbours += this.checkNeighbour(this.getPrevIndex(x), this.getNextIndex(y)) // bottom left cell
    liveNeighbours += this.checkNeighbour(this.getPrevIndex(x), y) // left cell

    return liveNeighbours
  }

  checkNeighbour (x, y) {
    return this.grid[x][y].alive ? 1 : 0
  }

  getPrevIndex (x) {
    return x - 1 < 0 ? this.gridSize - 1 : x - 1
  }

  getNextIndex (x) {
    return x + 1 === this.gridSize ? 0 : x + 1
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
