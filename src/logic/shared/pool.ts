export class Pool<T> {
  private mem: T[]
  private freeIndices: number[] = []
  private count: number

  constructor(initialValues: T[] = []) {
    this.mem = []
    this.count = initialValues.length
  }

  create(value: T) {
    const freeIndex = this.freeIndices.pop() ?? this.mem.length
    this.mem[freeIndex] = value
    this.count += 1
    return {
      value,
      id: freeIndex,
    }
  }

  remove(id: number) {
    if (this.mem[id] === undefined) return

    if (id === this.mem.length - 1) {
      this.mem.length -= 1
    } else {
      delete this.mem[id]
    }

    this.count -= 1
    this.freeIndices.push(id)
  }

  gc() {
    if (this.freeIndices.length === 0) return

    this.freeIndices.sort(compare)

    let value: T | undefined = this.mem[this.mem.length - 1]

    while (this.freeIndices.length) {
      const top = this.freeIndices.pop()!

      if (value !== undefined) {
        this.mem[top] = value
      }

      this.mem.length -= 1
      value = this.mem[this.mem.length - 1]
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    let index = 0
    return {
      [Symbol.iterator]() {
        return this
      },
      next: () => {
        while (index < this.mem.length && this.mem[index] === undefined) {
          index += 1
        }

        if (index >= this.mem.length) {
          return {
            value: undefined,
            done: true,
          }
        }

        return {
          value: this.mem[index++],
        }
      },
    }
  }

  clear() {
    this.mem.length = 0
    this.freeIndices.length = 0
    this.count = 0
  }

  get size() {
    return this.count
  }
}

function compare(a: number, b: number) {
  return a - b
}
