import './GameOver.css'

export function GameOver({ cause, onRetry, onDie, useHorrorFont }) {
    return (
        <div id="game-over-screen">
            <h1 className={`game-over-title ${useHorrorFont ? 'horror-font' : 'default-font'}`}>
                YOU DIED
            </h1>
            
            <p className="death-cause">
                Cause: <span className="cause-text">{cause || "Unknown"}</span>
            </p>

            <div className="game-over-options">
                <button className="retry-btn" onClick={onRetry}>
                    Retry
                </button>
                <button className="die-btn" onClick={onDie}>
                    Accept Fate (Die)
                </button>
            </div>
        </div>
    )
}
