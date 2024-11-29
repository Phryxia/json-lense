import { describe, expect, it, suite, test } from 'vitest'
import { createMolecule } from '../molecule'
import { rdel } from './rdel'

describe('rdel', () => {
  it('should muatate into undefined molecule when path is empty', () => {
    const m = createMolecule(0)
    rdel(m, [])

    expect(m).toMatchObject({
      value: undefined,
      type: 'undefined',
    })
  })

  suite('should remove existing property', () => {
    suite('should remove property from object', () => {
      test('case0', () => {
        const m = createMolecule({ x: { y: 0 }, z: 0 })
        rdel(m, ['x', 'y'])

        expect(m).toMatchObject({
          value: {
            x: {
              value: {},
              type: {},
            },
            z: {
              value: 0,
              type: 'number',
            },
          },
          type: { x: {}, z: 'number' },
        })
      })

      test('case1', () => {
        const m = createMolecule({ x: { y: 0 }, z: 0 })
        rdel(m, ['x'])

        expect(m).toMatchObject({
          value: {
            z: {
              value: 0,
              type: 'number',
            },
          },
          type: { z: 'number' },
        })
      })
    })

    it('should fill undefined molecule when it is middle of the array', () => {
      const m = createMolecule(['foo', 1])
      rdel(m, [0])

      expect(m).toMatchObject({
        value: [
          {
            value: undefined,
            type: 'undefined',
          },
          {
            value: 1,
            type: 'number',
          },
        ],
        type: ['undefined', 'number'],
      })
    })

    it('should pop when it is the end of the array', () => {
      const m = createMolecule(['foo', 1])
      rdel(m, [1])

      expect(m).toMatchObject({
        value: [
          {
            value: 'foo',
            type: 'string',
          },
        ],
        type: ['string'],
      })
    })
  })

  suite('should ignore when there is such property', () => {
    test('case0', () => {
      const m = createMolecule(0)
      rdel(m, ['a'])

      expect(m).toMatchObject({
        value: 0,
        type: 'number',
      })
    })

    test('case1', () => {
      const m = createMolecule([0])
      rdel(m, [1])

      expect(m).toMatchObject({
        value: [
          {
            value: 0,
            type: 'number',
          },
        ],
        type: ['number'],
      })
    })
  })
})
