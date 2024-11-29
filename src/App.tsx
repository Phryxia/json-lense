import { useState } from 'react'
import { JSONLoader } from './components/JSONLoader'
import { ReactorEditor } from './components/Reactor/ReactorEditor'
import { JSONInspector } from './components/JSONInspector'
import { ReactorModelProvider } from './components/Reactor/model/ReactorModelContext'

function App() {
  const [json, setJson] = useState<any>()

  return (
    <ReactorModelProvider>
      <main className="container">
        <JSONLoader onLoad={setJson} />
        <ReactorEditor />
        {json && <JSONInspector json={json} height={400} />}
      </main>
    </ReactorModelProvider>
  )
}

export default App
