import { fx } from '@fxts/core'
import type { IndexedJSONLine, JSONToken } from './types'
import { JSONTokenType } from './consts'

export function* renderJSONAsLines(
  value: any,
  tabChar = '  ',
): IterableIterator<IndexedJSONLine> {
  let index = 0
  let line: JSONToken[] = []
  for (const token of renderJSONAsToken(value, tabChar)) {
    if (token.type === JSONTokenType.LineBreak) {
      yield {
        tokens: line,
        index: index++,
      }
      line = []
    } else {
      line.push(token)
    }
  }
  yield {
    tokens: line,
    index: index++,
  }
}

function* renderJSONAsToken(
  value: any,
  tabChar: string,
  tabs = 0,
): IterableIterator<JSONToken> {
  if (value === undefined) {
    yield { type: JSONTokenType.Null, content: 'undefined' }
    return
  }
  if (value === null) {
    yield { type: JSONTokenType.Null, content: 'null' }
    return
  }
  if (typeof value === 'boolean') {
    yield { type: JSONTokenType.Boolaen, content: value.toString() }
    return
  }
  if (typeof value === 'number') {
    yield { type: JSONTokenType.Number, content: value.toString() }
    return
  }
  if (typeof value === 'string') {
    yield {
      type: JSONTokenType.String,
      content: `"${sanitizeString(value)}"`,
    }
    return
  }
  if (value instanceof Array) {
    yield { type: JSONTokenType.Parenthesis, content: '[' }
    yield { type: JSONTokenType.LineBreak }

    for (const child of value) {
      yield {
        type: JSONTokenType.Whitespace,
        content: tabChar.repeat(tabs + 1),
      }
      yield* renderJSONAsToken(child, tabChar, tabs + 1)
      yield { type: JSONTokenType.Delimiter, content: ',' }
      yield { type: JSONTokenType.LineBreak }
    }

    yield { type: JSONTokenType.Whitespace, content: tabChar.repeat(tabs) }
    yield { type: JSONTokenType.Parenthesis, content: ']' }
    return
  }
  yield { type: JSONTokenType.Parenthesis, content: '{' }
  yield { type: JSONTokenType.LineBreak }

  for (const [key, child] of Object.entries(value)) {
    yield { type: JSONTokenType.Whitespace, content: tabChar.repeat(tabs + 1) }
    yield { type: JSONTokenType.Key, content: key }
    yield { type: JSONTokenType.Delimiter, content: ':' }
    yield* renderJSONAsToken(child, tabChar, tabs + 1)
    yield { type: JSONTokenType.Delimiter, content: ',' }
    yield { type: JSONTokenType.LineBreak }
  }

  yield { type: JSONTokenType.Whitespace, content: tabChar.repeat(tabs) }
  yield { type: JSONTokenType.Parenthesis, content: '}' }
}

const SpecialEscape: Record<string, string> = {
  '\0': '\\0',
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\v': '\\v',
  '\f': '\\f',
  '\r': '\\r',
  '"': '\\"',
}
function sanitizeString(s: string) {
  return fx(s)
    .map((c) => SpecialEscape[c] ?? c)
    .toArray()
    .join('')
}
