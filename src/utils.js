const createArray = (size, callbackFn = () => {}) => {
  return size
    ? [...Array(size).fill()].map(callbackFn)
    : []
}

const createGrid = (size, callbackFn = () => {}) => {
  return size
    ? createArray(size, () => createArray(size, callbackFn))
    : []
}

const flattenArray = arr => {
  return arr.reduce((acc, currentItem) => {
    return [
      ...acc instanceof Array ? acc : [acc],
      ...currentItem instanceof Array ? currentItem : [currentItem]
    ]
  }, [])
}

const gridReducer = (grid, callbackFn = () => {}) => {
  return grid.map((row, i) => {
    return row.map((col, j) => {
      return callbackFn(col, i, j)
    })
  })
}

const sleep = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout * 1000))
}

module.exports = {
  createArray,
  createGrid,
  flattenArray,
  gridReducer,
  sleep
}
