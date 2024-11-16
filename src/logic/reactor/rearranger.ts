import type {
  Reactor,
  ReactorCreator,
  SerializedReactor,
} from '@src/model/reactor'
import type { Serializable } from '@src/model/serializable'
import { deepClone } from '../shared/deepClone'
import { rget, rset } from '../shared/rget'
import { createMolecule } from '../molecule'

export interface RearrangerSchema extends SerializedReactor {
  name: 'rearranger'
  data: {
    schemas: RearrangerMapping[]
  }
}

interface RearrangerMapping {
  from?: string[] // when undefined, it's means root
  to?: (string | number)[] // when undefined, it's means root
  /**
   * When there is no path in input, reactor will put this value.
   * If `fallback` is not given, error molecule will be placed.
   */
  fallback?: Serializable
}

export const createRearrangerReactor: ReactorCreator<RearrangerSchema> = (
  schema: RearrangerSchema,
) => {
  const {
    data: { schemas },
  } = schema

  return {
    name: 'rearranger',
    run([molecule]) {
      let result = createMolecule(undefined)

      for (const schema of schemas) {
        const queried = rget(molecule, schema.from)

        rset(
          result,
          schema.to,
          queried.error && schema.fallback
            ? deepClone(createMolecule(schema.fallback))
            : deepClone(queried),
        )
      }

      return [result]
    },
  } satisfies Reactor
}
