import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {RecoilRoot} from 'recoil'
import { SocketContextProvider } from './context/socket.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RecoilRoot>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <SocketContextProvider>
              <App />
            </SocketContextProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </RecoilRoot>
  </React.StrictMode>,
)
