import type { JSONTokenType } from './consts'

export type JSONToken =
  | {
      type: Exclude<JSONTokenType, JSONTokenType.LineBreak>
      content: string
      id: number
    }
  | {
      type: JSONTokenType.LineBreak
      content?: never
    }

export type IndexedJSONLine = {
  tokens: JSONToken[]
  index: number
}
