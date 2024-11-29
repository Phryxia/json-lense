import { useLayoutEffect, useState } from 'react'
import { createRandomDomId } from '@src/logic/shared/randomDomId'

type Props = {
  value: (number | string)[] | undefined
  onChange(value: (number | string)[]): void
}

export function PathInput({ value, onChange }: Props) {
  const [text, setText] = useState('')
  const [error, setError] = useState('error')
  const [reasonId] = useState(createRandomDomId())

  useLayoutEffect(() => {
    setText(renderPath(value ?? []))
  }, [value])

  function handleBlur() {
    try {
      const path = parsePath(text)
      setError('')
      onChange(path)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.toString())
      } else {
        setError('unknown error')
      }
    }
  }

  return (
    <>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        placeholder="ex) a[0].b['foo-bar'].c"
        aria-invalid={error ? 'grammar' : undefined}
        aria-describedby={reasonId}
      />
      <small id={reasonId}>{error}</small>
    </>
  )
}

function renderPath(path: (number | string)[]) {
  let result = ''

  for (const key of path) {
    if (typeof key === 'number') {
      result += `[${key}]`
    } else {
      result += `.${key}`
    }
  }

  if (result[0] === '.') {
    return result.slice(1)
  }
  return result
}

function parsePath(text: string) {
  const result: (number | string)[] = []

  let i = 0

  function parseString() {
    const startQuote = text[i]
    i += 1

    let strings = ''
    while (text[i] && text[i] !== "'" && text[i] !== '"') {
      strings += text[i]
      i += 1
    }

    if (text[i] === startQuote) {
      i += 1
      return strings
    } else {
      throw createError(text[i], startQuote)
    }
  }

  function parseNumber() {
    let numbers = ''
    while (isNumber(text[i])) {
      numbers += text[i]
      i += 1
    }
    return numbers
  }

  while (i < text.length) {
    if (text[i] === '[') {
      i += 1

      let key: string | number = ''
      if (text[i] === "'" || text[i] === '"') {
        key = parseString()
      } else if (isNumber(text[i])) {
        key = parseNumber()
      } else {
        throw createError(text[i], 'string or non negative integer')
      }

      if (text[i] === ']') {
        i += 1
        result.push(key)
      } else {
        throw createError(text[i], ']')
      }
    } else if (text[i] === '.') {
      i += 1
    } else if (isNumber(text[i])) {
      throw createError(text[i], 'string')
    } else {
      let key = ''
      while (text[i] && isName(text[i])) {
        key += text[i]
        i += 1
      }
      result.push(key)
    }
  }

  return result
}

function createError(token: string, expect: string) {
  if (token) {
    return new SyntaxError(`Unexpected token "${token}", expect ${expect}`)
  }
  return new SyntaxError(`Unexpected end of string, expect `)
}

function isNumber(char: string) {
  return '0' <= char && char <= '9'
}

function isName(char: string) {
  return (
    ('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z') || char === '_'
  )
}
