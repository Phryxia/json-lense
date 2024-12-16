import type { Molecule } from '@src/model/molecule'
import type {
  Reactor,
  ReactorNodeMeta,
  SerializedReactor,
} from '@src/model/reactor'
import { deepClone } from '../shared/deepClone'
import { rdel } from '../shared/rdel'
import { ReactorName } from './consts'

type OmitSchema = {
  paths: (string | number)[][]
}

const OmitReactorMeta = {
  inlets: 1,
  outlets: 1,
} satisfies ReactorNodeMeta

export function createOmitReactor({
  data: { paths },
}: SerializedReactor<OmitSchema>) {
  return {
    name: ReactorName.Omit,
    meta: OmitReactorMeta,
    run([molecule]) {
      if (!paths.length) return [molecule]

      const result = deepClone(molecule) as Molecule

      for (const path of paths) {
        rdel(result, path)
      }

      return [result]
    },
  } satisfies Reactor
}
