let content = document.getElementById("content");
let search = document.getElementById("search")

const testid = window.location.pathname.split('/profile/')[1];

let user

let loading = false;

let imgWidth = 400

let gallery = {}

let loaded = 0
let foundAllResults = false

let searchterms = null

function setSize() {
    let gap = 5

    let divWidth = content.clientWidth

    let fx = Math.floor(divWidth/400)+1
    fx = Math.min(fx, 8)
    fx = Math.max(fx,2)
    divWidth -= gap*(fx-1)

    imgWidth = (divWidth/fx)

    let galleryLocations = []

    let index = 0
    let colHeights = []

    for (let i = 0; i < fx; i++) {
        colHeights[i] = 0
    }

    for (const [key, child] of Object.entries(content.childNodes)) {
        let img = gallery[child.getAttribute("contentid")]
        let format = img.media.webp
        if (!format) {
            format = img.media.original
            console.log(format)
        }

        let aspectRatio = format.dims[0]/format.dims[1]
        let imgHeight = imgWidth/aspectRatio

        child.style.width = (imgWidth)+"px"
        child.style.height = (imgHeight)+"px"

        if (index > 0) {
            if (colHeights[index-1] < colHeights[index]) {
                index--
            }
        } else {
            if (colHeights[fx-1] < colHeights[index]) {
                index = fx-1
            }
        }
        
        let pos = colHeights[index]

        child.style.transform = "translate("+( index*(imgWidth+gap) )+"px,"+( pos )+"px)"
    
        setTimeout(() => {
            child.classList.remove("notransition")
        }, 5);

        colHeights[index]+=imgHeight+gap

        index++
        if (index >= fx) {
            index = 0
        }
    }

    let furthestDown = 0
    for (let i = 0; i < colHeights.length; i++) {
        if (colHeights[i] > furthestDown) {
            furthestDown = colHeights[i];
        }
    }
    content.style.height = furthestDown+"px"
}

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
            params.append("q", `@${user.username}`);
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
                    if (data.media) {
                        gallery[data.id] = data
                        addImg(data);
                    }
                }
            setSize();
        }
        }
    } catch (error) {
        console.error(error.message);
        return;
    }
}

let pfp = document.getElementById("profileimage")
let username = document.getElementById("username")
let banner = document.getElementById("banner")

function loadProfile() {
    pfp.src = user.avatars[256];
    username.textContent = user.username;
    if (user.banner) {
        banner.src = user.banner;
    }
    loadGallery(false)
}

async function me() {
    const url = `https://tripletripletriplebakabakabaka.club/api/v1/users/${testid}`;
    try {
        const response = await fetch(url, {credentials: "include"});
        if (!response.ok) {
            throw new Error(response.status);
        }

        const result = await response.json();
        user = result.user;
        if (user) {
            loadProfile()
        }
    } catch (error) {
        console.error(error.message);
    }
}
me();

//detect touch bottom

window.addEventListener('scroll', function() {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
    loadGallery(true)
  }
});

//detect when resize

let countDown = 0
window.onresize = function() {
    countDown++
    setTimeout(() => {
        countDown--
        if (countDown == 0) {
            setSize()
        }
    }, 300);
};