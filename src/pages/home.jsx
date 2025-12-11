import './home.css'

export function Home({ onSettingsClick, onNewGameClick, useHorrorFont }) {
    return (
        <>
            <div id='home-screen' className={useHorrorFont ? 'horror-font' : 'default-font'}>
                <h1 id='title'>
                    Voidwalker
                </h1>
                <ul id='options'>
                    <li onClick={onNewGameClick}>New Game</li>
                    <li>Continue</li>
                    <li onClick={onSettingsClick}>Settings</li>
                </ul>
            </div>
        </>
    )
}
