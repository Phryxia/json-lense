import cnx from 'classnames/bind'
import styles from './JSONRenderer.module.css'
import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import type { InlineContent } from '@src/model/Content'
import type { JSONSearchResult } from '../types'
import { JsonInspectorSuite } from '../atoms'

const cx = cnx.bind(styles)

type Props = {
  line: number
  inlineContent: InlineContent
}

export function RenderedToken({ inlineContent: { text }, line }: Props) {
  const matches = useAtomValue(JsonInspectorSuite.searchResults)
  const selectedMatch = useAtomValue(JsonInspectorSuite.selectedMatch)
  const currentMatch = useMemo(
    () => matches.find((match) => match.lineIndex === line),
    [matches, line],
  )
  const isCurrrentSelected =
    selectedMatch?.beginPosInToken === currentMatch?.beginPosInToken &&
    selectedMatch?.endPosInToken === currentMatch?.endPosInToken

  return (
    // todo: add token type or color to inline content to support various languages
    <span className={cx()}>
      {emphasize(text, currentMatch, isCurrrentSelected)}
    </span>
  )
}

function emphasize(
  content: string,
  match: JSONSearchResult | undefined,
  isCurrent: boolean,
) {
  if (!match) {
    return content
  }

  return (
    <>
      {content.slice(0, match.beginPosInToken)}
      <em className={cx({ current: isCurrent })}>
        {content.slice(match.beginPosInToken, match.endPosInToken)}
      </em>
      {content.slice(match.endPosInToken)}
    </>
  )
}
