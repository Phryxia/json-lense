import { isArrayType } from '@src/logic/molecule'
import type { Reactor, SerializedReactor } from '@src/model/reactor'
import { Serializable } from '@src/model/serializable'
import { createReactor } from '../unite'
import { ReactorName } from '../consts'

export interface MapSchema
  extends SerializedReactor<{ mapper: SerializedReactor<Serializable> }> {}

export function createMapReactor({ data: { mapper } }: MapSchema): Reactor {
  const mapperReactor = createReactor(mapper)

  return {
    name: ReactorName.Map,
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
