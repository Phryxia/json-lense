import { JsWorkerMessageType } from './consts'
import type { JsWorkerProtocol } from './types'

export function isJsWorkerMessage(data: any): data is JsWorkerProtocol {
  return (
    data?.type === JsWorkerMessageType.TransformResult ||
    data?.type === JsWorkerMessageType.TransformError
  )
}
