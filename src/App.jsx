import { useState, useEffect } from 'react'
import { Home } from './pages/home'
import { Settings } from './pages/settings'
import { SceneOne } from './pages/SceneOne'
import { GameOver } from './pages/GameOver'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [musicVolume, setMusicVolume] = useState(70)
  const [sfxVolume, setSfxVolume] = useState(80)
  const [useHorrorFont, setUseHorrorFont] = useState(true)
  
  // Game State
  const [savedProgress, setSavedProgress] = useState(null)
  const [deathCause, setDeathCause] = useState(null)
  const [sceneKey, setSceneKey] = useState(0) // Used to force remount on retry

  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('voidwalker_save')
    if (saved) {
      setSavedProgress(JSON.parse(saved))
    }
  }, [])

  const handleSave = (sceneId) => {
    const progress = { sceneId, timestamp: Date.now() }
    setSavedProgress(progress)
    localStorage.setItem('voidwalker_save', JSON.stringify(progress))
  }

  const handleDeath = (cause) => {
    setDeathCause(cause)
    setCurrentPage('gameOver')
  }

  const handleRetry = () => {
    setSceneKey(prev => prev + 1) // Force remount of scene
    setCurrentPage('sceneOne') // Hardcoded for now as we only have SceneOne
  }

  const handleDie = () => {
    localStorage.removeItem('voidwalker_save')
    setSavedProgress(null)
    setCurrentPage('home')
  }

  const handleContinue = () => {
    if (savedProgress && savedProgress.sceneId === 'sceneTwo') {
       // Placeholder for Scene Two if we had it
       // For now, if they completed Scene One, maybe we just replay Scene One or show "To be continued"?
       // The user requested: "start that scene from which user left"
       // Since we only have Scene One, let's assume they might be mid-scene? 
       // User requirement: "keep the scene number stored stored and start that scene from which user left"
       // Actually, saving usually happens at Checkpoints or Scene Start.
       // Let's assume Scene One completion saves "sceneTwo" status, but since Scene Two doesn't exist, we might handle it gracefully.
       // For now, let's just load SceneOne if saved is SceneOne, or if saved is SceneTwo, show alert?
       // Let's implement basics: Save 'sceneOne' when starting? Or Save 'sceneTwo' when finishing?
       // Logic: Unlocked Scene Two -> Continue starts Scene Two.
       // Logic: Unlocked Scene One -> Continue starts Scene One.
       // Let's assume "Continue" loads the LAST UNLOCKED scene.
       
       if (savedProgress.sceneId === 'sceneOne') {
           setCurrentPage('sceneOne')
       } else {
           alert("Future scenes under construction!")
       }
    } else {
        // Default fallback if save is weird
        setCurrentPage('sceneOne')
    }
  }


  return (
    <>
      {currentPage === 'home' && (
        <Home 
          onSettingsClick={() => setCurrentPage('settings')}
          onNewGameClick={() => {
              handleSave('sceneOne') // Save that we started Scene One
              setCurrentPage('sceneOne')
          }}
          onContinueClick={handleContinue}
          hasSave={!!savedProgress}
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

      {currentPage === 'sceneOne' && (
        <SceneOne 
          key={sceneKey} // Remount on retry
          useHorrorFont={useHorrorFont}
          onDeath={handleDeath}
          onComplete={() => {
              handleSave('sceneTwo') // In future, this would unlock Scene Two
              // For now, maybe return to home or credits?
              setCurrentPage('home') 
          }}
        />
      )}

      {currentPage === 'gameOver' && (
        <GameOver 
            cause={deathCause}
            onRetry={handleRetry}
            onDie={handleDie}
            useHorrorFont={useHorrorFont}
        />
      )}
    </>
  )
}

export default App
