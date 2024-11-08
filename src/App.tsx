import { JSONFileLoader } from './components/Loader/JSONFileLoader/JSONFileLoader'

function App() {
  return (
    <main className="container">
      <JSONFileLoader onLoad={(json) => console.log(json)} />
    </main>
  )
}

export default App
