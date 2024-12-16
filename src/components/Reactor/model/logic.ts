import type { ReactorNode } from '@src/model/reactor'
import type { JSONLense } from './types'
import { ROOT_INPUT_INNER_SOCKET_ID } from '../consts'

export function createLenses(reactors: ReactorNode[]) {
  const lenses: JSONLense[] = []
  const nodeMap = new Map(reactors.map((node) => [node.id, node]))
  const ids = findOpOrders(reactors, nodeMap)

  for (const id of ids) {
    const node = nodeMap.get(id)
    if (!node) continue

    if (lenses.length === 0) {
      lenses.push({
        nodeId: id,
        run: (molecule) => node.reactor.run([molecule]),
      })
    } else {
      const lastLense = lenses.at(-1)!
      lenses.push({
        nodeId: id,
        run: (molecule) => node.reactor.run(lastLense.run(molecule)),
      })
    }
  }

  return Object.fromEntries(lenses.map((lense) => [lense.nodeId, lense]))
}

function findOpOrders(
  reactors: ReactorNode[],
  nodeMap: Map<string, ReactorNode>,
): string[] {
  const visited = new Set<string>()
  const visiting = new Set<string>()
  const isActive: Record<string, boolean> = {}
  const postOrder: string[] = []

  function visit(nodeId: string): boolean {
    if (nodeId === ROOT_INPUT_INNER_SOCKET_ID) return true

    if (visited.has(nodeId)) return isActive[nodeId]

    if (visiting.has(nodeId)) {
      throw new Error('Cyclic dependency detected')
    }

    visiting.add(nodeId)

    const node = nodeMap.get(nodeId)

    if (!node) throw new Error(`Cannot find node ${nodeId}`)

    const isSourcesActive = node.sources.every(({ id: sourceId }) =>
      visit(sourceId),
    )

    isActive[nodeId] = isSourcesActive && isAllSourceConnected(node)

    if (isActive[nodeId]) {
      postOrder.push(nodeId)
    }

    visiting.delete(nodeId)
    visited.add(nodeId)
    return isActive[nodeId]
  }

  reactors.forEach(({ id }) => visit(id))

  return postOrder
}

function isAllSourceConnected(node: ReactorNode) {
  return (
    node.sources.reduce((acc, entry) => acc + (entry ? 1 : 0), 0) ===
    node.reactor.meta.inlets
  )
}
