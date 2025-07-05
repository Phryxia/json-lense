import { useCallback, useLayoutEffect, useState } from 'react'
import type { LineContent, NestedContent } from '@src/model/Content'
import type { Scope } from './types'

/**
 * @param contents parsed contents from memory
 * @returns openStates: whether given scope is open or closed.
 * Every scope is identified by its `lineBegin` index.
 * toggleScope: toggle the open state of a scope by its `lineBegin` index.
 */
export function useScopeFolding(contents: NestedContent[]) {
  const [scopes, setScopes] = useState(() => computeScopes(contents))

  useLayoutEffect(() => {
    setScopes(computeScopes(contents))
  }, [contents])

  const toggleScope = useCallback((begin: number) => {
    setScopes((scopes) => ({
      ...scopes,
      [begin]: {
        ...scopes[begin],
        isOpen: !scopes[begin].isOpen,
      },
    }))
  }, [])

  return {
    openStates: scopes,
    toggleScope,
  }
}

/**
 * Transformd contents into map of scopes, which keys are `lineBegin` indices.
 * Every states are initialized to `true`.
 *
 * Only NestedContent has scope.
 *
 * @param contents Any list of NestedContent or LineContent
 * @param scopes Used internally to accumulate recursive results. Just ignore it.
 * @returns
 */
export function computeScopes(
  contents: (NestedContent | LineContent)[],
  scopes: Record<number, Scope> = {},
): Record<number, Scope> {
  for (const content of contents) {
    if (content.type !== 'block') continue

    scopes[content.lineBegin] = {
      isOpen: true,
      begin: content.lineBegin,
      end: content.lineEnd,
    }

    if (content.children) {
      computeScopes(content.children, scopes)
    }
  }

  return scopes
}
