import { describe, expect, suite, test } from 'vitest'
import { createOmitReactor } from './omit'
import { ReactorName } from './consts'
import { createMolecule } from '../molecule'

describe('omit', () => {
  suite('should remove properties in requested paths', () => {
    const omit = createOmitReactor({
      name: ReactorName.Omit,
      data: {
        paths: [['x', 'y'], ['z']],
      },
    })

    test('case0', () => {
      const [output] = omit.run([
        createMolecule({ x: { y: 0, z: 'z' }, z: 'z' }),
      ])

      expect(output).toMatchObject({
        value: {
          x: {
            value: {
              z: {
                value: 'z',
                type: 'string',
              },
            },
            type: { z: 'string' },
          },
        },
        type: { x: { z: 'string' } },
      })
    })
  })
})
