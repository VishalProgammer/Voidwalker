import './home.css'

export function Home({ onSettingsClick, useHorrorFont }) {
    return (
        <>
            <div id='home-screen'>
                <h1 id='title' className={useHorrorFont ? 'horror-font' : 'default-font'}>
                    Voidwalker Tales
                </h1>
                <ul id='options'>
                    <li>New Game</li>
                    <li>Continue</li>
                    <li onClick={onSettingsClick}>Settings</li>
                </ul>
            </div>
        </>
    )
}
