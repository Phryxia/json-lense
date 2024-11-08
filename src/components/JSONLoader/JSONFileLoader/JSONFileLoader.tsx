import cns from 'classnames/bind'
import styles from './JSONFileLoader.module.css'
import { type DragEvent, useRef, useState } from 'react'
import type { LoaderProps } from '../types'
import { Alert } from '../../Alert'
import { JSONSyntaxError } from './JSONSyntaxError'

const cx = cns.bind(styles)

export function JSONFileLoader({ onLoad }: LoaderProps) {
  const [file, setFile] = useState<File>()
  const [source, setSource] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<Error>()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileLoad(file: File) {
    setFile(file)
    try {
      const text = await file.text()

      if (!text) {
        setSource('')
        onLoad(undefined)
        setError(undefined)
        return
      }

      setSource(text)
      onLoad(JSON.parse(text))
      setError(undefined)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFileLoad?.(droppedFiles[0])
  }

  function handleAlertClose() {
    setFile(undefined)
    setError(undefined)
    setSource('')

    // flush input's inner state
    if (inputRef.current) {
      inputRef.current.files = null
      inputRef.current.value = ''
    }
  }

  return (
    <article
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className={cx('empty-state', isDragging && 'dragging')}>
        <p>
          {file ? `Currently loaded: ${file.name}` : 'No files uploaded yet'}
        </p>
        <small>Click or drag and drop the JSON file here to load</small>
        <input
          className={cx('file-input')}
          type="file"
          accept=".json,.jsonc"
          multiple={false}
          onChange={async (e) => {
            const file = e.target.files?.[0]

            if (file) {
              handleFileLoad(file)
            }
          }}
          ref={inputRef}
        />
      </label>
      {error && (
        <Alert
          isOpen
          onClose={handleAlertClose}
          title={error.name}
          content={<JSONSyntaxError source={source} error={error} />}
        />
      )}
    </article>
  )
}
