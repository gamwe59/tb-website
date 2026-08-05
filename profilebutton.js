let profile = document.getElementById("profile")

let user

async function me() {
    const url = `https://tripletripletriplebakabakabaka.club/api/v1/users/me`;
    try {
        const response = await fetch(url, {credentials: "include"});
        if (!response.ok) {
            throw new Error(response.status);
        }

        const result = await response.json();
        user = result.user;
        if (user) {
            loadProfile(true)
        }
    } catch (error) {
        console.error(error.message);
        loadProfile(false)
    }
}
me();

function loadProfile() {
    if (user) {
        let butt = document.createElement("button")
        butt.id = "pfp"
        butt.classList.add("pfp")
        let img = document.createElement("img")
        img.src = user.avatars[256]
        butt.appendChild(img)
        profile.append(butt)

        let dropdown = document.createElement("div")
        dropdown.id = "dropdown"
        dropdown.classList.add("dropdown", "dropclose")
        let view = document.createElement("a")
        view.href=`/profile${user.userid}`
        view.textContent = "view profile"
        let signout = document.createElement("a")
        signout.textContent = "sign out"
        dropdown.appendChild(view)
        dropdown.appendChild(signout)
        profile.append(dropdown)

        butt.onclick = function() {
            dropdown.classList.toggle("dropopen")
            dropdown.classList.toggle("dropclose")
        }
    } else {
        let butt = document.createElement("a")
        butt.textContent = "SIGN IN"
        butt.classList.add("signin")
        butt.href = "https://tripletripletriplebakabakabaka.club/api/auth/discord"
        profile.append(butt)
        console.log("pee")
    }
}