import { isArrayType } from '@src/logic/molecule'
import type { Reactor, SerializedReactor } from '@src/model/reactor'
import { Serializable } from '@src/model/serializable'
import { createReactor } from '../unite'

export interface MapperSchema
  extends SerializedReactor<{ mapper: SerializedReactor<Serializable> }> {}

export function createMapperReactor({
  data: { mapper },
}: MapperSchema): Reactor {
  const mapperReactor = createReactor(mapper)

  return {
    name: 'mapper',
    run([molecule]) {
      if (!isArrayType(molecule)) {
        return [
          {
            error: true,
            type: 'error',
            reason: 'input is not an array',
          },
        ]
      }

      const children = molecule.value.map(
        (child) => mapperReactor.run([child])[0],
      )

      return [
        {
          value: children,
          type: children.map(({ type }) => type),
        },
      ]
    },
  }
}
