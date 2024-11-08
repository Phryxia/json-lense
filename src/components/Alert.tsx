import { ReactElement } from 'react'

interface Props {
  isOpen?: boolean
  title?: string
  content?: string | ReactElement
  onClose?(): void
}

export function Alert({ isOpen, title, content, onClose }: Props) {
  return (
    <dialog open={isOpen} onClose={onClose}>
      <article>
        <header>{title && <h2>{title}</h2>}</header>
        <section>{content}</section>
        <footer>
          <button onClick={onClose}>Confirm</button>
        </footer>
      </article>
    </dialog>
  )
}
