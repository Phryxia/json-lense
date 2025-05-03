import cn from 'classnames'
import cnx from 'classnames/bind'
import styles from './Header.module.css'
import now from '~build/time'

const cx = cnx.bind(styles)

export function Header() {
  return (
    <header className={cn('container', cx('header'))}>
      <article>
        <h1>JSON Lense</h1>
        <h2>
          <span>ver {getVersionFromDate(now)}</span>
          <img src="https://img.shields.io/badge/License-GNU%20GPL-blue" />
          <a
            className={cx('github')}
            href="https://github.com/Phryxia/json-lense"
            aria-label="JSON Lense Github Repository"
          >
            <img
              src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
              alt="none"
            />
          </a>
        </h2>
      </article>
    </header>
  )
}

function getVersionFromDate(date: Date) {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
