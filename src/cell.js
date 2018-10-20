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
    return this
  }

  live () {
    this.status = true
    return this
  }
}

module.exports = Cell
