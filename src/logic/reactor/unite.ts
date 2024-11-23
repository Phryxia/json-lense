import type { SerializedReactor } from '@src/model/reactor'
import type { Serializable } from '@src/model/serializable'
import { createPickReactor } from './pick'
import { createMapReactor } from './hyperReactor/map'
import { ReactorName } from './consts'

export function createReactor(
  serializedReactor: SerializedReactor<Serializable>,
) {
  switch (serializedReactor.name) {
    case ReactorName.Pick:
      // @ts-ignore
      return createPickReactor(serializedReactor)
    case ReactorName.Map:
      // @ts-ignore
      return createMapReactor(serializedReactor)
  }
  throw new Error(`Unsupported reactor tyupe ${serializedReactor.name}`)
}
