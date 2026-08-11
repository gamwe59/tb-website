let fileUpload = document.getElementById("file")
let filename = document.getElementById("curfile")

let pagetwo = document.getElementById("pagetwo")

let fileDisplay = document.getElementById("display")
let taginput = document.getElementById("taginput")
let tagfolder = document.getElementById("tagfolder")

let upbutton = document.getElementById("upbutton")
let useOriginal = document.getElementById("useOriginal")

let confirmPage = document.getElementById("confirm")
let confirmText = document.getElementById("confirmText")
let confirmImg = document.getElementById("confirmImg")
let container = document.getElementById("container")

let file

let user

let addedTags = {}

function addTag(value) {
    let div = document.createElement("div")
    let p = document.createElement("p")
    let butt = document.createElement("button")
    div.classList.add("tag")
    p.textContent = value
    butt.textContent = "X"
    div.append(p)
    div.append(butt)
    tagfolder.append(div)
    addedTags[value] = value
    taginput.value = ""
    butt.onclick = function() {
        addedTags[value] = null
        div.remove()
    }
}

function uploaded() {
    addedTags = {}
    pagetwo.classList.remove("invisible")
    pagetwo.classList.add("visible")
    fileDisplay.src = URL.createObjectURL(file)
    tagfolder.innerHTML = ""
    addedTags = {}
    useOriginal.checked = false
}

async function upload() {
    const form = new FormData();
    let newFile = new File([file], file.name)
    //console.log((newFile)
    form.append('file', newFile);
    let tagsString = ""
    for (const [key, child] of Object.entries(addedTags)) {
        tagsString += child+","
    }
    tagsString = tagsString.replace(/,\s*$/, "");
    form.append('tags', tagsString);
    form.append('use_original', `${useOriginal.checked}`);

    const url = `https://tripletripletriplebakabakabaka.club/api/v1/media`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json'
            },
            body: form,
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error(response.status);
        }

        const result = await response.json();
        if (result) {
            //console.log((result)
            confirmPage.classList.remove("invisible")
            confirmPage.classList.add("visible")
            container.classList.add("darken")
            setTimeout(function(){
                window.location.href = `profile/${user.userid}`
            }, 4000);
        }
    } catch (error) {
        confirmPage.classList.remove("invisible")
        confirmPage.classList.add("visible")
        container.classList.add("darken")
        confirmText.innerHTML = `Error: ${error.message}<br><sub>Please try again<br>Window will reload shortly</sub>`
        confirmImg.style = "visibility: hidden; position:absolute;"
        setTimeout(function(){
            window.location.reload()
        }, 4000);
    }
     

//**
}

fileUpload.addEventListener('change', function () {
  var singleFile = fileUpload.files[0]
  if (singleFile) {
    file = singleFile
    filename.textContent = file.name
    //console.log((file)
    uploaded()
  }
}, false);

taginput.addEventListener("keyup", function(e) {
    if (event.key === "Enter") {
        addTag(taginput.value)
    }
})

upbutton.onclick = function() {
    //console.log((addedTags)
    upload();   
}


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
            //console.log((user)
        }
    } catch (error) {
        console.error(error.message);

        confirmPage.classList.remove("invisible")
        confirmPage.classList.add("visible")
        container.classList.add("darken")
        confirmText.innerHTML = `You are either logged out, or unauthorized. Please sign into valid account.<br><br><sub>You will be redirected to the home page shortly.</sub>`
        confirmImg.style = "visibility: hidden; position:absolute;"
        setTimeout(function(){
            window.location.href = "/"
        }, 6000);
    }
}
me();