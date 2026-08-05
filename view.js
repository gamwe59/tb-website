let testid = "Gy32OTtnVg2f"

async function getPost() {
    const url = `https://tripletripletriplebakabakabaka.club/api/v1/media/${testid}`;
    try {
        const response = await fetch(url, {credentials: "include"});
        if (!response.ok) {
            throw new Error(response.status);
        }

        const result = await response.json();
        if (result) {
            console.log(result)
        }
    } catch (error) {
        console.error(error.message);
    }
}
getPost();