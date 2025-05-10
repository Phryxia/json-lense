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
  try {
    const escapedKeyword = isRegexUsed
      ? keyword
      : escapeStringForRegExp(keyword)

    const regexp = new RegExp(
      isMatchWord ? `(?<!\\w)${escapedKeyword}(?!\\w)` : escapedKeyword,
      !isMatchCase ? 'i' : undefined,
    )

    return regexp
  } catch (e) {
    return undefined
  }
}

/**
 * Add escape sequence `\` to put string content
 * safely to `new RegExp`
 * */
function escapeStringForRegExp(s: string) {
  return s.replaceAll(/([.,?!*+$|\^()\[\]{}\\])/g, '\\$1')
}

export function extractResult(match: RegExpExecArray) {
  return [match.index, match.index + match[0].length]
}
