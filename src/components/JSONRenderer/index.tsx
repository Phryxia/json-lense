import cnx from 'classnames/bind'
import styles from './JSONRenderer.module.css'
import { Fragment, useLayoutEffect, useMemo } from 'react'
import type { IndexedJSONLine, JSONToken } from './types'
import { JSONTokenType } from './consts'
import { renderJSONAsLines } from './logic/renderJSONAsLines'
import { RenderedToken } from './RenderedToken'
import { useFakeScroll } from './useFakeScroll'
import { useScopeFolding } from './logic/useScopeFolding'
import { OpenState } from './logic/consts'

const cx = cnx.bind(styles)

interface Props {
  json: any
  height: number
}

const BUFFER_PADDING = 5

export function JSONRenderer({ json, height }: Props) {
  const { lineHeight, measureRef, scrollRef, cursor, setCursor } =
    useFakeScroll<HTMLElement, HTMLPreElement>()

  useLayoutEffect(() => {
    setCursor(0)
  }, [json])

  const lines = useMemo(() => [...renderJSONAsLines(json)], [json])
  const { openStates, toggleScope } = useScopeFolding(lines)
  const openLines = useMemo(
    () => lines.filter(({ index }) => openStates[index] !== OpenState.Closed),
    [lines, openStates],
  )

  const showingLineCount = height / (lineHeight || 1)
  const startLineIndex = Math.max(0, Math.floor(cursor) - BUFFER_PADDING)
  const endLineIndex = Math.min(
    Math.ceil(cursor) + showingLineCount + BUFFER_PADDING,
    openLines.length,
  )

  const exposedLines = useMemo(
    () => openLines.slice(startLineIndex, endLineIndex),
    [openLines, startLineIndex, endLineIndex, openStates],
  )

  return (
    <pre
      className={cx('root')}
      style={{ height: `${height}px` }}
      ref={scrollRef}
    >
      {/* To measure line height without hardcoding */}
      <code className={cx('dummy')} ref={measureRef} aria-hidden>
        <RenderedToken
          token={{ type: JSONTokenType.String, content: 'json!', id: -1 }}
        />
      </code>

      {lineHeight ? (
        <JSONRendererContent
          lineHeight={lineHeight}
          lines={exposedLines}
          startLineIndex={startLineIndex}
          totalLineCount={openLines.length}
          openStates={openStates}
          onToggle={toggleScope}
        />
      ) : (
        <div aria-busy="true" />
      )}
    </pre>
  )
}

type JSONRendereContentProps = {
  lineHeight: number
  lines: IndexedJSONLine[]
  startLineIndex: number
  totalLineCount: number
  openStates: OpenState[]
  onToggle(begin: number, end: number): void
}

function JSONRendererContent({
  lineHeight,
  lines,
  startLineIndex,
  totalLineCount,
  openStates,
  onToggle,
}: JSONRendereContentProps) {
  return (
    <div
      className={cx('inner-container')}
      style={{ height: `${totalLineCount * lineHeight}px` }}
    >
      <code
        style={{
          transform: `translateY(${startLineIndex * lineHeight}px)`,
        }}
      >
        {lines.map((line) => (
          <Fragment key={line.index}>
            {line.tokens.map((token, tokenIndex) => (
              <RenderedToken
                token={token}
                key={`${line.index},${tokenIndex}`}
              />
            ))}
            {line.scopeEndIndex != null && (
              <>
                <button
                  className={cx('more')}
                  onClick={() => onToggle(line.index, line.scopeEndIndex!)}
                >
                  ...
                </button>
                {openStates[line.index] === OpenState.BeginClosed &&
                  renderEaryCloseParenthesis(line.tokens.at(-1)!)}
              </>
            )}
            <br />
          </Fragment>
        ))}
      </code>
    </div>
  )
}

function renderEaryCloseParenthesis(lastTokenInLine: JSONToken) {
  if (getIsParenthesis(lastTokenInLine)) {
    return (
      <RenderedToken
        token={{
          type: JSONTokenType.Parenthesis,
          content: lastTokenInLine.content === '{' ? '}' : ']',
          id: -lastTokenInLine.id - 2, // -1 is reserved for measurment
        }}
      />
    )
  }
  return null
}

function getIsParenthesis(
  token: JSONToken,
): token is JSONToken & { type: JSONTokenType.Parenthesis } {
  return token.type === JSONTokenType.Parenthesis
}
