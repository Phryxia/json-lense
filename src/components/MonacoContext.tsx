import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type * as monaco from 'monaco-editor'

export type MonacoEditor = monaco.editor.IStandaloneCodeEditor
export type MonacoRecords = Partial<Record<string, MonacoEditor>>

const MonacoContext =
  // @ts-ignore
  createContext<[MonacoRecords, Dispatch<SetStateAction<MonacoRecords>>]>()

export function MonacoProvider({ children }: PropsWithChildren<{}>) {
  const suites = useState<MonacoRecords>({})

  return (
    <MonacoContext.Provider value={suites}>{children}</MonacoContext.Provider>
  )
}

export function useMonaco(name: string) {
  const [records, setRecords] = useContext(MonacoContext)

  const setRecord = useCallback(
    (editor: SetStateAction<MonacoEditor | undefined>) => {
      setRecords((records) => ({
        ...records,
        [name]: typeof editor === 'function' ? editor(records[name]) : editor,
      }))
    },
    [name, setRecords],
  )

  return useMemo(
    () => [records[name], setRecord] as const,
    [name, records, setRecord],
  )
}
