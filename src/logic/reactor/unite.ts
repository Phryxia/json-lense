import type { SerializedReactor } from '@src/model/reactor'
import type { Serializable } from '@src/model/serializable'
import { createRearrangerReactor } from './rearranger'
import { createMapperReactor } from './hyperReactor/mapper'

export function createReactor(
  serializedReactor: SerializedReactor<Serializable>,
) {
  switch (serializedReactor.name) {
    case 'rearranger':
      // @ts-ignore
      return createRearrangerReactor(serializedReactor)
    case 'mapper':
      // @ts-ignore
      return createMapperReactor(serializedReactor)
  }
  throw new Error(`Unsupported reactor tyupe ${serializedReactor.name}`)
}
