let content = document.getElementById("content");
let search = document.getElementById("search")

let displayImg = document.getElementById("displayImg")
let imgheader = document.getElementById("imgheader")
let userPfp = document.getElementById("PostPFP")
let username = document.getElementById("PostUsername")
let tagDiv = document.getElementById("tags")

let originalbut = document.getElementById("originalbut")
let webpbut = document.getElementById("webpbut")

let loading = false;

let imgWidth = 400

let gallery = {}

let loaded = 0
let foundAllResults = false

let searchterms = []

const testid = window.location.pathname.split('/profile/')[1];
let post
let user
let curFormat = "webp"

let maxImgs = 5

function loadProfile(newuser) {
    if (newuser) {
        username.textContent = newuser.username
        username.href = `/profile/${user}`
        userPfp.src = newuser.avatars[128]
    }
}

async function getUser() {
    const url = `https://tripletripletriplebakabakabaka.club/api/v1/users/${user}`;
    try {
        const response = await fetch(url, {credentials: "include"});
        if (!response.ok) {
            throw new Error(response.status);
        }

        const result = await response.json();
        let newuser = result.user;
        if (newuser) {
            console.log(user)
            loadProfile(newuser)
        }
    } catch (error) {
        console.error(error.message);
        loadProfile()
    }
}

function displayPost() {
    console.log(post)
    user = post.user
    if (post.media.webp) {
        displayImg.src = post.media.webp.url
        webpbut.classList.add("selected")
        curFormat = "webp"
    } else {
        displayImg.src = post.media.original.url
        originalbut.classList.add("selected")
        webpbut.style = "visibility: hidden"
        curFormat = "original"
    }
    if (post.tags) {
        for (const [key, child] of Object.entries(post.tags)) {
            let tag = document.createElement("a")
            tag.textContent = child
            tagDiv.append(tag)
            searchterms[key] = child
        }
    }
    imgheader.textContent = post.title
    if (user) {
        getUser();
    }
    loadGallery()
}

async function getPost() {
    const url = `https://tripletripletriplebakabakabaka.club/api/v1/media/${testid}`;
    try {
        const response = await fetch(url, {credentials: "include"});
        if (!response.ok) {
            throw new Error(response.status);
        }

        const result = await response.json();
        if (result) {
            post = result
            displayPost(result)
        }
    } catch (error) {
        console.error(error.message);
    }
}
getPost();

function addImg(data) {
    let format = data.media.webp
    if (!format) {
        format = data.media.original
    }
    let obj = document.createElement("a")
    obj.href = data.itemurl
    obj.setAttribute("contentid", data.id)
    let img = document.createElement("img")
    img.src = format.url
    obj.appendChild(img)
    content.append(obj)
}


async function loadGallery(add) {
    let url = `https://tripletripletriplebakabakabaka.club/api/v1/search?`;
    try {
        console.log(!add || !foundAllResults)
        if (!add || !foundAllResults) {
            const params = new URLSearchParams();
            if (add) {
                params.append("pos", loaded)
            } else {
                gallery = {}
                loaded = 0
                content.innerHTML = ""
            }
            for (const [key, data] of Object.entries(searchterms)) {
                params.append("q", data)
            }
            params.append("limit", maxImgs+1)
            const response = await fetch(url+params)
            if (!response.ok) {
                throw new Error(response.status);
            }

            const result = await response.json();
            if (result) {
                foundAllResults = (result.results.length <= 0)
                for (let i = 0; i < result.results.length; i++) {
                    let data = result.results[i]
                    loaded++
                    if (data.media && data.id != post.id) {
                        gallery[data.id] = data
                        addImg(data);
                    }
                }
            }
        }
    } catch (error) {
        console.error(error.message);
        return;
    }
}

webpbut.onclick = function() {
    if (curFormat != "webp") {
        displayImg.src = post.media.webp.url
        webpbut.classList.add("selected")
        originalbut.classList.remove("selected")
        curFormat = "webp"
    }
}
originalbut.onclick = function() {
    if (curFormat != "original") {
        displayImg.src = post.media.original.url
        originalbut.classList.add("selected")
        webpbut.classList.remove("selected")
        curFormat = "original"
    }
}