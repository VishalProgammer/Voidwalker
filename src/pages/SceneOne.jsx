import { useState } from 'react'
import './SceneOne.css'

export function SceneOne({ useHorrorFont }) {
    const [dispersions, setDispersions] = useState([])

    const handleInteraction = (e) => {
        // Get click/touch position
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top

        // Create new dispersion effect
        const newDispersion = {
            id: Date.now(),
            x,
            y
        }

        setDispersions(prev => [...prev, newDispersion])

        // Remove dispersion after animation completes
        setTimeout(() => {
            setDispersions(prev => prev.filter(d => d.id !== newDispersion.id))
        }, 2000)
    }

    return (
        <div 
            id='scene-one' 
            className={useHorrorFont ? 'horror-font' : 'default-font'}
            onClick={handleInteraction}
            onTouchStart={handleInteraction}
        >
            {/* Animated Fog Layers */}
            <div className='fog-layer fog-layer-1'></div>
            <div className='fog-layer fog-layer-2'></div>
            <div className='fog-layer fog-layer-3'></div>

            {/* Interactive Dispersion Effects */}
            {dispersions.map(dispersion => (
                <div
                    key={dispersion.id}
                    className='fog-dispersion'
                    style={{
                        left: `${dispersion.x}px`,
                        top: `${dispersion.y}px`
                    }}
                />
            ))}
        </div>
    )
}
