let search = document.getElementById("search")

search.addEventListener("keyup", function(e) {
    if (event.key === "Enter") {
        const params = new URLSearchParams();
        params.append("s", search.value)
        window.location.href = "/gifs?"+params
    }
})