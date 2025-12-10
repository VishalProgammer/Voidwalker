import { useState } from 'react'
import { Home } from './pages/home'
import { Settings } from './pages/settings'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [musicVolume, setMusicVolume] = useState(70)
  const [sfxVolume, setSfxVolume] = useState(80)
  const [useHorrorFont, setUseHorrorFont] = useState(true)

  return (
    <>
      {currentPage === 'home' && (
        <Home 
          onSettingsClick={() => setCurrentPage('settings')}
          useHorrorFont={useHorrorFont}
        />
      )}
      {currentPage === 'settings' && (
        <Settings 
          onBack={() => setCurrentPage('home')}
          musicVolume={musicVolume}
          setMusicVolume={setMusicVolume}
          sfxVolume={sfxVolume}
          setSfxVolume={setSfxVolume}
          useHorrorFont={useHorrorFont}
          setUseHorrorFont={setUseHorrorFont}
        />
      )}
    </>
  )
}

export default App
