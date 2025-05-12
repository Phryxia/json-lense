import cnx from 'classnames/bind'
import styles from '../JSONInspector.module.css'
import {
  type ChangeEvent,
  type KeyboardEvent,
  useLayoutEffect,
  useState,
} from 'react'
import { Link as LinkIcon } from 'iconoir-react/regular'
import { encodeToDeepLink } from '@src/logic/deeplink'
import { getModel } from '@src/logic/monaco/getEditor'
import { useOutsideClickHandler } from '@src/logic/useOutsideClickHandler'
import { useJSONInspector } from '../JSONInspectorContext'
import type { JSONSearchResult } from '../types'
import { extractResult, searchFromLine } from './logic'

const cx = cnx.bind(styles)

type Props = {}

export function JSONSearch({}: Props) {
  const {
    json,
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

    const matchedLines = lines.flatMap((line) => {
      const matchResults = searchFromLine({
        line,
        keyword,
        isMatchCase,
        isMatchWord,
        isRegexUsed,
      })

      if (!matchResults.length) return matchResults as []

      return matchResults
        .map(({ token, match }) => {
          const [beginPosInToken, endPosInToken] = extractResult(match)

          if (beginPosInToken === endPosInToken) return undefined!

          return {
            lineIndex: line.index,
            tokenId: token.id,
            beginPosInToken,
            endPosInToken,
          } satisfies JSONSearchResult
        })
        .filter(Boolean)
    })

    setMatches(matchedLines)
  }

  useLayoutEffect(handleSearchOptionChange, [
    lines,
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

  function handleSearchEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (matches.length && e.key === 'Enter') {
      handleMoveRightClick()
    }
  }

  const [isCopyPromptShown, setIsCopyPromptShown] = useState(false)

  function handleCopyLink(isCodeIncluded: boolean) {
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}?data=${encodeToDeepLink(
        {
          input: json,
          reactorCode: isCodeIncluded
            ? getModel('input')?.getValue()
            : undefined,
        },
      )}`,
    )
    setIsCopyPromptShown(false)
  }

  const copySelectorRefInitializer = useOutsideClickHandler<HTMLDivElement>(
    () => setIsCopyPromptShown(false),
  )

  return (
    <fieldset role="group" className={cx('search-bar')}>
      <input
        className={cx('search-input')}
        type="text"
        placeholder="Enter keyword here"
        onChange={(e) => setKeyword(e.target.value)}
        onKeyUp={handleSearchEnter}
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
          <div className={cx('search-option')}>
            <button
              className={cx('search-option-button')}
              onClick={handleMoveLeftClick}
              disabled={matches.length === 0}
            >
              ◀
            </button>
          </div>
          <div className={cx('search-option')}>
            <button
              className={cx('search-option-button')}
              onClick={handleMoveRightClick}
              disabled={matches.length === 0}
            >
              ▶
            </button>
          </div>
        </>
      )}
      <div className={cx('search-option')}>
        <button
          role="checkbox"
          className={cx('search-option-button')}
          data-tooltip="Match cases"
          aria-checked={isMatchCase}
          onClick={() => setIsMatchCase((flag) => !flag)}
        >
          Aa
        </button>
      </div>
      <div className={cx('search-option')}>
        <button
          role="checkbox"
          className={cx('search-option-button')}
          data-tooltip="Match whole word"
          aria-checked={isMatchWord}
          onClick={() => setIsMatchWord((flag) => !flag)}
        >
          ab
        </button>
      </div>
      <div className={cx('search-option')}>
        <button
          role="checkbox"
          className={cx('search-option-button')}
          data-tooltip="Use regular expression"
          aria-checked={isRegexUsed}
          onClick={() => setIsRegexUsed((flag) => !flag)}
        >
          (.)*
        </button>
      </div>

      <div className={cx('search-option')} ref={copySelectorRefInitializer}>
        <button
          className={cx('search-option-button', 'share')}
          data-tooltip="Copy share link"
          onClick={() =>
            setIsCopyPromptShown((isCopyPromptShown) => !isCopyPromptShown)
          }
        >
          <LinkIcon />
        </button>

        {isCopyPromptShown && (
          <div className={cx('copy-selector')}>
            <button
              className={cx('search-option-button')}
              onClick={() => handleCopyLink(false)}
            >
              JSON
              <br />
              Only
            </button>
            <button
              className={cx('search-option-button')}
              onClick={() => handleCopyLink(true)}
            >
              With
              <br />
              Code
            </button>
          </div>
        )}
      </div>
    </fieldset>
  )
}
