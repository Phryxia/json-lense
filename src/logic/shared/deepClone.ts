export function deepClone<T>(obj: T): T
export function deepClone(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj

  if (obj instanceof Array) {
    return obj.map(deepClone)
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)]),
  )
}
