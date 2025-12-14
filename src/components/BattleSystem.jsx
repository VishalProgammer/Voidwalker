import { useState, useEffect, useRef } from 'react'
import './BattleSystem.css'

export function BattleSystem({ type, duration, onWin, onLose, onDamage }) {
    const [turn, setTurn] = useState((duration && duration < 1000) ? 'enemy' : 'player') // Ambush check
    const [markers, setMarkers] = useState([])
    const [enemyHealth, setEnemyHealth] = useState(100)
    const [playerHealth, setPlayerHealth] = useState(100)
    const [combo, setCombo] = useState(0)
    const [feedback, setFeedback] = useState(null) // { text: "PERFECT", x, y, id }
    const [enemyAction, setEnemyAction] = useState('idle') // 'idle', 'winding_up', 'attacking', 'hurt'
    const [isShielding, setIsShielding] = useState(false)
    const isShieldingRef = useRef(false)
    
    // Config
    const MARKER_SPAWN_RATE = 800
    const MARKER_DURATION = 1500
    const TOTAL_MARKERS_TO_WIN = 5
    const DAMAGE_PER_HIT = 20
    const DAMAGE_FROM_ENEMY = 25

    const markersRef = useRef([])
    const hitsLanded = useRef(0)

    // Helper to sync state and ref
    const handleShieldStart = (e) => {
        if (e.cancelable) e.preventDefault()
        e.stopPropagation()
        setIsShielding(true)
        isShieldingRef.current = true
    }

    const handleShieldStop = (e) => {
        if (e.cancelable) e.preventDefault()
        e.stopPropagation()
        setIsShielding(false)
        isShieldingRef.current = false
    }

    // === GAME LOOP ===
    useEffect(() => {
        if (turn === 'player') {
            startPlayerTurn()
        } else if (turn === 'enemy') {
            startEnemyTurn()
        }
    }, [turn])


    // Reset shield when turn changes (prevents sticking across rounds)
    useEffect(() => {
        setIsShielding(false)
        isShieldingRef.current = false
    }, [turn])


    // === PLAYER TURN LOGIC ===
    const startPlayerTurn = () => {
        let spawned = 0
        const interval = setInterval(() => {
            if (spawned >= TOTAL_MARKERS_TO_WIN) {
                clearInterval(interval)
                setTimeout(() => {
                   if (turn === 'player') setTurn('enemy')
                }, 2000)
                return
            }
            spawnMarker()
            spawned++
        }, MARKER_SPAWN_RATE)
        
        return () => clearInterval(interval)
    }

    const spawnMarker = () => {
        const id = Date.now() + Math.random()
        const x = 20 + Math.random() * 60 // 20% to 80% width
        const y = 20 + Math.random() * 40 // 20% to 60% height
        
        const newMarker = { id, x, y, createdAt: Date.now() }
        setMarkers(prev => [...prev, newMarker])
        markersRef.current.push(newMarker)

        // Auto-remove miss if not clicked
        setTimeout(() => {
            setMarkers(prev => {
                const stillExists = prev.find(m => m.id === id)
                if (stillExists) {
                    handleMiss(x, y)
                    return prev.filter(m => m.id !== id)
                }
                return prev
            })
        }, MARKER_DURATION)
    }

    const handleMarkerClick = (e, markerId, createdAt) => {
        e.stopPropagation()
        const now = Date.now()
        const elapsed = now - createdAt
        const progress = elapsed / MARKER_DURATION // 0.0 to 1.0 (1.0 is end)
        
        // Perfect Window: 0.7 to 0.9 (ring is small but not gone)
        // Good Window: 0.5 to 0.95
        
        let result = 'MISS'
        let damage = 0

        if (progress > 0.7 && progress < 0.95) {
            result = 'PERFECT'
            damage = DAMAGE_PER_HIT * 1.5
        } else if (progress > 0.4 && progress < 0.98) {
            result = 'GOOD'
            damage = DAMAGE_PER_HIT
        } else {
            result = 'MISS'
        }

        if (result !== 'MISS') {
            setCombo(prev => prev + 1)
            setEnemyHealth(prev => Math.max(0, prev - damage))
            setEnemyAction('hurt')
            setTimeout(() => setEnemyAction('idle'), 300)
            hitsLanded.current++
        } else {
            setCombo(0)
        }

        showFeedback(result, e.clientX, e.clientY)
        setMarkers(prev => prev.filter(m => m.id !== markerId))

        // Check Win
        if (hitsLanded.current >= TOTAL_MARKERS_TO_WIN) {
            setTimeout(onWin, 500)
        }
    }

    const handleMiss = (x, y) => {
        setCombo(0)
        showFeedback("MISS", window.innerWidth * (x/100), window.innerHeight * (y/100))
    }

    const showFeedback = (text, x, y) => {
        const id = Date.now()
        setFeedback({ text, x, y, id })
        setTimeout(() => setFeedback(null), 800)
    }

    // === ENEMY TURN LOGIC ===
    const startEnemyTurn = () => {
        setEnemyAction('winding_up')
        
        const isAmbush = duration && duration < 1000
        const windUpTime = isAmbush ? 400 : 1500 // Quick attack if ambush

        // Telegraphed attack
        setTimeout(() => {
            setEnemyAction('attacking')
            
            // Damage frame
            setTimeout(() => {
                if (isShieldingRef.current) {
                    // Blocked!
                    showFeedback("BLOCKED", window.innerWidth/2, window.innerHeight/2)
                    onDamage(0) 
                    // No health reduction
                } else {
                    // Direct Hit!
                    showFeedback("OUCH", window.innerWidth/2, window.innerHeight/2)
                    onDamage(DAMAGE_FROM_ENEMY)
                    setPlayerHealth(prev => prev - DAMAGE_FROM_ENEMY)
                }
                
                // Force reset shield state after damage calculation to prevent sticking
                setIsShielding(false)
                isShieldingRef.current = false

                if (playerHealth <= 0) {
                    onLose()
                } else {
                     setEnemyAction('idle')
                     setTimeout(() => setTurn('player'), 1000)
                }

            }, 400) // Attack impact timing

        }, windUpTime) // Wind up duration
    }


    return (
        <div className={`battle-system-overlay ${combo > 2 ? 'shake-screen' : ''}`}>
            
            {/* Player Feedback */}
            {feedback && (
                <div 
                    className={`battle-feedback ${feedback.text}`}
                    style={{ left: feedback.x, top: feedback.y }}
                >
                    {feedback.text}
                </div>
            )}

            {/* Combo Counter */}
            {combo > 1 && (
                <div className="battle-combo">
                    {combo} HIT COMBO!
                </div>
            )}

            {/* Hit Markers */}
            {markers.map(marker => (
                <div 
                    key={marker.id}
                    className="hit-marker-container"
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    onClick={(e) => handleMarkerClick(e, marker.id, marker.createdAt)}
                    onMouseDown={(e) => e.stopPropagation()} // Prevent bubble up
                >
                    <div className="hit-marker-ring" style={{ animationDuration: `${MARKER_DURATION}ms` }}></div>
                    <div className="hit-marker-core"></div>
                </div>
            ))}

            {/* Enemy Display */}
            <div className={`battle-enemy-container ${enemyAction}`}>
                <img src={`/${type}.png`} className="battle-enemy-sprite" alt="Enemy" />
                <div className="enemy-health-bar-bg">
                    <div className="enemy-health-bar-fill" style={{ width: `${enemyHealth}%` }}></div>
                </div>
            </div>


            {/* Defense UI (Only in Enemy Turn) */}
            {turn === 'enemy' && enemyAction !== 'idle' && (
                <div className="defense-controls">
                    <button 
                        className={`shield-btn ${isShielding ? 'active' : ''}`}
                        onMouseDown={handleShieldStart}
                        onMouseUp={handleShieldStop}
                        onMouseLeave={handleShieldStop}
                        onTouchStart={handleShieldStart}
                        onTouchEnd={handleShieldStop}
                        onTouchCancel={handleShieldStop}
                    >
                        🛡️ HOLD TO BLOCK!
                    </button>
                </div>
            )}

        </div>
    )
}
