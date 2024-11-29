import { describe, test, expect } from 'vitest'
import type { Molecule } from '@src/model/molecule'
import { createMolecule } from '../molecule'
import { rget, rset } from './rget'

describe('rget', () => {
  test('transparent', () => {
    const i1 = createMolecule(0)
    expect(rget(i1)).toMatchObject<Molecule>({
      value: 0,
      type: 'number',
    })

    expect(rget(i1, [])).toMatchObject<Molecule>({
      value: 0,
      type: 'number',
    })
  })

  test('nestedArray', () => {
    const i1 = createMolecule([0, [1]])
    expect(rget(i1, [0])).toMatchObject({
      value: 0,
      type: 'number',
    })
    expect(rget(i1, [1])).toMatchObject({
      value: [
        {
          value: 1,
          type: 'number',
        },
      ],
      type: ['number'],
    })
    expect(rget(i1, [1, 0])).toMatchObject({
      value: 1,
      type: 'number',
    })
  })

  test('nestedObject', () => {
    const i1 = createMolecule({ a: 'a', k1: { b: 'b' } })
    expect(rget(i1, ['a'])).toMatchObject({
      value: 'a',
      type: 'string',
    })
    expect(rget(i1, ['k1'])).toMatchObject({
      value: {
        b: {
          value: 'b',
          type: 'string',
        },
      },
      type: { b: 'string' },
    })
    expect(rget(i1, ['k1', 'b'])).toMatchObject({
      value: 'b',
      type: 'string',
    })
  })

  test('unreachable', () => {
    const i1 = createMolecule(0)
    expect(rget(i1, ['k1', 'k2', 'k3'])).toMatchObject<Molecule>({
      type: 'error',
      reason: "Cannot reach k1.k2.k3: property k1 doesn't exists",
    })

    const i2 = createMolecule({ k1: {} })
    expect(rget(i2, ['k1', 'k2', 'k3'])).toMatchObject<Molecule>({
      type: 'error',
      reason: "Cannot reach k1.k2.k3: property k2 doesn't exists",
    })

    const i3 = createMolecule({ k1: { k2: null } })
    expect(rget(i3, ['k1', 'k2', 'k3'])).toMatchObject<Molecule>({
      type: 'error',
      reason: "Cannot reach k1.k2.k3: property k3 doesn't exists",
    })
  })
})

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
