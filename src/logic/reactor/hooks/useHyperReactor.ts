import type { HyperReactor } from '@src/model/reactor'
import { useCallback } from 'react'
import { HyperReactorFn } from '../HyperReactorSocket'

export function useHyperReactor(h: HyperReactor) {
  const getInputNodes = useCallback(
    (id: number) => HyperReactorFn.getInputNodes(h, id),
    [h],
  )

  const getOutputNodes = useCallback(
    (id: number) => HyperReactorFn.getOutputNodes(h, id),
    [h],
  )

  return {
    getInputNodes,
    getOutputNodes,
  }
}
