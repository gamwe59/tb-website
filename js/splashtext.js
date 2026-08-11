import usertext from "../splashtext.json" with { type: "json" }

let text = document.getElementById("splashtext")

function pickText() {
    let obj = usertext[Math.floor(Math.random()*usertext.length)]
    text.innerHTML = `${obj.text}<br><strong>- ${obj.user}`
}

pickText()