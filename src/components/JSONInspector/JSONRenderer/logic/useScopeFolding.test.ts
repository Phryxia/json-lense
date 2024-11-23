import { describe, test, expect } from 'vitest'
import { computeOpenStates, computeScopes } from './useScopeFolding'
import { JSONTokenType } from '../consts'
import { renderJSONAsLines } from './renderJSONAsLines'
import { OpenState } from './consts'

describe('computeScopes', () => {
  test('primitive-only should be empty', () => {
    const lines = [...renderJSONAsLines(null)]
    expect(computeScopes(lines)).toMatchObject([])
  })

  test('nested', () => {
    const lines = [...renderJSONAsLines([0, [1, [2, 3], 4], 5])]
    expect(computeScopes(lines)).toMatchObject([
      { begin: 0, end: 11, isOpen: true },
      { begin: 2, end: 9 },
      { begin: 4, end: 7 },
    ])
  })
})

describe('computeOpenStates', () => {
  test('primitive-only', () => {
    expect(
      computeOpenStates(
        [
          {
            index: 0,
            tokens: [
              { id: 0, type: JSONTokenType.Boolaen, content: 'true', tabs: 0 },
            ],
          },
        ],
        [],
      ),
    ).toMatchObject([OpenState.Open])
  })

  test('every nested objects should be open', () => {
    const lines = [
      ...renderJSONAsLines([
        0, //
        [
          1, //
          2,
        ],
        [
          3, //
          4,
        ],
        5,
      ]),
    ]
    const scopes = computeScopes(lines)

    expect(computeOpenStates(lines, scopes)).toMatchObject([
      OpenState.BeginOpen,
      OpenState.Open,
      OpenState.BeginOpen,
      OpenState.Open,
      OpenState.Open,
      OpenState.Open,
      OpenState.BeginOpen,
      OpenState.Open,
      OpenState.Open,
      OpenState.Open,
      OpenState.Open,
      OpenState.Open,
    ])
  })
})
