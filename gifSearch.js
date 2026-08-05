let content = document.getElementById("content");
let search = document.getElementById("search")

let testid = "1203618379991097385";

let user

let loading = false;

let imgWidth = 400

let gallery = {}

function setSize() {
    let gap = 5

    let divWidth = content.clientWidth

    let fx = Math.floor(divWidth/400)+1
    fx = Math.min(fx, 8)
    fx = Math.max(fx,2)
    divWidth -= gap*(fx-1)
    console.log(fx)

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

function addImgs() {
    content.innerHTML = ""
    for (const [key, data] of Object.entries(gallery)) {
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
    setSize();
}


async function loadGallery(terms) {
    gallery = {}
    const url = `https://tripletripletriplebakabakabaka.club/api/v1/search?`;
    try {
        const params = new URLSearchParams();
        if (terms) {
            for (const [key, data] of Object.entries(terms)) {
                params.append("q", data)
            }
        } else {
            params.append("q", "a");
            params.append("q", "e");
            params.append("q", "i");
            params.append("q", "o");
            params.append("q", "u");
        }
        const response = await fetch(url+params)
        if (!response.ok) {
            throw new Error(response.status);
        }

        const result = await response.json();
        if (result) {
            console.log(result)
            for (let i = 0; i < result.results.length; i++) {
                let data = result.results[i]
                if (data.media) {
                    gallery[data.id] = data
                }
            }
            addImgs();
        }
    } catch (error) {
        console.error(error.message);
        return;
    }
}
loadGallery()

search.addEventListener("keyup", function(e) {
    if (event.key === "Enter") {
        loadGallery([search.value])
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