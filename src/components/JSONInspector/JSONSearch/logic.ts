import type { LineContent, NestedContent } from '@src/model/Content'
import type { JSONSearchResult, SearchParameters } from '../types'

export function searchFromContent(
  content: NestedContent | LineContent,
  searchParams: SearchParameters,
): JSONSearchResult[] {
  if (content.type === 'line') {
    return searchFromLineContent(content, searchParams)
  }
  if (content.type === 'block') {
    return searchFromNestedContent(content, searchParams)
  }
  return []
}

function searchFromNestedContent(
  content: NestedContent,
  searchParams: SearchParameters,
): JSONSearchResult[] {
  return (
    content.children?.flatMap((child) =>
      searchFromContent(child, searchParams),
    ) ?? []
  )
}

function searchFromLineContent(
  line: LineContent,
  { keyword, isMatchCase, isMatchWord, isRegexUsed }: SearchParameters,
): JSONSearchResult[] {
  const regexp = createRegExp(isRegexUsed, keyword, isMatchWord, isMatchCase)

  if (!regexp) return []

  return (
    line.children?.flatMap((inlineContent) => {
      const matches = [...inlineContent.text.matchAll(regexp)]

      return matches.map(
        (match, index) =>
          ({
            lineIndex: line.line,
            tokenId: index,
            beginPosInToken: match.index ?? 0,
            endPosInToken: (match.index ?? 0) + match[0].length,
          }) satisfies JSONSearchResult,
      )
    }) ?? []
  )
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
