import type { Reactor, SerializedReactor } from '@src/model/reactor'
import type { Serializable } from '@src/model/serializable'
import { deepClone } from '../shared/deepClone'
import { rget } from '../shared/rget'
import { rset } from '../shared/rset'
import { createMolecule } from '../molecule'
import { ReactorName } from './consts'

export type PickMapping = Serializable & {
  from?: (number | string)[] // when undefined, it's means root
  to?: (number | string)[] // when undefined, it's means root
  /**
   * When there is no path in input, reactor will put this value.
   * If `fallback` is not given, error molecule will be placed.
   */
  fallback?: Serializable
}

export const createPickReactor = (schema: SerializedReactor<PickMapping[]>) => {
  const { data: schemas } = schema

  return {
    name: ReactorName.Pick,
    run([molecule]) {
      let result = createMolecule(undefined)

      for (const schema of schemas) {
        const queried = rget(molecule, schema.from)

        rset(
          result,
          schema.to,
          queried.type === 'error' && schema.fallback
            ? deepClone(createMolecule(schema.fallback))
            : deepClone(queried),
        )
      }

      return [result]
    },
  } satisfies Reactor
}
