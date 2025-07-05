import { type PropsWithChildren, useLayoutEffect } from 'react'
import { Provider, useSetAtom } from 'jotai'
import { JsonInspectorSuite } from './atoms'

type Props = {
  json: any
}

export function JSONInspectorProvider({
  children,
  json,
}: PropsWithChildren<Props>) {
  return (
    <Provider>
      <JsonInspectorInner json={json}>{children}</JsonInspectorInner>
    </Provider>
  )
}

function JsonInspectorInner({ json, children }: PropsWithChildren<Props>) {
  const setTarget = useSetAtom(JsonInspectorSuite.target)

  useLayoutEffect(() => {
    setTarget(json)
  }, [json])

  return children
}
