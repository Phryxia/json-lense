import { useState } from 'react'
import { JSONLoader } from './components/JSONLoader'
import { JSONInspector } from './components/JSONInspector'
import { JSONExplorer } from './components/JSONExplorer'
import { ReactorEditor } from './components/ReactorEditor'

function App() {
  const [json, setJson] = useState<any>()

  return (
    <main className="container">
      <JSONLoader onLoad={setJson} />
      {json && <JSONInspector json={json} height={400} />}
      <ReactorEditor />
      {json && <JSONExplorer json={json} />}
    </main>
  )
}

export default App
