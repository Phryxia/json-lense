import type { SerializedReactor } from '@src/model/reactor'
import type { Serializable } from '@src/model/serializable'

export type ReactorModuleProps<Schema extends Serializable> = {
  reactor: SerializedReactor<Schema>
  onChange(value: SerializedReactor<Schema>): void
}

export type ReactorModuleSocket = {
  inputParams?: string[]
  outputParams?: string[]
}
