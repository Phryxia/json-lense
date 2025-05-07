import cns from 'classnames/bind'
import styles from './JSONFileLoader.module.css'
import { type DragEvent, useRef, useState } from 'react'
import { JSONInspector } from '../JSONInspector'
import type { LoaderProps } from './types'
import { JSONSyntaxError } from './JSONSyntaxError'

const cx = cns.bind(styles)

export function JSONFileLoader({ onLoad }: LoaderProps) {
  const [json, setJson] = useState<any>()
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

      const parsedJson = JSON.parse(text)
      onLoad(parsedJson)
      setJson(parsedJson)
      setError(undefined)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
        setJson(undefined)
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

  return (
    <div
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
        <section>
          <hr />
          <JSONSyntaxError source={source} error={error} />
        </section>
      )}
      {json !== undefined && (
        <section>
          <JSONInspector json={json} height={200} />
        </section>
      )}
    </div>
  )
}
