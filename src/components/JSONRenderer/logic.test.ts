import { describe, test, expect } from 'vitest'
import { renderJSONAsLines } from './logic'

describe('renderJSONAsLines', () => {
  test('scope index', () => {
    const lines = [
      ...renderJSONAsLines({
        leaf0: 0,
        nested1: {
          leaf1: 1,
          leaf2: 2,
        },
        nested2: [
          'a', // comment to bypass prettier
          'b',
        ],
        leaf3: 3,
      }),
    ]

    expect(lines[0].scopeEndIndex).toBe(11)
    expect(lines[2].scopeEndIndex).toBe(5)
    expect(lines[6].scopeEndIndex).toBe(9)
  })
})
