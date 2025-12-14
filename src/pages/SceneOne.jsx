import { useState, useEffect } from 'react'
import { BattleSystem } from '../components/BattleSystem'
import { getDialogues } from '../data/sceneOneDialogues'
import './SceneOne.css'

export function SceneOne({ useHorrorFont, onDeath, onComplete }) {
    const [isClearing, setIsClearing] = useState(false)
    const [step, setStep] = useState(0)
    const [showGhost, setShowGhost] = useState(false)
    const [branch, setBranch] = useState(null)
    const [health, setHealth] = useState(100)
    const [flash, setFlash] = useState(false)
    const [battlePhase, setBattlePhase] = useState(null) 

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClearing(true)
            setTimeout(() => { setShowGhost(true) }, 3000)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    // Death Check
    useEffect(() => {
        if (health <= 0) {
            if (onDeath) onDeath("Consumed by the Void")
        }
    }, [health, onDeath])

    const triggerDamage = (amount) => {
        setHealth(prev => Math.max(0, prev - amount))
        setFlash(true)
        setTimeout(() => setFlash(false), 500)
    }

    const handleStep = (e) => {
        // Prevent interaction during choice steps
        if (step === 3 || step === 15) return

        if (battlePhase) return 

        const maxSteps = (branch === 'yes' || branch === 'no') ? 15 : 3 
        
        // Trigger Tutorial at Step 9 (Index 9 = "CLICK the ghost...")
        if (step === 9) {
            setStep(prev => prev + 1) 
        }

        if (step < maxSteps) {
            setStep(prev => prev + 1)
        } else {
            // Scene Complete
             if (onComplete) onComplete()
        }
    }
    
    // Watch for step changes to trigger side effects like Battle Start
    useEffect(() => {
        if (step === 9) {
            setBattlePhase('tutorial_1')
        }
    }, [step])


    const handleBack = (e) => {
        e.preventDefault()
        if (step > 0 && !battlePhase) {
            setStep(prev => prev - 1)
            if (step === 4) setBranch(null)
        }
    }

    const handleTouch = (e) => {
        if (e.touches.length === 2) {
            handleBack(e)
            return
        }
        handleStep()
    }

    const handleChoice = (selectedBranch) => {
        if (battlePhase === 'reveal') {
            console.log("ESCAPING!") 
            if (onComplete) onComplete()
            return
        }
        setBranch(selectedBranch)
        setStep(prev => prev + 1)
    }

    const getGhostSprite = () => {
        if (battlePhase === 'reveal') return "/g1-e.png"
        if (step === 0) return "/g1-n.png"
        if (branch === 'no' && step >= 7) return "/g1-sm.png" 
        if (step >= 8) return "/g1-sm.png"
        if (step >= 5) return "/g1-h.png" 
        return "/g1-s.png"
    }

    const getHeroSprite = () => {
        if (branch === 'yes') {
            if (step >= 6) return "/h1-c3.png" 
            if (step >= 4) return "/h1-c2.png" 
        }
        if (branch === 'no') {
            if (step >= 6) return "/h1-c3.png" 
            if (step >= 4) return "/h1-c2.png"
        }
        return "/h1-c.png"
    }

    const currentDialogues = getDialogues(branch)
    let currentLine = currentDialogues[step]
    
    // Override Phase Dialogues
    if (battlePhase === 'tutorial_pass') currentLine = currentDialogues[10] 
    if (battlePhase === 'betrayal_dialogue') currentLine = currentDialogues[11]
    if (battlePhase === 'betrayal_heal') currentLine = currentDialogues[12]

    return (
        <div 
            id='scene-one' 
            className={`${useHorrorFont ? 'horror-font' : 'default-font'} ${isClearing ? 'fog-initial-clear' : ''}`}
            onClick={(e) => handleStep()}
            onContextMenu={handleBack}
            onTouchStart={handleTouch}
        >
            {flash && <div className="red-flash"></div>}

            {(battlePhase || step > 8) && (
                <div className="health-container">
                    <div className="health-bar" style={{ width: `${health}%` }}></div>
                    <span className="health-text">{health}%</span>
                </div>
            )}

            <div className='fog-layer fog-layer-1'></div>
            <div className='fog-layer fog-layer-2'></div>
            <div className='fog-layer fog-layer-3'></div>

            <div className="characters-container">
                {showGhost && !battlePhase && (
                    <img 
                        src={getGhostSprite()} 
                        alt="Ghost" 
                        className={`character ghost ${step === 0 ? 'ghost-enter-zigzag center' : 'ghost-move-right right'}`} 
                    />
                )}
                
                {step >= 1 && !battlePhase && step < 9 && ( 
                    <img 
                        src={getHeroSprite()} 
                        alt="Hero" 
                        className="character hero left fade-in" 
                    />
                )}

                {battlePhase === 'reveal' && (
                    <img src="/g1-e.png" className="character ghost evil-large center fade-in" alt="Evil Ghost" />
                )}
            </div>


            {battlePhase === 'tutorial_1' && (
                <BattleSystem 
                    type="ghost-a1" 
                    onWin={() => {
                        if (health < 100) {
                            setBattlePhase('betrayal_dialogue')
                        } else {
                            setBattlePhase('tutorial_pass')
                        }
                    }}
                    onLose={() => {
                        setBattlePhase('betrayal_dialogue')
                    }}
                    onDamage={triggerDamage}
                />
            )}

            {battlePhase === 'tutorial_2' && (
                 <BattleSystem 
                    type="ghost-a2" 
                    duration={500} 
                    onWin={() => setBattlePhase('betrayal_dialogue')}
                    onLose={() => {
                        setBattlePhase('betrayal_dialogue') 
                    }}
                    onDamage={triggerDamage}
                />
            )}

            {battlePhase === 'betrayal_heal' && (
                <div className="battle-ghost-container" onClick={(e) => {
                    e.stopPropagation()
                    setHealth(1)
                    triggerDamage(0) 
                    setBattlePhase('reveal') 
                    setStep(13) // Jump to "You dumb fool"
                }}>
                    <img src="/g1-sm.png" className="battle-ghost-img" alt="Healer?" />
                    <div className="timer-bar-bg">
                        <div className="timer-bar-fill" style={{ width: '100%' }}></div> 
                    </div>
                </div>
            )}

            {step !== 3 && showGhost && currentLine && (
                <div className="dialogue-box" onClick={(e) => {
                    e.stopPropagation()
                    if (battlePhase === 'tutorial_pass') {
                        setBattlePhase('tutorial_2')
                    } else if (battlePhase === 'betrayal_dialogue') {
                        setBattlePhase('betrayal_heal')
                    } else if (battlePhase === 'reveal') {
                         if (step < 15) setStep(prev => prev + 1)
                    } else {
                        handleStep()
                    }
                }}>
                    <div className="name-box">{currentLine.character}</div>
                    <div className="text-box">{currentLine.text}</div>
                    <div className="click-indicator">▼</div>
                </div>
            )}

            {(step === 3 || step === 15) && (
                <div className="choice-overlay">
                    <div className="choice-container">
                        <h2 className="choice-title">{step === 15 ? "Evil Ghost wanna kill you" : 'Friendly faced Ghost: "Are you Lost?"'}</h2>
                        {step === 3 ? (
                            <>
                                <button className="choice-btn" onClick={(e) => { e.stopPropagation(); handleChoice('yes'); }}>1. Yes...</button>
                                <button className="choice-btn" onClick={(e) => { e.stopPropagation(); handleChoice('no'); }}>2. No...</button>
                            </>
                        ) : (
                            <button className="choice-btn" onClick={(e) => { e.stopPropagation(); console.log('ESCAPE!!'); }}>Run!! ESCAPE!!</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
