import type { Reactor } from '@src/model/reactor'
import type { Molecule } from '@src/model/molecule'
import { rget, rset } from '../shared/rget'
import { createMolecule, serializeMolecule } from '../molecule'
import { deepClone } from '../shared/deepClone'

export interface RearrangerSchema {
  from?: string[] // when undefined, it's means root
  to?: (string | number)[] // when undefined, it's means root
  /**
   * When there is no path in input, reactor will put this value.
   * If `fallback` is not given, error molecule will be placed.
   */
  fallback?: Molecule
}

export function createRearrangerReactor(schemas: RearrangerSchema[]) {
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
            ? deepClone(schema.fallback)
            : deepClone(queried),
        )
      }

      return [result]
    },
    serializer: {
      parse(s): Reactor {
        const { schemas } = JSON.parse(s)

        return createRearrangerReactor(
          schemas.map(({ fallback, ...rest }: any) => ({
            fallback: fallback ? createMolecule(fallback) : undefined,
            ...rest,
          })),
        )
      },
      stringify() {
        return JSON.stringify({
          schemas: schemas.map(({ fallback, ...rest }) => ({
            fallback: fallback ? serializeMolecule(fallback) : undefined,
            ...rest,
          })),
        })
      },
    },
  } satisfies Reactor
}
