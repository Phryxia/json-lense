import { describe, it, expect } from 'vitest'
import { DirectedGraph } from './graph'

describe('DirectedGraph', () => {
  it('should handle basic graph operations', () => {
    const graph = new DirectedGraph<string, number>()

    graph.addNode('A')
    graph.addNode('B')
    graph.addNode('C')

    expect(graph.nodeCount).toBe(3)

    graph.connect('A', 'B', 1)
    graph.connect('B', 'C', 2)

    expect(graph.edgeCount).toBe(2)
    expect(graph.getForwardNeighbors('A').get('B')).toMatchObject([1])
    expect(graph.getBackwardNeighbors('B').get('A')).toMatchObject([1])

    graph.disconnect('A', 'B', 1)
    expect(graph.edgeCount).toBe(1)
  })

  it('should handle parallel edge correctly', () => {
    const g = new DirectedGraph<string, number>()

    g.addNode('a')
    g.addNode('b')

    g.connect('a', 'b', 0)
    expect(g.edgeCount).toBe(1)

    g.connect('a', 'b', 1)
    expect(g.edgeCount).toBe(2)

    g.disconnect('a', 'b', 2)
    expect(g.edgeCount).toBe(2)

    g.disconnect('a', 'b', 0)
    expect(g.edgeCount).toBe(1)

    g.disconnect('a', 'b', 1)
    expect(g.edgeCount).toBe(0)
  })

  it('should detect cycles correctly', () => {
    const graph = new DirectedGraph<string, number>()

    graph.addNode('A')
    graph.addNode('B')
    graph.addNode('C')

    graph.connect('A', 'B', 1)
    graph.connect('B', 'C', 2)
    graph.connect('A', 'B', 3)

    expect(graph.checkCycle('C', 'A')).toBe(true)
    expect(graph.checkCycle('C', 'B')).toBe(true)
    expect(graph.checkCycle('A', 'C')).toBe(false)
  })

  it('should handle removal of nodes', () => {
    const graph = new DirectedGraph<string, number>()

    graph.addNode('A')
    graph.addNode('B')
    graph.addNode('C')

    graph.connect('A', 'B', 1)
    graph.connect('B', 'C', 2)

    graph.removeNode('B')
    expect(graph.nodeCount).toBe(2)
    expect(graph.edgeCount).toBe(0)
    expect(graph.getForwardNeighbors('A').size).toBe(0)
  })

  it('should copy graph correctly', () => {
    const graph = new DirectedGraph<string, number>()

    graph.addNode('A')
    graph.addNode('B')
    graph.connect('A', 'B', 1)

    const copy = graph.copy()
    graph.disconnect('A', 'B', 1)

    expect(copy.edgeCount).toBe(1)
    expect(copy.getForwardNeighbors('A').get('B')).toMatchObject([1])
  })
})
