import type { IndexedJSONLine } from '../JSONRenderer/types'

type SearchFromLineParams = {
  line: IndexedJSONLine
  keyword: string
  isMatchCase: boolean
  isMatchWord: boolean
  isRegexUsed: boolean
}

export function searchFromLine({
  line,
  keyword,
  isMatchCase,
  isMatchWord,
  isRegexUsed,
}: SearchFromLineParams) {
  const regexp = createRegExp(isRegexUsed, keyword, isMatchWord, isMatchCase)

  if (!regexp) return []

  return line.tokens
    .map((token) => {
      const target = token.content

      return {
        token,
        match: regexp.exec(target)!,
      }
    })
    .filter(({ match }) => match)
}

function createRegExp(
  isRegexUsed: boolean,
  keyword: string,
  isMatchWord: boolean,
  isMatchCase: boolean,
) {
  const escapedKeyword = isRegexUsed
    ? keyword
    : keyword.replaceAll(/([.?!()\[\]*])/g, '\\$1')

  try {
    const regexp = new RegExp(
      isMatchWord ? `(?<!\\w)${escapedKeyword}(?!\\w)` : escapedKeyword,
      !isMatchCase ? 'i' : undefined,
    )

    return regexp
  } catch (e) {
    return undefined
  }
}

export function extractResult(match: RegExpExecArray) {
  if (match.length === 1) {
    return [[match.index, match.index + match[0].length]]
  }

  const results: [number, number][] = []

  for (let i = 1; i <= match.length - 1; ++i) {
    const matchedIndices = match.indices?.[i]

    if (matchedIndices) {
      results.push(matchedIndices)
    }
  }

  return results
}
