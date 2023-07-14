import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import App from "./App"
import "./index.css"
import store from "./store"

const root = document.getElementById("root")

if (!root) throw new Error("Root element not found")

const reactRoot = createRoot(root)

reactRoot.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
