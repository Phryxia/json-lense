import cnx from 'classnames/bind'
import styles from './JSONRenderer.module.css'
import { Fragment, useLayoutEffect, useMemo } from 'react'
import type { IndexedJSONLine } from './types'
import { JSONTokenType } from './consts'
import { renderJSONAsLines } from './logic'
import { RenderedToken } from './RenderedToken'
import { useFakeScroll } from './useFakeScroll'

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
  const showingLineCount = height / (lineHeight || 1)
  const startLineIndex = Math.max(0, Math.floor(cursor) - BUFFER_PADDING)
  const endLineIndex = Math.min(
    Math.ceil(cursor) + showingLineCount + BUFFER_PADDING,
    lines.length,
  )
  const exposedLines = useMemo(
    () => lines.slice(startLineIndex, endLineIndex),
    [lines, startLineIndex, endLineIndex],
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
          totalLineCount={lines.length}
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
}

function JSONRendererContent({
  lineHeight,
  lines,
  startLineIndex,
  totalLineCount,
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
            <br />
          </Fragment>
        ))}
      </code>
    </div>
  )
}
