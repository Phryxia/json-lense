import type { ReactorNode } from '@src/model/reactor'
import type { JSONLense } from './types'

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
  function isEntryReactor(node: ReactorNode) {
    return (
      node.sourceIds.length === node.reactor.meta.inlets &&
      node.sourceIds.every((id) => id === 'root')
    )
  }

  function isActivatable(node: ReactorNode, activeNodes: Set<string>) {
    if (node.sourceIds.length !== node.reactor.meta.inlets) {
      return false
    }

    return node.sourceIds.every((sourceId) => {
      if (sourceId === 'root') return true

      const sourceNode = nodeMap.get(sourceId)

      if (!sourceNode) return false

      return isEntryReactor(sourceNode) || activeNodes.has(sourceId)
    })
  }

  // Find active nodes
  const activeNodes = new Set<string>()

  // First pass: find entry reactors
  reactors.forEach((node) => {
    if (isEntryReactor(node)) activeNodes.add(node.id)
  })

  // Second pass: find all activatable nodes
  let changed = true
  while (changed) {
    changed = false

    for (const node of reactors) {
      if (!activeNodes.has(node.id) && isActivatable(node, activeNodes)) {
        activeNodes.add(node.id)
        changed = true
      }
    }
  }

  const visited = new Set<string>()
  const visiting = new Set<string>()
  const postOrder: string[] = []

  function visit(nodeId: string) {
    if (visited.has(nodeId) || visiting.has(nodeId)) return

    visiting.add(nodeId)

    const node = nodeMap.get(nodeId)
    if (node) {
      for (let i = node.sourceIds.length - 1; i >= 0; i--) {
        const sourceId = node.sourceIds[i]
        if (sourceId !== 'root' && activeNodes.has(sourceId)) {
          visit(sourceId)
        }
      }
    }

    visiting.delete(nodeId)
    visited.add(nodeId)
    postOrder.push(nodeId)
  }

  activeNodes.forEach(visit)

  return postOrder
}
