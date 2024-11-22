import { fx } from '@fxts/core'
import { Queue } from './queue'

export class DirectedGraph<V, E> {
  private nodes = new Set<V>()
  private forwardEdges = new Map<V, Map<V, E[]>>()
  private backwardEdges = new Map<V, Map<V, E[]>>()

  copy(): DirectedGraph<V, E> {
    const graph = new DirectedGraph<V, E>()

    this.nodes.forEach((node) => graph.addNode(node))
    this.nodes.forEach((from) => {
      this.forwardEdges.get(from)?.forEach((labels, to) => {
        labels.forEach((label) => graph.connect(from, to, label))
      })
    })
    return graph
  }

  addNode(node: V) {
    if (this.nodes.has(node)) return

    this.nodes.add(node)
    this.forwardEdges.set(node, new Map())
    this.backwardEdges.set(node, new Map())
  }

  removeNode(node: V) {
    if (!this.nodes.has(node)) return

    this.forwardEdges.get(node)?.forEach((_, neighbor) => {
      this.backwardEdges.get(neighbor)?.delete(node)
    })
    this.backwardEdges.get(node)?.forEach((_, neighbor) => {
      this.forwardEdges.get(neighbor)?.delete(node)
    })

    this.nodes.delete(node)
    this.forwardEdges.delete(node)
    this.backwardEdges.delete(node)
  }

  connect(from: V, to: V, label: E) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) return

    const forward = this.forwardEdges.get(from)
    forward?.set(to, [...(forward?.get(to) ?? []), label])

    const backward = this.backwardEdges.get(to)
    backward?.set(from, [...(backward?.get(from) ?? []), label])
  }

  disconnect(from: V, to: V, label: E) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) return

    const forward = this.forwardEdges.get(from)
    const nextF = removeEmptyList(forward?.get(to)?.filter((l) => l !== label))
    if (nextF) {
      forward?.set(to, nextF)
    } else {
      forward?.delete(to)
    }

    const backward = this.backwardEdges.get(to)
    const nextB = removeEmptyList(
      forward?.get(from)?.filter((l) => l !== label),
    )
    if (nextB) {
      backward?.set(from, nextB)
    } else {
      backward?.delete(from)
    }
  }

  getForwardNeighbors(node: V): Map<V, E[]> {
    return new Map(this.forwardEdges.get(node))
  }

  getBackwardNeighbors(node: V): Map<V, E[]> {
    return new Map(this.backwardEdges.get(node))
  }

  get nodeCount() {
    return this.nodes.size
  }

  get edgeCount() {
    let count = 0
    this.nodes.forEach((node) => {
      count += fx(
        this.forwardEdges.get(node)?.values() ?? ([] as E[][]),
      ).reduce((sum, edges) => sum + edges.length, 0)
    })
    return count
  }

  /**
   * Check whether new given edge causes cycle or not
   *
   * @param from
   * @param to
   * @returns
   */
  checkCycle(): boolean
  checkCycle(from: V, to: V): boolean
  checkCycle(from?: V, to?: V) {
    const inDegree = new Map<V, number>(
      [...this.nodes].map((v) => [
        v,
        this.getBackwardNeighbors(v).size + (v === to ? 1 : 0),
      ]),
    )
    const q = new Queue<V>()
    let visited = 0

    for (const v of this.nodes) {
      if (!inDegree.get(v)) {
        q.push(v)
      }
    }

    while (q.isNotEmpty()) {
      const u = q.pop()
      visited += 1

      if (to != null && u === from) {
        const newInDegree = inDegree.get(to)! - 1
        inDegree.set(to, newInDegree)

        if (!newInDegree) {
          q.push(to)
        }
      }

      for (const [v] of this.getForwardNeighbors(u)) {
        const newInDegree = inDegree.get(v)! - 1
        inDegree.set(v, newInDegree)

        if (!newInDegree) {
          q.push(v)
        }
      }
    }

    return visited !== this.nodes.size
  }
}

function removeEmptyList<T>(list?: T[]) {
  return !list?.length ? undefined : list
}
