import { describe, test, expect } from 'vitest'
import type { Molecule } from '@src/model/molecule'
import { createMolecule } from '../molecule'
import { rget } from './rget'

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
