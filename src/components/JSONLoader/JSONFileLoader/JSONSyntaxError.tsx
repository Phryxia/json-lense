import cn from 'classnames'
import cns from 'classnames/bind'
import styles from './JSONFileLoader.module.css'
import { useMemo } from 'react'

const cx = cns.bind(styles)

interface Props {
  source: string
  error: SyntaxError
}

export function JSONSyntaxError({ source, error }: Props) {
  const match = useMemo(() => {
    const match = parseError(error)

    if (!match) {
      return undefined
    }

    const lines = source.split('\n')

    let { pos = 0, line = 1, col = 1 } = match
    line -= 1
    col -= 1

    return {
      lines: [
        ...lines.slice(Math.max(0, line - 2), line + 1),
        ' '.repeat(col - 1) + '^',
        ...lines.slice(line + 1, Math.min(line + 2, lines.length - 1)),
      ],
      pos,
      col,
    }
  }, [source, error])

  return (
    <>
      <p>{error.message}</p>
      {match && (
        <pre className={cn('container', cx('syntax-error'))}>
          <code>{match.lines.join('\n')}</code>
        </pre>
      )}
    </>
  )
}

const UnexpectedToken = /(?:Unexpected token)/
const PositionKnownedError = /(?:position (\d+).*line (\d+).*column (\d+))/

function parseError(error: SyntaxError) {
  let match = UnexpectedToken.exec(error.message)

  if (match) {
    return undefined
  }

  const [, pos, line, col] = PositionKnownedError.exec(error.message) ?? []

  return {
    pos: pos ? Number.parseInt(pos) : undefined,
    line: line ? Number.parseInt(line) : undefined,
    col: col ? Number.parseInt(col) : undefined,
  }
}
