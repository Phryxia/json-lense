import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string'
import { Serializable } from '@src/model/serializable'

export interface DeepLinkPayload {
  input: Serializable
  reactorCode: string
}

export function encodeToDeepLink(payload: DeepLinkPayload) {
  return compressToEncodedURIComponent(JSON.stringify(payload))
}

export function decodeFromDeepLink(encoded: string) {
  return JSON.parse(
    decompressFromEncodedURIComponent(encoded),
  ) as DeepLinkPayload
}
