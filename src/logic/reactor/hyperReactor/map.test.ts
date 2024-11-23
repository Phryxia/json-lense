import { describe, test, expect } from 'vitest'
import { createMapReactor } from './map'
import { createMolecule } from '@src/logic/molecule'
import { ReactorName } from '../consts'

describe(ReactorName.Map, () => {
  test('should map array elements using given reactor', () => {
    const mapper = createMapReactor({
      name: ReactorName.Map,
      data: {
        mapper: {
          name: ReactorName.Pick,
          data: [
            {
              from: ['value'],
              to: ['transformed'],
            },
          ],
        },
      },
    })

    const input = createMolecule([{ value: 1 }, { value: 2 }, { value: 3 }])

    const [output] = mapper.run([input])

    expect(output).toMatchObject(
      createMolecule([
        { transformed: 1 },
        { transformed: 2 },
        { transformed: 3 },
      ]),
    )
  })

  test('should return error for non-array input', () => {
    const mapper = createMapReactor({
      name: ReactorName.Map,
      data: {
        mapper: {
          name: ReactorName.Pick,
          data: [{}],
        },
      },
    })

    const input = createMolecule({ key: 'value' })
    const [output] = mapper.run([input])

    expect(output).toMatchObject({
      error: true,
      type: 'error',
      reason: 'input is not an array',
    })
  })

  test('should handle empty array input', () => {
    const mapper = createMapReactor({
      name: ReactorName.Map,
      data: {
        mapper: {
          name: ReactorName.Pick,
          data: [
            {
              from: ['value'],
              to: ['transformed'],
            },
          ],
        },
      },
    })

    const input = createMolecule([])
    const [output] = mapper.run([input])

    expect(output).toMatchObject(createMolecule([]))
  })
})
