import './settings.css'

export function Settings({ onBack, musicVolume, setMusicVolume, sfxVolume, setSfxVolume, useHorrorFont, setUseHorrorFont }) {
    return (
        <div id='settings-screen'>
            <div className='settings-container'>
                <h1 className={`settings-title ${useHorrorFont ? 'horror-font' : 'default-font'}`}>
                    ⚙ Settings ⚙
                </h1>
                
                <div className='settings-content'>
                    {/* Music Volume Control */}
                    <div className='setting-item'>
                        <label className='setting-label'>
                            <span className='label-icon'>🎵</span>
                            Music Volume
                        </label>
                        <div className='slider-container'>
                            <input 
                                type='range' 
                                min='0' 
                                max='100' 
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(e.target.value)}
                                className='volume-slider'
                            />
                            <span className='volume-value'>{musicVolume}%</span>
                        </div>
                    </div>

                    {/* Sound Effects Volume Control */}
                    <div className='setting-item'>
                        <label className='setting-label'>
                            <span className='label-icon'>🔊</span>
                            Sound Effects Volume
                        </label>
                        <div className='slider-container'>
                            <input 
                                type='range' 
                                min='0' 
                                max='100' 
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(e.target.value)}
                                className='volume-slider'
                            />
                            <span className='volume-value'>{sfxVolume}%</span>
                        </div>
                    </div>

                    {/* Font Toggle */}
                    <div className='setting-item'>
                        <label className='setting-label'>
                            <span className='label-icon'>🖋</span>
                            Font Style
                        </label>
                        <div className='toggle-container'>
                            <button 
                                className={`font-toggle-btn ${!useHorrorFont ? 'active' : ''}`}
                                onClick={() => setUseHorrorFont(false)}
                            >
                                Default Font
                            </button>
                            <button 
                                className={`font-toggle-btn ${useHorrorFont ? 'active' : ''}`}
                                onClick={() => setUseHorrorFont(true)}
                            >
                                Horror Font
                            </button>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <button className='back-button' onClick={onBack}>
                    ← Back to Menu
                </button>
            </div>
        </div>
    )
}
