import './home.css'

export function Home({ onSettingsClick, onNewGameClick, onContinueClick, hasSave, useHorrorFont }) {
    return (
        <>
            <div id='home-screen' className={useHorrorFont ? 'horror-font' : 'default-font'}>
                <h1 id='title'>
                    Voidwalker
                </h1>
                <ul id='options'>
                    <li onClick={onNewGameClick}>New Game</li>
                    {hasSave ? (
                        <li onClick={onContinueClick}>Continue</li>
                    ) : (
                        <li style={{ opacity: 0.3, cursor: 'not-allowed' }}>Continue</li>
                    )}
                    <li onClick={onSettingsClick}>Settings</li>
                </ul>
            </div>
        </>
    )
}
