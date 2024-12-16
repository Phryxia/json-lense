/**
 * Mutable operation of O(N) removal
 * @param array list of items
 * @param predicate should return true when the item should be removed
 * @returns
 */
export function removeBatch<T>(array: T[], predicate: (item: T) => boolean) {
  let limit = array.length
  let i = 0
  while (i < limit) {
    if (predicate(array[i])) {
      array[i] = array[--limit]
    } else {
      i += 1
    }
  }
  array.length = limit
}
