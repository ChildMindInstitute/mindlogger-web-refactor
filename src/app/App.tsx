import { Suspense, useState } from "react"

import reactLogo from "../assets/react.svg"

import "./App.css"
import i18nManager from "./system/i18n"
import Layout from "./layout"
import { ReactQuery, Redux } from "./providers"

i18nManager.initialize()

function App() {
  const [count, setCount] = useState(0)

  return (
    <Suspense>
      <Redux>
        <ReactQuery>
          <Layout>
            <div className="App">
              <div>
                <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
                  <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank" rel="noreferrer">
                  <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
              </div>
              <h1>Vite + React</h1>
              <div className="card">
                <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
                <p>
                  Edit <code>src/App.tsx</code> and save to test HMR
                </p>
              </div>
              <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
            </div>
          </Layout>
        </ReactQuery>
      </Redux>
    </Suspense>
  )
}

export default App
