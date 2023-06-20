/**
 * Retrieve a fixed number of elements from an array, evenly distributed but
 * always including the first and last elements.
 *
 * @param   {Array} originalArray - The array to operate on.
 * @param   {number} take - The number of elements to extract.
 * @returns {Array}
 */

export function distributedCopy(originalArray: Array<any>, take: number = 10) {
  if (originalArray.length <= take) return [...originalArray]

  const newArray = [originalArray[0]]

  const interval = (originalArray.length - 2) / (take - 2)

  for (let i = 1; i < take - 1; i++)
    newArray.push(originalArray[Math.floor(interval * i)])

  newArray.push(originalArray[originalArray.length - 1])

  return newArray
}
