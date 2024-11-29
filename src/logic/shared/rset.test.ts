import { describe, test, expect } from 'vitest'
import { createMolecule } from '../molecule'
import { rset } from './rset'

describe('rset', () => {
  test('depth-0', () => {
    const v = createMolecule(1)
    const i1 = createMolecule(0)
    const o1 = rset(i1, null, v)

    expect(i1 === o1).toBeTruthy()
    expect(o1).toMatchObject({
      value: 1,
      type: 'number',
    })
  })

  test('depth-1-object', () => {
    const v = createMolecule(1)
    const i1 = createMolecule({})
    const o1 = rset(i1, ['k1'], v)

    expect(i1 === o1).toBeTruthy()
    expect(o1).toMatchObject({
      value: {
        k1: {
          value: 1,
          type: 'number',
        },
      },
      type: { k1: 'number' },
    })
  })

  test('depth-1-array', () => {
    const v = createMolecule(1)
    const i1 = createMolecule([])
    const o1 = rset(i1, [0], v)

    expect(i1 === o1).toBeTruthy()
    expect(o1).toMatchObject({
      value: [
        {
          value: 1,
          type: 'number',
        },
      ],
      type: ['number'],
    })
  })

  test('depth-2-by-object', () => {
    const v = createMolecule(1)
    const i1 = createMolecule({ k3: null })
    const o1 = rset(i1, ['k1', 'k2'], v)

    expect(i1 === o1).toBeTruthy()
    expect(o1).toMatchObject({
      value: {
        k1: {
          value: {
            k2: {
              value: 1,
              type: 'number',
            },
          },
          type: {
            k2: 'number',
          },
        },
        k3: {
          value: null,
          type: 'null',
        },
      },
      type: {
        k1: {
          k2: 'number',
        },
        k3: 'null',
      },
    })
  })

  test('depth-2-by-array', () => {
    const v = createMolecule(1)
    const i1 = createMolecule({ k3: null })
    const o1 = rset(i1, ['k1', 1], v)

    expect(i1 === o1).toBeTruthy()
    expect(o1).toMatchObject({
      value: {
        k1: {
          value: [
            { value: undefined, type: 'undefined' },
            { value: 1, type: 'number' },
          ],
          type: ['undefined', 'number'],
        },
        k3: {
          value: null,
          type: 'null',
        },
      },
      type: {
        k1: ['undefined', 'number'],
        k3: 'null',
      },
    })
  })
})
