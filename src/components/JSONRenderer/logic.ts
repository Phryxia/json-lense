import { fx } from '@fxts/core'
import { Counter } from '@src/logic/shared/counter'
import type { IndexedJSONLine, JSONToken } from './types'
import { JSONTokenType } from './consts'

export function* renderJSONAsLines(
  value: any,
  tabChar = '  ',
): IterableIterator<IndexedJSONLine> {
  const idCounter = new Counter()
  let index = 0
  let line: JSONToken[] = []
  for (const token of renderJSONAsToken({
    value,
    tabChar,
    tabs: 0,
    idCounter,
  })) {
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

type RenderJSONAsTokenParams = {
  value: any
  tabChar: string
  tabs: number
  idCounter: Counter
}

function* renderJSONAsToken({
  value,
  tabChar,
  tabs,
  idCounter,
}: RenderJSONAsTokenParams): IterableIterator<JSONToken> {
  if (value === undefined) {
    yield {
      type: JSONTokenType.Null,
      content: 'undefined',
      id: idCounter.next(),
    }
    return
  }
  if (value === null) {
    yield { type: JSONTokenType.Null, content: 'null', id: idCounter.next() }
    return
  }
  if (typeof value === 'boolean') {
    yield {
      type: JSONTokenType.Boolaen,
      content: value.toString(),
      id: idCounter.next(),
    }
    return
  }
  if (typeof value === 'number') {
    yield {
      type: JSONTokenType.Number,
      content: value.toString(),
      id: idCounter.next(),
    }
    return
  }
  if (typeof value === 'string') {
    yield {
      type: JSONTokenType.String,
      content: `"${sanitizeString(value)}"`,
      id: idCounter.next(),
    }
    return
  }
  if (value instanceof Array) {
    yield {
      type: JSONTokenType.Parenthesis,
      content: '[',
      id: idCounter.next(),
    }
    yield { type: JSONTokenType.LineBreak }

    for (const child of value) {
      yield {
        type: JSONTokenType.Whitespace,
        content: tabChar.repeat(tabs + 1),
        id: idCounter.next(),
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
      }
      yield { type: JSONTokenType.LineBreak }
    }

    yield {
      type: JSONTokenType.Whitespace,
      content: tabChar.repeat(tabs),
      id: idCounter.next(),
    }
    yield {
      type: JSONTokenType.Parenthesis,
      content: ']',
      id: idCounter.next(),
    }
    return
  }
  yield { type: JSONTokenType.Parenthesis, content: '{', id: idCounter.next() }
  yield { type: JSONTokenType.LineBreak }

  for (const [key, child] of Object.entries(value)) {
    yield {
      type: JSONTokenType.Whitespace,
      content: tabChar.repeat(tabs + 1),
      id: idCounter.next(),
    }
    yield { type: JSONTokenType.Key, content: key, id: idCounter.next() }
    yield { type: JSONTokenType.Delimiter, content: ':', id: idCounter.next() }
    yield* renderJSONAsToken({
      value: child,
      tabChar,
      tabs: tabs + 1,
      idCounter,
    })
    yield { type: JSONTokenType.Delimiter, content: ',', id: idCounter.next() }
    yield { type: JSONTokenType.LineBreak }
  }

  yield {
    type: JSONTokenType.Whitespace,
    content: tabChar.repeat(tabs),
    id: idCounter.next(),
  }
  yield { type: JSONTokenType.Parenthesis, content: '}', id: idCounter.next() }
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
