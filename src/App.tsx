import { useState } from 'react'
import { JSONLoader } from './components/JSONLoader'
import { JSONInspector } from './components/JSONInspector'
import { JSONExplorer } from './components/JSONExplorer'
import { ReactorEditor } from './components/ReactorEditor'
import { useUpdateMonacoTsTypes } from './logic/useUpdateMonacoTsTypes'

function App() {
  const [json, setJson] = useState<any>()
  const [processedJson, setProcessedJson] = useState<any>()

  useUpdateMonacoTsTypes(json)

  return (
    <main className="container">
      <JSONLoader onLoad={setJson} />
      {json && <JSONInspector json={json} height={400} />}
      <ReactorEditor json={json} onSuccess={setProcessedJson} />
      {processedJson && <JSONExplorer json={{ global: processedJson }} />}
    </main>
  )
}

export default App
