import cnx from 'classnames/bind'
import styles from '../JSONInspector.module.css'
import { type ChangeEvent, useLayoutEffect, useState } from 'react'
import { useJSONInspector } from '../JSONInspectorContext'
import type { IndexedJSONLine } from '../JSONRenderer/types'
import type { JSONSearchResult } from '../types'

const cx = cnx.bind(styles)

type Props = {}

export function JSONSearch({}: Props) {
  const {
    lines,
    matches,
    setMatches,
    selectedMatchIndex,
    setSelectedMatchIndex,
  } = useJSONInspector()

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

        if (!matchResults.length) return matchResults as []

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

  function handleSelectedMatchIndexChange(e: ChangeEvent<HTMLInputElement>) {
    if (Number.isNaN(e.target.valueAsNumber)) return

    const value = e.target.valueAsNumber - 1

    if (value < 0 || value >= matches.length) return

    setSelectedMatchIndex(value)
  }

  function handleMoveLeftClick() {
    const newIndex = (selectedMatchIndex - 1 + matches.length) % matches.length
    setSelectedMatchIndex(newIndex)
  }

  function handleMoveRightClick() {
    const newIndex = (selectedMatchIndex + 1) % matches.length
    setSelectedMatchIndex(newIndex)
  }

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
              value={Math.min(selectedMatchIndex + 1, matches.length)}
              onChange={handleSelectedMatchIndexChange}
            />
            <span className={cx('search-count')}>/{matches.length}</span>
          </label>
          <button
            className={cx('search-option-button')}
            onClick={handleMoveLeftClick}
            disabled={matches.length === 0}
          >
            ◀
          </button>
          <button
            className={cx('search-option-button')}
            onClick={handleMoveRightClick}
            disabled={matches.length === 0}
          >
            ▶
          </button>
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
