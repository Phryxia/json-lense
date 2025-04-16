import { useRef } from 'react'
import { isJsWorkerMessage } from './utils'
import type { JsWorkerProtocol } from './types'

class JsWorker {
  private worker?: Worker
  private eventListeners: Set<(result: any) => void> = new Set()

  constructor() {}

  setScript(js: string) {
    this.worker?.terminate()

    const blob = new Blob([js], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    worker.addEventListener('message', (event) => {
      const data = event.data

      if (!isJsWorkerMessage(data)) return

      for (const handler of this.eventListeners) {
        handler(data)
      }
    })
    this.worker = worker
    return worker
  }

  terminate() {
    this.worker?.terminate()
    this.worker = undefined
  }

  addEventListener(handler: (result: JsWorkerProtocol) => void) {
    this.eventListeners.add(handler)
  }

  removeEventListener(handler: (result: JsWorkerProtocol) => void) {
    this.eventListeners.delete(handler)
  }
}

export function useJsWorker() {
  const ref = useRef(new JsWorker())
  return ref.current
}
