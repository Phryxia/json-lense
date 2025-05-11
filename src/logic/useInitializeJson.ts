import { useLayoutEffect, useMemo, useState } from 'react'
import { decodeFromDeepLink } from './deeplink'
import { getModel } from './monaco/getEditor'

/**
 * This will load the JSON data from the query string
 * if there is valid JSON query string
 */
export function useInitializeFromQueryString() {
  const dataFromQuery = useMemo(decodeDataFromQueryString, [])

  const [json, setJson] = useState<any>()

  useLayoutEffect(() => {
    if (!dataFromQuery) return

    setJson(dataFromQuery.input)
  }, [dataFromQuery])

  const inputModel = getModel('input')

  useLayoutEffect(() => {
    if (!dataFromQuery?.reactorCode || !inputModel) return

    inputModel.setValue(dataFromQuery.reactorCode)
  }, [dataFromQuery, inputModel])

  return [json, setJson]
}

function decodeDataFromQueryString() {
  try {
    const query = new URLSearchParams(window.location.search)
    const compressedData = query.get('data')

    if (!compressedData) {
      return undefined
    }

    return decodeFromDeepLink(compressedData)
  } catch {
    return undefined
  }
}
