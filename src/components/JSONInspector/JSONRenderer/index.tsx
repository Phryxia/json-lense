import cnx from 'classnames/bind'
import styles from './JSONRenderer.module.css'
import { ReactElement, useLayoutEffect } from 'react'
import { useAtomValue } from 'jotai'
import type { LineContent, NestedContent } from '@src/model/Content'
import { JsonInspectorSuite } from '../atoms'
import { useScopeFolding } from './logic/useScopeFolding'
import type { Scope } from './logic/types'
import { RenderedToken } from './RenderedToken'
import { useFakeScroll } from './useFakeScroll'

const cx = cnx.bind(styles)

interface Props {
  height: number
}

const BUFFER_PADDING = 5

export function JSONRenderer({ height }: Props) {
  const contents = useAtomValue(JsonInspectorSuite.contents)
  const lastLine = useAtomValue(JsonInspectorSuite.lastLine)

  const { lineHeight, measureRef, scrollRef, cursor, setCursor } =
    useFakeScroll<HTMLElement, HTMLPreElement>(lastLine)

  useLayoutEffect(() => {
    setCursor(0)
  }, [contents])

  const { openStates, toggleScope } = useScopeFolding(contents)

  const showingLineCount = height / (lineHeight || 1)
  const startLineIndex = Math.max(0, Math.floor(cursor) - BUFFER_PADDING)

  // Exclusive
  const endLineIndex = Math.min(
    Math.ceil(cursor) + showingLineCount + BUFFER_PADDING,
    lastLine + 1,
  )

  const renderedLines = contents
    .flatMap((content) =>
      renderExposedLineContents(
        content,
        openStates,
        toggleScope,
        startLineIndex,
        endLineIndex,
      ),
    )
    .flat()

  return (
    <pre
      className={cx('root')}
      style={{ height: `${height}px` }}
      ref={scrollRef}
    >
      {/* To measure line height without hardcoding */}
      <code className={cx('dummy')} ref={measureRef} aria-hidden>
        <RenderedToken line={-1} inlineContent={{ text: 'json!' }} />
      </code>

      {lineHeight ? (
        <div
          className={cx('inner-container')}
          style={{ height: `${(lastLine + 1) * lineHeight}px` }}
        >
          <code
            style={{
              transform: `translateY(${startLineIndex * lineHeight}px)`,
            }}
          >
            {renderedLines}
          </code>
        </div>
      ) : (
        <div aria-busy="true" />
      )}
    </pre>
  )
}

/**
 * @param content Which should be rendered
 * @param openStates Used for checking nestedContent is open or not. Note that this is not used for lineContent.
 * @returns Two depth array. First depth is for block, second depth is for line.
 */
function renderExposedLineContents(
  content: LineContent | NestedContent,
  openStates: Record<number, Scope>,
  onFold: (lineBegin: number) => void,
  startLineIndex: number,
  endLineIndex: number,
  isFirstLineInBlock = false,
): ReactElement[][] {
  if (content.type === 'line') {
    if (content.line < startLineIndex || content.line >= endLineIndex) {
      return []
    }
    return [
      [
        <LineContentRenderer key={content.line} lineContent={content} />,
        (isFirstLineInBlock &&
          createFoldingButton(content.line, onFold)) as ReactElement,
        // since every elements will be flattend, key must be unique
        <br key={content.line + 'br'} />,
      ].filter(Boolean),
    ]
  }

  // If it's closed, only show first and last line.
  // Last token of last line will be used to render closing parenthesis.
  if (!openStates[content.lineBegin]?.isOpen) {
    // should not fall back here but just in case
    if (!content.children?.length) {
      console.warn('No children found in closed content', content)
      return []
    }

    if (
      content.lineBegin < startLineIndex ||
      content.lineBegin >= endLineIndex
    ) {
      return []
    }

    return [
      [
        <LineContentRenderer
          key={content.lineBegin}
          lineContent={content.children?.[0]! as LineContent}
        />,
        createFoldingButton(content.lineBegin, onFold),
        <LineContentRenderer
          key={content.lineEnd}
          lineContent={content.children?.at(-1)! as LineContent}
        />,
        <br key={content.lineEnd + 'br'} />,
      ].filter(Boolean),
    ]
  }

  return (
    content.children
      ?.flatMap((childContent, index) =>
        renderExposedLineContents(
          childContent,
          openStates,
          onFold,
          startLineIndex,
          endLineIndex,
          index === 0,
        ),
      )
      .map((lineElement, index, elements) =>
        // opening and closing elements don't need indent
        0 < index && index < elements.length - 1
          ? [
              createIndent(`block:${content.lineBegin}-indent:${index}`),
              ...lineElement,
            ]
          : lineElement,
      ) ?? []
  )
}

function createIndent(key: string | number): ReactElement {
  return (
    <span key={key} className={cx('indent')}>
      {'  '}
    </span>
  )
}

function createFoldingButton(
  line: number,
  onFold: (lineBegin: number) => void,
): ReactElement {
  return (
    <button
      key={line + 'fold'}
      className={cx('more')}
      onClick={() => onFold(line)}
    >
      ...
    </button>
  )
}

type JSONRendereContentProps = {
  lineContent: LineContent
}

function LineContentRenderer({ lineContent }: JSONRendereContentProps) {
  return lineContent.children?.map((inlineContent, tokenIndex) => (
    <RenderedToken
      key={`${lineContent.line},${tokenIndex}`}
      line={lineContent.line}
      inlineContent={inlineContent}
    />
  ))
}
