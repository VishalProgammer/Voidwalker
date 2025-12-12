import { useState, useEffect } from 'react'
import './SceneOne.css'

export function SceneOne({ useHorrorFont }) {
    const [isClearing, setIsClearing] = useState(false)
    const [step, setStep] = useState(0)

    const [showGhost, setShowGhost] = useState(false)
    const [branch, setBranch] = useState(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClearing(true)
            // Start ghost entrance after fog starts clearing (3s fade + small buffer)
            setTimeout(() => {
                setShowGhost(true)
            }, 3000)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    const handleStep = (e) => {
        // Only advance if not at choice menu (step 3)
        // Adjust max steps based on branch
        const maxSteps = branch === 'yes' ? 6 : 3
        if (step < maxSteps) {
            setStep(prev => prev + 1)
        }
    }

    const handleBack = (e) => {
        e.preventDefault() // Prevent context menu
        if (step > 0) {
            setStep(prev => prev - 1)
            // Reset branch if going back to choice
            if (step === 4) setBranch(null)
        }
    }

    const handleTouch = (e) => {
        // Check for 2-finger tap
        if (e.touches.length === 2) {
            handleBack(e)
            return
        }
        // Otherwise normal tap advances
        handleStep()
    }

    const handleChoice = (selectedBranch) => {
        setBranch(selectedBranch)
        setStep(prev => prev + 1)
    }

    const getDialogue = () => {
        const baseDialogues = [
            {
                character: "Ghost",
                text: "Noone comes to these forests these days. I am so lonely..."
            },
            {
                character: "Ghost",
                text: "Hey! Who are you?!"
            },
            {
                character: "Ghost",
                text: "Are you lost in these woods?"
            }
        ]

        if (branch === 'yes') {
            return [
                ...baseDialogues,
                { /* Placeholder for step 3 index alignment if needed, or just append */ }, 
                {
                    character: "You",
                    text: "Yes... I was playing hide & seek with my friends. I think I forgot my way back."
                },
                {
                    character: "Ghost",
                    text: "Oh, Don't worry, I know all the ways of this forest!"
                },
                {
                    character: "Ghost",
                    text: "I will help you get out of here!"
                }
            ]
        }
        
        return baseDialogues
    }
    
    // Ghost Sprite Logic
    const getGhostSprite = () => {
        if (step === 0) return "/g1-n.png"
        if (step >= 5) return "/g1-h.png" // Happy/Helpful ghost
        return "/g1-s.png" // Shocked ghost
    }

    // Hero Sprite Logic
    const getHeroSprite = () => {
        if (branch === 'yes') {
            if (step >= 6) return "/h1-c3.png" // Relieved/Hopeful
            if (step >= 4) return "/h1-c2.png" // Sad/Forgot way
        }
        return "/h1-c.png" // Neutral
    }

    const currentDialogues = getDialogue()
    // Helper to get current text safely
    // Steps: 0, 1, 2 -> Base. Step 3 -> Choice. Step 4, 5, 6 -> Branch response.
    const currentLine = step >= 4 ? currentDialogues[step] : currentDialogues[step]

    return (
        <div 
            id='scene-one' 
            className={`${useHorrorFont ? 'horror-font' : 'default-font'} ${isClearing ? 'fog-initial-clear' : ''}`}
            onClick={(e) => handleStep()}
            onContextMenu={handleBack}
            onTouchStart={handleTouch}
        >
            {/* Background & Fog */}
            <div className='fog-layer fog-layer-1'></div>
            <div className='fog-layer fog-layer-2'></div>
            <div className='fog-layer fog-layer-3'></div>

            {/* Characters */}
            <div className="characters-container">
                {/* Ghost Character - Appears after fog clears */}
                {showGhost && (
                    <img 
                        src={getGhostSprite()} 
                        alt="Ghost" 
                        className={`character ghost ${step === 0 ? 'ghost-enter-zigzag center' : 'ghost-move-right right'}`} 
                    />
                )}
                
                {/* Hero Character - Appears from step 1 */}
                {step >= 1 && (
                    <img 
                        src={getHeroSprite()} 
                        alt="Hero" 
                        className="character hero left fade-in" 
                    />
                )}
            </div>

            {/* Dialogue Box (only if not choosing and ghost is visible) */}
            {step !== 3 && showGhost && currentLine && (
                <div className="dialogue-box">
                    <div className="name-box">{currentLine.character}</div>
                    <div className="text-box">{currentLine.text}</div>
                    <div className="click-indicator">▼</div>
                </div>
            )}

            {/* Choice Menu */}
            {step === 3 && (
                <div className="choice-overlay">
                    <div className="choice-container">
                        <h2 className="choice-title">Friendly faced Ghost: "Are you Lost?"</h2>
                        <button className="choice-btn" onClick={(e) => { e.stopPropagation(); handleChoice('yes'); }}>1. Yes...</button>
                        <button className="choice-btn" onClick={(e) => { e.stopPropagation(); console.log('No selected'); }}>2. No...</button>
                    </div>
                </div>
            )}
        </div>
    )
}
