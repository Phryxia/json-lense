import { useState } from 'react'
import { JSONLoader } from './components/JSONLoader'
import { JSONRenderer } from './components/JSONRenderer'

function App() {
  const [json, setJson] = useState<any>()

  return (
    <main className="container">
      <JSONLoader onLoad={setJson} />
      {json && <JSONRenderer json={json} height={400} />}
    </main>
  )
}

export default App
