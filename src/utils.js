const createArray = (size, callbackFn) => {
  return [
    ...new Array(size).keys()
  ].map(callbackFn)
}

const flattenArray = arr => {
  return arr.reduce((acc, currentItem) => {
    return [
      ...acc instanceof Array ? acc : [acc],
      ...currentItem instanceof Array ? currentItem : [currentItem],
    ]
  }, [])
}

module.exports = {
  createArray,
  flattenArray
}
