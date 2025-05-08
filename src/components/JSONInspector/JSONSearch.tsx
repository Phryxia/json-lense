import cnx from 'classnames/bind'
import styles from './JSONInspector.module.css'
import { useLayoutEffect, useState } from 'react'
import { useJSONInspector } from './JSONInspectorContext'
import type { IndexedJSONLine } from './JSONRenderer/types'
import type { JSONSearchResult } from './types'

const cx = cnx.bind(styles)

type Props = {}

export function JSONSearch({}: Props) {
  const { lines, matches, setMatches } = useJSONInspector()

  const [keyword, setKeyword] = useState('')
  const [isMatchCase, setIsMatchCase] = useState(false)
  const [isMatchWord, setIsMatchWord] = useState(false)
  const [isRegexUsed, setIsRegexUsed] = useState(false)

  function handleSearchOptionChange() {
    if (!keyword) {
      setMatches([])
      return
    }

    const matchedLines = lines
      .flatMap((line) => {
        const matchResults = searchFromLine({
          line,
          keyword,
          isMatchCase,
          isMatchWord,
          isRegexUsed,
        })

        if (!matchResults.length) return []

        return matchResults.flatMap(({ token, match }) =>
          extractResult(match).map(
            ([beginPosInToken, endPosInToken]) =>
              ({
                lineIndex: line.index,
                tokenId: token.id,
                beginPosInToken,
                endPosInToken,
              }) satisfies JSONSearchResult,
          ),
        )
      })
      .filter(Boolean) as JSONSearchResult[]

    setMatches(matchedLines)
  }

  useLayoutEffect(handleSearchOptionChange, [
    keyword,
    isMatchCase,
    isMatchWord,
    isRegexUsed,
  ])

  return (
    <fieldset role="group" className={cx('search-bar')}>
      <input
        type="text"
        placeholder="Enter keyword here"
        onChange={(e) => setKeyword(e.target.value)}
      />
      {keyword && (
        <>
          <label className={cx('search-nav')}>
            <input
              className={cx('index')}
              type="number"
              min="1"
              max={matches.length}
              value={0}
            />
            <span className={cx('search-count')}>/{matches.length}</span>
          </label>
          <button className={cx('search-option-button')}>◀</button>
          <button className={cx('search-option-button')}>▶</button>
        </>
      )}
      <button
        role="checkbox"
        className={cx('search-option-button')}
        data-tooltip="Match cases"
        aria-checked={isMatchCase}
        onClick={() => setIsMatchCase((flag) => !flag)}
      >
        Aa
      </button>
      <button
        role="checkbox"
        className={cx('search-option-button')}
        data-tooltip="Match whole word"
        aria-checked={isMatchWord}
        onClick={() => setIsMatchWord((flag) => !flag)}
      >
        ab
      </button>
      <button
        role="checkbox"
        className={cx('search-option-button')}
        data-tooltip="Use regular expression"
        aria-checked={isRegexUsed}
        onClick={() => setIsRegexUsed((flag) => !flag)}
      >
        (.)*
      </button>
    </fieldset>
  )
}

type SearchFromLineParams = {
  line: IndexedJSONLine
  keyword: string
  isMatchCase: boolean
  isMatchWord: boolean
  isRegexUsed: boolean
}

function searchFromLine({
  line,
  keyword,
  isMatchCase,
  isMatchWord,
  isRegexUsed,
}: SearchFromLineParams) {
  return line.tokens
    .map((token) => {
      const target = token.content
      const escapedKeyword = isRegexUsed
        ? keyword
        : keyword.replaceAll(/([.?!()\[\]*])/g, '\\$1')

      const regexp = new RegExp(
        isMatchWord ? `(?<!\\w)${escapedKeyword}(?!\\w)` : escapedKeyword,
        !isMatchCase ? 'i' : undefined,
      )
      return {
        token,
        match: regexp.exec(target)!,
      }
    })
    .filter(({ match }) => match)
}

function extractResult(match: RegExpExecArray) {
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
