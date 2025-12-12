export const getDialogues = (branch) => [
    { character: "Ghost", text: "No one comes to these forests these days. I am so lonely..." }, // 0
    { character: "Ghost", text: "Hey! Who are you?!" }, // 1
    { character: "Ghost", text: "Are you lost in these woods?" }, // 2
    { /* Choice */ }, // 3
    ...(branch === 'yes' ? [
        { character: "You", text: "Yes... I was playing hide & seek with my friends. I think I forgot my way back." }, // 4
        { character: "Ghost", text: "Oh, Don't worry, I know all the ways of this forest!" }, // 5
        { character: "Ghost", text: "I will help you get out of here!" }, // 6
        { character: "You", text: "Oh, really? Thanks...." }, // 7 
    ] : [
        { character: "You", text: "No... I'm just looking for some rare mushrooms." }, // 4
        { character: "Ghost", text: "Mushrooms? In this dead place? But bravery won't save you from what lurks here..." }, // 5
        { character: "You", text: "Oh, really?" }, // 6
        { character: "Ghost", text: "Yea, this is a dangerous place, Lemme show you how to stay safe...." }, // 7
    ]),
    { character: "Ghost", text: "First I have to teach you how to survive in this forest" }, // 8
    { character: "Ghost", text: "CLICK the ghost before their TIMER runs out to ESCAPE them!" }, // 9 (Tutorial 1)
    
    { character: "Ghost", text: "Nice! You got it!" }, // 10 (Pass)
    { character: "Ghost", text: "Oh No! You got hurt!" }, // 11 (Fail/Damage)
    { character: "Ghost", text: "It's ok, click me, I will Heal you!" }, // 12 (Heal Trap)
    { character: "Ghost", text: "You dumb fool! You think a ghost will help you!!" }, // 13 (Reveal)
    { character: "Evil Ghost", text: "In this forest, It's ESCAPE OR DIE!!" }, // 14
    { character: "Evil Ghost", text: "HAHAHAHA, Now, DINNER TIME!!" }, // 15
]
