import { describe, expect, it, test } from 'vitest'
import {
  computeUnfoldedScopes,
  constructTree,
  countVisibleLines,
} from './unfoldTargetedLine'

describe('computeUnfoldingScopes', () => {
  describe('trivial', () => {
    it('should open the closed scope inclusively', () => {
      expect(
        computeUnfoldedScopes(
          [
            {
              begin: 0,
              end: 1,
              isOpen: false,
            },
          ],
          1,
        ),
      ).toMatchObject([
        {
          begin: 0,
          end: 1,
          isOpen: true,
        },
      ])

      expect(
        computeUnfoldedScopes(
          [
            {
              begin: 0,
              end: 1,
              isOpen: false,
            },
          ],
          0,
        ),
      ).toMatchObject([
        {
          begin: 0,
          end: 1,
          isOpen: true,
        },
      ])
    })

    it('should not open that is already open', () => {
      expect(
        computeUnfoldedScopes(
          [
            {
              begin: 0,
              end: 1,
              isOpen: true,
            },
          ],
          1,
        ),
      ).toMatchObject([
        {
          begin: 0,
          end: 1,
          isOpen: true,
        },
      ])
    })

    it('should not open the out of range scope', () => {
      expect(computeUnfoldedScopes([], 0)).toMatchObject([])
      expect(
        computeUnfoldedScopes([{ begin: 0, end: 1, isOpen: false }], 2),
      ).toMatchObject([{ begin: 0, end: 1, isOpen: false }])
    })
  })

  describe('nested', () => {
    it('should open the closed scope, if index is in range', () => {
      expect(
        computeUnfoldedScopes(
          [
            { begin: 0, end: 5, isOpen: false },
            { begin: 1, end: 4, isOpen: false },
            { begin: 2, end: 3, isOpen: false },
          ],
          2,
        ),
      ).toMatchObject([
        { begin: 0, end: 5, isOpen: true },
        { begin: 1, end: 4, isOpen: true },
        { begin: 2, end: 3, isOpen: true },
      ])
    })

    it('should not open the closed scope, if index is out of range', () => {
      expect(
        computeUnfoldedScopes(
          [
            { begin: 0, end: 6, isOpen: false },
            { begin: 1, end: 2, isOpen: false },
            { begin: 3, end: 4, isOpen: false },
          ],
          2,
        ),
      ).toMatchObject([
        { begin: 0, end: 6, isOpen: true },
        { begin: 1, end: 2, isOpen: true },
        { begin: 3, end: 4, isOpen: false },
      ])
    })
  })
})

describe('constructTree', () => {
  it('trivial', () => {
    expect(constructTree([])).toMatchObject([])
    expect(constructTree([{ begin: 0, end: 1 }])).toMatchObject([
      { begin: 0, end: 1 },
    ])
  })

  test('multiple roots', () => {
    expect(
      compareTreeNode(
        constructTree([
          { begin: 0, end: 1 },
          { begin: 2, end: 3 },
        ]),
        [
          { begin: 0, end: 1 },
          { begin: 2, end: 3 },
        ],
      ),
    ).toBeTruthy()
  })

  test('nested', () => {
    expect(
      compareTreeNode(
        constructTree([
          { begin: 0, end: 3 },
          { begin: 1, end: 2 },
        ]),
        [{ begin: 0, end: 3, children: [{ begin: 1, end: 2 }] }],
      ),
    ).toBeTruthy()
  })

  test('complex', () => {
    expect(
      compareTreeNode(
        constructTree([
          { begin: 0, end: 3 },
          { begin: 1, end: 2 },
          { begin: 4, end: 7 },
          { begin: 5, end: 6 },
        ]),
        [
          { begin: 0, end: 3, children: [{ begin: 1, end: 2 }] },
          { begin: 4, end: 7, children: [{ begin: 5, end: 6 }] },
        ],
      ),
    ).toBeTruthy()
  })
})

function compareTreeNode(received: any, expected: any): boolean {
  if (expected == null) return true

  if (expected && typeof expected === 'object') {
    for (const key of Object.keys(expect)) {
      if (key === 'parent') continue

      if (!compareTreeNode(received?.[key], expected[key])) return false
    }

    return true
  }

  return received === expected
}

describe('countVisibleLines', () => {
  it('trivial', () => {
    expect(countVisibleLines([], 0)).toBe(0)
  })

  it('should count the open scopes', () => {
    expect(countVisibleLines([{ begin: 0, end: 2, isOpen: true }], 0)).toBe(1)
    expect(countVisibleLines([{ begin: 0, end: 2, isOpen: true }], 1)).toBe(2)
    expect(countVisibleLines([{ begin: 0, end: 2, isOpen: true }], 2)).toBe(3)
  })

  it('should count the closed scopes as 1', () => {
    expect(
      countVisibleLines(
        [
          {
            begin: 0,
            end: 2,
            isOpen: false,
          },
        ],
        0,
      ),
    ).toBe(1)
    expect(
      countVisibleLines(
        [
          { begin: 0, end: 3, isOpen: false },
          { begin: 1, end: 2, isOpen: false },
        ],
        4,
      ),
    ).toBe(1)
    expect(
      countVisibleLines(
        [
          { begin: 0, end: 3, isOpen: true },
          { begin: 1, end: 2, isOpen: true },
        ],
        2,
      ),
    ).toBe(3)
  })

  describe('nested', () => {
    test('', () => {
      expect(
        countVisibleLines(
          [
            { begin: 0, end: 5, isOpen: false },
            { begin: 1, end: 4, isOpen: false },
            { begin: 2, end: 3, isOpen: false },
          ],
          2,
        ),
      ).toBe(1)
    })
  })
})
