import { describe, test, expect } from 'vitest'
import type { NestedContent } from '@src/model/Content'
import { JsonArranger } from '@src/logic/arrangers/JsonArranger'
import type { Scope } from './types'
import { computeScopes } from './useScopeFolding'

describe('computeScopes', () => {
  test('root elements should have scope', () => {
    const contents: NestedContent[] = [
      {
        type: 'block',
        lineBegin: 0,
        lineEnd: 0,
      },
    ]
    const scopes = computeScopes(contents)

    expect(scopes).toMatchObject<Record<number, Scope>>({
      0: { begin: 0, end: 0, isOpen: true },
    })
  })

  test('nested', () => {
    const contents = JsonArranger.arrange([0, [1, [2, 3], 4], 5])
    expect(computeScopes(contents)).toMatchObject({
      0: { begin: 0, end: 11, isOpen: true },
      2: { begin: 2, end: 9, isOpen: true },
      4: { begin: 4, end: 7, isOpen: true },
    })
  })
})
