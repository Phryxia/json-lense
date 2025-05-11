import { useState } from 'react'
import { Header } from './components/Header'
import { JSONLoader } from './components/JSONLoader'
import { JSONInspector } from './components/JSONInspector'
import { JSONExplorer } from './components/JSONExplorer'
import { ReactorEditor } from './components/ReactorEditor'
import { useInitializeFromQueryString } from './logic/useInitializeJson'

function App() {
  const [json, setJson] = useInitializeFromQueryString()
  const [processedJson, setProcessedJson] = useState<any>()

  return (
    <>
      <Header />
      <main className="container">
        <JSONLoader onLoad={setJson} />
        {json && <JSONInspector json={json} height={400} />}
        <ReactorEditor name="input" json={json} onSuccess={setProcessedJson} />
        {processedJson && <JSONExplorer json={processedJson} />}
      </main>
    </>
  )
}

export default App
