import cnx from 'classnames/bind'
import styles from './JSONRenderer.module.css'
import type { JSONDefinedToken } from './types'
import { useJSONInspector } from '../JSONInspectorContext'
import { JSONSearchResult } from '../types'

const cx = cnx.bind(styles)

type Props = {
  token: JSONDefinedToken
}

export function RenderedToken({ token: { type, content, id } }: Props) {
  const { matchesPerToken, matches, selectedMatchIndex } = useJSONInspector()

  const matchResults = matchesPerToken[id] as JSONSearchResult[] | undefined
  const firstMatch = matchResults?.[0]

  return (
    <span className={cx(type.toLowerCase())}>
      {emphasize(
        content,
        firstMatch,
        firstMatch === matches[selectedMatchIndex],
      )}
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
