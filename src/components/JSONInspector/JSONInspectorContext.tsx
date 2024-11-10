import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { IndexedJSONLine } from './JSONRenderer/types'
import { renderJSONAsLines } from './JSONRenderer/logic/renderJSONAsLines'
import type { JSONSearchResult } from './types'

type JSONInspectorContextInterface = {
  json: any
  lines: IndexedJSONLine[]
  matches: JSONSearchResult[]
  matchesPerToken: Record<number, JSONSearchResult[]>
  setMatches: Dispatch<SetStateAction<JSONSearchResult[]>>
}

const jsonInspectorContext = createContext<JSONInspectorContextInterface>({
  json: undefined,
  lines: [],
  matches: [],
  matchesPerToken: {},
  setMatches: () => {},
})

type Props = {
  json: any
}

export function JSONInspectorProvider({
  children,
  json,
}: PropsWithChildren<Props>) {
  const [matches, setMatches] = useState<JSONSearchResult[]>([])

  const lines = useMemo(() => [...renderJSONAsLines(json)], [json])

  const matchesPerToken = useMemo(
    () =>
      matches.reduce(
        (acc, matchResult) => {
          acc[matchResult.tokenId] ??= []
          acc[matchResult.tokenId].push(matchResult)
          return acc
        },
        {} as Record<number, JSONSearchResult[]>,
      ),
    [matches],
  )

  return (
    <jsonInspectorContext.Provider
      value={{
        json,
        lines,
        matches,
        matchesPerToken,
        setMatches,
      }}
    >
      {children}
    </jsonInspectorContext.Provider>
  )
}

export const useJSONInspector = () => useContext(jsonInspectorContext)
