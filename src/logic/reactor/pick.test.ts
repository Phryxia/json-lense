import { describe, test, expect } from 'vitest'
import { createPickReactor } from './pick'
import { createMolecule } from '../molecule'
import { ReactorName } from './consts'

describe(ReactorName.Pick, () => {
  test('single-path-to', () => {
    const r1 = createPickReactor({
      name: ReactorName.Pick,
      data: [
        {
          from: ['k1', 'k2'],
          to: ['k3', 'k4'],
        },
      ],
    })
    const [o1] = r1.run([createMolecule({ k1: { k2: 42 } })])

    expect(o1).toMatchObject(createMolecule({ k3: { k4: 42 } }))
  })

  test('single-path', () => {
    const r1 = createPickReactor({
      name: ReactorName.Pick,
      data: [
        {
          from: ['k1', 'k2'],
        },
      ],
    })
    const [o1] = r1.run([createMolecule({ k1: { k2: 42 } })])

    expect(o1).toMatchObject(createMolecule(42))
  })

  test('single-to', () => {
    const r1 = createPickReactor({
      name: ReactorName.Pick,
      data: [
        {
          to: ['k1', 'k2'],
        },
      ],
    })
    const [o1] = r1.run([createMolecule(42)])

    expect(o1).toMatchObject(createMolecule({ k1: { k2: 42 } }))
  })

  test('single-copy', () => {
    const r1 = createPickReactor({
      name: ReactorName.Pick,
      data: [{}],
    })
    const [o1] = r1.run([createMolecule(42)])

    expect(o1).toMatchObject(createMolecule(42))
  })

  test('multi', () => {
    const r1 = createPickReactor({
      name: ReactorName.Pick,
      data: [
        {
          from: ['k1'],
          to: ['u1'],
        },
        {
          from: ['k2', 'k3'],
          to: ['u2'],
        },
      ],
    })
    const [o1] = r1.run([
      createMolecule({ k1: 'v1', k2: { k3: 'v3' }, d: null }),
    ])

    expect(o1).toMatchObject(createMolecule({ u1: 'v1', u2: 'v3' }))
  })
})
