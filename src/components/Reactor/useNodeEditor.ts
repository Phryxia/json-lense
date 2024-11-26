import { MutableRefObject, useCallback } from 'react'
import { usePool } from '@src/logic/shared/usePool'
import type { ReactorNode, ReactorGraph } from './types'

export function useNodeEditor(graph: MutableRefObject<ReactorGraph>) {
  const dimensions = usePool<ReactorNode>()

  const add = useCallback(
    (newDimension: Omit<ReactorNode, 'nodeId'>) => {
      dimensions.add({ ...newDimension, nodeId: dimensions.count })
      graph.current.addNode(dimensions.count)
      return newDimension
    },
    [dimensions.count],
  )

  const remove = useCallback((id: number) => {
    dimensions.remove(id)
    graph.current.removeNode(id)
  }, [])

  return {
    nodes: dimensions.elements,
    modify: dimensions.modify,
    add,
    remove,
  }
}
