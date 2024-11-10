import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { IndexedJSONLine } from '../types'
import { fx } from '@fxts/core'
import { OpenState } from './consts'

type Scope = {
  begin: number
  end: number
  isOpen?: boolean
}

export function useScopeFolding(lines: IndexedJSONLine[]) {
  const [scopes, setScopes] = useState<Scope[]>([])

  useLayoutEffect(() => {
    setScopes(computeScopes(lines))
  }, [lines])

  const toggleScope = useCallback((begin: number) => {
    setScopes((scopes) =>
      scopes.map((scope) =>
        scope.begin === begin ? { ...scope, isOpen: !scope.isOpen } : scope,
      ),
    )
  }, [])

  const openStates = useMemo(() => computeOpenStates(lines, scopes), [scopes])

  return {
    openStates,
    toggleScope,
  }
}

export function computeScopes(lines: IndexedJSONLine[]) {
  return fx(lines)
    .filter((line) => line.scopeEndIndex != null)
    .map((line) => ({
      begin: line.index,
      end: line.scopeEndIndex!,
      isOpen: line.index === 0,
    }))
    .toArray()
}

export function computeOpenStates(
  lines: IndexedJSONLine[],
  scopes: Scope[],
): OpenState[] {
  // primitive value only
  if (!scopes.length) {
    return lines.map(() => OpenState.Open)
  }

  const scopeStack: Scope[] = []
  let scopeIndex = 0

  return lines.map(({ index }) => {
    if (scopeStack.length && scopeStack[scopeStack.length - 1].end < index) {
      scopeStack.pop()
    }

    if (scopeIndex < scopes.length && scopes[scopeIndex].begin <= index) {
      scopeStack.push(scopes[scopeIndex++])
    }

    if (
      scopeStack.every(
        ({ isOpen }, stackIndex) =>
          stackIndex === scopeStack.length - 1 || isOpen,
      )
    ) {
      const top = scopeStack[scopeStack.length - 1]
      if (top.begin === index) {
        if (top.isOpen) {
          return OpenState.BeginOpen
        }
        return OpenState.BeginClosed
      }

      if (top.isOpen) {
        return OpenState.Open
      }
      return OpenState.Closed
    }
    return OpenState.Closed
  })
}
