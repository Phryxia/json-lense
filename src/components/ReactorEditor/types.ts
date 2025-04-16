import type { JsWorkerMessageType } from './consts'

export type JsWorkerProtocol = JsWorkerSuccess | JsWorkerFail

export interface JsWorkerSuccess {
  type: JsWorkerMessageType.TransformResult
  result: any
  error?: undefined
}

export interface JsWorkerFail {
  type: JsWorkerMessageType.TransformError
  result?: undefined
  error: any
}
