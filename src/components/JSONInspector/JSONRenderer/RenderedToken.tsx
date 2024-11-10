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
  const { matchesPerToken } = useJSONInspector()

  const matchResults = matchesPerToken[id] as JSONSearchResult[] | undefined

  return (
    <span className={cx(type.toLowerCase())}>
      {emphasize(content, matchResults?.[0])}
    </span>
  )
}

function emphasize(content: string, match: JSONSearchResult | undefined) {
  if (!match) {
    return content
  }

  return (
    <>
      {content.slice(0, match.beginPosInToken)}
      <em>{content.slice(match.beginPosInToken, match.endPosInToken)}</em>
      {content.slice(match.endPosInToken)}
    </>
  )
}
