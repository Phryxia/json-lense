import { fx } from '@fxts/core'
import { Counter } from '@src/logic/shared/counter'
import type { IndexedJSONLine, JSONToken } from '../types'
import { JSONTokenType } from '../consts'

export function* renderJSONAsLines(
  value: any,
  tabChar = '  ',
): IterableIterator<IndexedJSONLine> {
  const idCounter = new Counter()
  const lines: IndexedJSONLine[] = []
  const scopeStack: number[] = []

  let currentIndex = 0
  let line: JSONToken[] = []
  for (const token of renderJSONAsToken({
    value,
    tabChar,
    tabs: 0,
    idCounter,
  })) {
    if (token.type === JSONTokenType.LineBreak) {
      const newLine = {
        tokens: line,
        index: currentIndex++,
      }
      lines.push(newLine)
      yield newLine
      line = []
    } else {
      // to track open & close lines
      if (token.content === '{' || token.content === '[') {
        scopeStack.push(currentIndex)
      } else if (token.content === '}' || token.content === ']') {
        const scopeStartIndex = scopeStack.pop()!
        lines[scopeStartIndex].scopeEndIndex = currentIndex
      }
      line.push(token)
    }
  }

  const newLine = {
    tokens: line,
    index: currentIndex++,
  }
  lines.push(newLine)
  yield newLine
}

type RenderJSONAsTokenParams = {
  value: any
  tabChar: string
  tabs: number
  idCounter: Counter
}

function* renderJSONAsToken(
  params: RenderJSONAsTokenParams,
): IterableIterator<JSONToken> {
  const { value } = params
  if (value === undefined) {
    yield* renderJSONUndefinedAsToken(params)
    return
  }
  if (value === null) {
    yield* renderJSONNullAsToken(params)
    return
  }
  if (typeof value === 'boolean') {
    yield* renderJSONBooleanAsToken(params)
    return
  }
  if (typeof value === 'number') {
    yield* renderJSONNumberAsToken(params)
    return
  }
  if (typeof value === 'string') {
    yield* renderJSONStringAsToken(params)
    return
  }
  if (value instanceof Array) {
    yield* renderJSONArrayAsToken(params)
    return
  }
  yield* renderJSONObjectAsToken(params)
}

function* renderJSONUndefinedAsToken({
  tabs,
  idCounter,
}: RenderJSONAsTokenParams): IterableIterator<JSONToken> {
  yield {
    type: JSONTokenType.Null,
    content: 'undefined',
    id: idCounter.next(),
    tabs,
  }
}

function* renderJSONNullAsToken({
  tabs,
  idCounter,
}: RenderJSONAsTokenParams): IterableIterator<JSONToken> {
  yield {
    type: JSONTokenType.Null,
    content: 'null',
    id: idCounter.next(),
    tabs,
  }
}

function* renderJSONBooleanAsToken({
  value,
  tabs,
  idCounter,
}: RenderJSONAsTokenParams): IterableIterator<JSONToken> {
  yield {
    type: JSONTokenType.Boolaen,
    content: value.toString(),
    id: idCounter.next(),
    tabs,
  }
}

function* renderJSONNumberAsToken({
  value,
  tabs,
  idCounter,
}: RenderJSONAsTokenParams): IterableIterator<JSONToken> {
  yield {
    type: JSONTokenType.Number,
    content: value.toString(),
    id: idCounter.next(),
    tabs,
  }
}

function* renderJSONStringAsToken({
  value,
  tabs,
  idCounter,
}: RenderJSONAsTokenParams): IterableIterator<JSONToken> {
  yield {
    type: JSONTokenType.String,
    content: `"${sanitizeString(value)}"`,
    id: idCounter.next(),
    tabs,
  }
}

function* renderJSONArrayAsToken({
  value,
  tabChar,
  tabs,
  idCounter,
}: RenderJSONAsTokenParams): IterableIterator<JSONToken> {
  yield {
    type: JSONTokenType.Parenthesis,
    content: '[',
    id: idCounter.next(),
    tabs,
  }
  yield { type: JSONTokenType.LineBreak }

  for (const child of value) {
    yield {
      type: JSONTokenType.Whitespace,
      content: tabChar.repeat(tabs + 1),
      id: idCounter.next(),
      tabs,
    }
    yield* renderJSONAsToken({
      value: child,
      tabChar,
      tabs: tabs + 1,
      idCounter,
    })
    yield {
      type: JSONTokenType.Delimiter,
      content: ',',
      id: idCounter.next(),
      tabs,
    }
    yield { type: JSONTokenType.LineBreak }
  }

  yield {
    type: JSONTokenType.Whitespace,
    content: tabChar.repeat(tabs),
    id: idCounter.next(),
    tabs,
  }
  yield {
    type: JSONTokenType.Parenthesis,
    content: ']',
    id: idCounter.next(),
    tabs,
  }
}

function* renderJSONObjectAsToken({
  value,
  tabChar,
  tabs,
  idCounter,
}: RenderJSONAsTokenParams): IterableIterator<JSONToken> {
  yield {
    type: JSONTokenType.Parenthesis,
    content: '{',
    id: idCounter.next(),
    tabs,
  }
  yield { type: JSONTokenType.LineBreak }

  for (const [key, child] of Object.entries(value)) {
    yield {
      type: JSONTokenType.Whitespace,
      content: tabChar.repeat(tabs + 1),
      id: idCounter.next(),
      tabs,
    }
    yield { type: JSONTokenType.Key, content: key, id: idCounter.next(), tabs }
    yield {
      type: JSONTokenType.Delimiter,
      content: ':',
      id: idCounter.next(),
      tabs,
    }
    yield* renderJSONAsToken({
      value: child,
      tabChar,
      tabs: tabs + 1,
      idCounter,
    })
    yield {
      type: JSONTokenType.Delimiter,
      content: ',',
      id: idCounter.next(),
      tabs,
    }
    yield { type: JSONTokenType.LineBreak }
  }

  yield {
    type: JSONTokenType.Whitespace,
    content: tabChar.repeat(tabs),
    id: idCounter.next(),
    tabs,
  }
  yield {
    type: JSONTokenType.Parenthesis,
    content: '}',
    id: idCounter.next(),
    tabs,
  }
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
