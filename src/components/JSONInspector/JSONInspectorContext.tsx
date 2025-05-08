import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useContext,
  useLayoutEffect,
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
  selectedMatchIndex: number
  setSelectedMatchIndex: Dispatch<SetStateAction<number>>
}

const jsonInspectorContext = createContext<JSONInspectorContextInterface>({
  json: undefined,
  lines: [],
  matches: [],
  matchesPerToken: {},
  setMatches: () => {},
  selectedMatchIndex: 0,
  setSelectedMatchIndex: () => {},
})

type Props = {
  json: any
}

export function JSONInspectorProvider({
  children,
  json,
}: PropsWithChildren<Props>) {
  const [matches, setMatches] = useState<JSONSearchResult[]>([])
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0)

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

  useLayoutEffect(() => {
    if (matches.length) {
      setSelectedMatchIndex(Math.min(selectedMatchIndex, matches.length - 1))
    } else {
      setSelectedMatchIndex(0)
    }
  }, [matches.length])

  return (
    <jsonInspectorContext.Provider
      value={{
        json,
        lines,
        matches,
        matchesPerToken,
        setMatches,
        selectedMatchIndex,
        setSelectedMatchIndex,
      }}
    >
      {children}
    </jsonInspectorContext.Provider>
  )
}

export const useJSONInspector = () => useContext(jsonInspectorContext)
