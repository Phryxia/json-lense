import type { JSONTokenType } from './consts'

export type JSONToken = JSONDefinedToken | JSONLineBreak

export type JSONDefinedToken = {
  type: Exclude<JSONTokenType, JSONTokenType.LineBreak>
  content: string
  id: number
  tabs: number
}

export type JSONLineBreak = {
  type: JSONTokenType.LineBreak
  content?: never
}

export type IndexedJSONLine = {
  tokens: JSONDefinedToken[]
  index: number
  scopeEndIndex?: number
}
