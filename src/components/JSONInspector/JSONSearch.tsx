import cnx from 'classnames/bind'
import styles from './JSONInspector.module.css'
import { ChangeEvent, useState } from 'react'
import { useJSONInspector } from './JSONInspectorContext'
import { JSONSearchResult } from './types'

const cx = cnx.bind(styles)

type Props = {}

export function JSONSearch({}: Props) {
  const { lines, setMatches } = useJSONInspector()

  const [isMatchCase, setIsMatchCase] = useState(false)
  const [isMatchWord, setIsMatchWord] = useState(false)
  const [isRegexUsed, setIsRegexUsed] = useState(false)

  function handleKeywordChange(e: ChangeEvent<HTMLInputElement>) {
    const keyword = isMatchCase ? e.target.value : e.target.value.toLowerCase()

    if (!keyword) {
      setMatches([])
      return
    }

    const matchedLines = lines
      .flatMap((line) => {
        const matchResults = line.tokens
          .map((token) => {
            const target = isMatchCase
              ? token.content
              : token.content.toLowerCase()

            if (isRegexUsed) {
              const regexp = new RegExp(
                keyword + (isMatchWord ? '(?!\\w)' : ''),
              )
              return {
                token,
                match: regexp.exec(target)!,
              }
            }

            const escapedKeyword = keyword.replaceAll(/([.?!()\[\]*])/g, '\\$1')
            const regexp = new RegExp(
              escapedKeyword + (isMatchWord ? '(?!\\w)' : ''),
            )
            return {
              token,
              match: regexp.exec(target)!,
            }
          })
          .filter(({ match }) => match)

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

  return (
    <fieldset role="group" className={cx('search-bar')}>
      <input
        type="text"
        placeholder="Enter keyword here"
        onChange={handleKeywordChange}
      />
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
