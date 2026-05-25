import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GameProvider } from './context/GameContext.jsx'
import { applyMotionEffectsPref, getGameState } from './utils/storage.js'
import './styles/global.css'

applyMotionEffectsPref(getGameState().motionEffectsEnabled)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
)
