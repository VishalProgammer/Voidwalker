import { useState, useEffect } from 'react'

export const BattleGhost = ({ img, type, duration, isUnclickable, onWin, onLose, onDamage }) => {
    const [attack, setAttack] = useState(false)
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!attack) {
                setAttack(true)
                if (onDamage) onDamage(20)
                setTimeout(() => { if(onLose) onLose() }, 800) 
            }
        }, duration)
        return () => clearTimeout(timer)
    }, [])

    const handleClick = (e) => {
        e.stopPropagation()
        if (isUnclickable || attack) return
        if (onWin) onWin()
    }

    if (attack) {
        return <img src={type ? `/${type}-t.png` : img} className="battle-ghost-img attack-mode" alt="Attack" />
    }

    return (
        <div className="battle-ghost-container" onClick={handleClick}>
            <img src={type ? `/${type}.png` : img} className="battle-ghost-img" alt="Monster" />
            <div className="timer-bar-bg">
                <div className="timer-bar-fill" style={{ animationDuration: `${duration}ms` }}></div>
            </div>
        </div>
    )
}
