import { describe, expect, test } from 'vitest'
import type { Molecule } from '@src/model/molecule'
import { createMolecule } from './molecule'

describe('createMolecule', () => {
  test('undefined', () => {
    expect(createMolecule(undefined)).toMatchObject<Molecule>({
      value: undefined,
      type: 'undefined',
    })
  })

  test('null', () => {
    expect(createMolecule(null)).toMatchObject<Molecule>({
      value: null,
      type: 'null',
    })
  })

  test('boolean', () => {
    expect(createMolecule(true)).toMatchObject<Molecule>({
      value: true,
      type: 'boolean',
    })
  })

  test('string', () => {
    expect(createMolecule('babo')).toMatchObject<Molecule>({
      value: 'babo',
      type: 'string',
    })
  })

  test('number', () => {
    expect(createMolecule(42)).toMatchObject<Molecule>({
      value: 42,
      type: 'number',
    })
  })

  test('array', () => {
    expect(createMolecule([])).toMatchObject<Molecule>({
      value: [],
      type: [],
    })

    const t2 = [undefined, null, true, 42, 'babo']
    expect(createMolecule(t2)).toMatchObject<Molecule>({
      value: t2.map(createMolecule),
      type: ['undefined', 'null', 'boolean', 'number', 'string'],
    })

    const t3 = [[], [42]]
    expect(createMolecule(t3)).toMatchObject<Molecule>({
      value: [
        { value: [], type: [] },
        { value: [{ value: 42, type: 'number' }], type: ['number'] },
      ],
      type: [[], ['number']],
    })
  })

  test('object', () => {
    expect(createMolecule({})).toMatchObject<Molecule>({
      value: {},
      type: {},
    })

    const t2 = { v0: undefined, v1: null, v2: true, v3: 42, v4: 'babo' }
    expect(createMolecule(t2)).toMatchObject<Molecule>({
      value: {
        v0: { value: undefined, type: 'undefined' },
        v1: { value: null, type: 'null' },
        v2: { value: true, type: 'boolean' },
        v3: { value: 42, type: 'number' },
        v4: { value: 'babo', type: 'string' },
      },
      type: {
        v0: 'undefined',
        v1: 'null',
        v2: 'boolean',
        v3: 'number',
        v4: 'string',
      },
    })

    const t3 = { v0: {}, v1: { v2: 42 } }
    expect(createMolecule(t3)).toMatchObject<Molecule>({
      value: {
        v0: {
          value: {},
          type: {},
        },
        v1: {
          value: {
            v2: {
              value: 42,
              type: 'number',
            },
          },
          type: {
            v2: 'number',
          },
        },
      },
      type: {
        v0: {},
        v1: {
          v2: 'number',
        },
      },
    })
  })
})
