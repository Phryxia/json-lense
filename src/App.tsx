import { useState } from 'react'
import { JSONLoader } from './components/JSONLoader'
import { JSONInspector } from './components/JSONInspector'

function App() {
  const [json, setJson] = useState<any>()

  return (
    <main className="container">
      <JSONLoader onLoad={setJson} />
      {json && <JSONInspector json={json} height={400} />}
    </main>
  )
}

export default App
