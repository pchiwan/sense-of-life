/**
 * The cell class
 */
class Cell {
  constructor (initialStatus) {
    this.status = initialStatus !== undefined ? initialStatus : false
  }

  get alive () {
    return !!this.status
  }

  get dead () {
    return !this.status
  }

  die () {
    this.status = false
  }

  live () {
    this.status = true
  }
}

module.exports = Cell
