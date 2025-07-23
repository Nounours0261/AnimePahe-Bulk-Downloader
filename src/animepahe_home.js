async function homeStartDL(res) {
    chrome.runtime.sendMessage({
        action: "downloadImage",
        url: document.querySelector(".poster-wrapper .anime-poster a").href,
        filename: document.querySelector("h2.japanese").textContent.replace(/[^a-zA-Z0-9-.,()_]+/g, "_")
    });

    let isAsc = document.querySelector(".btn.btn-dark.btn-sm.active").innerText.includes("asc");
    let episodes = document.querySelectorAll(".episode-wrap a.play");
    chrome.runtime.sendMessage({
        action: "openTab",
        url: episodes[isAsc ? 0 : (episodes.length - 1)].href + "#APBD" + res,
    });
}

const container = document.createElement("div");
container.className = `container`;
container.innerHTML = `
    <div class="download-wrapper">
        <h3>Download</h3>
        <div class="button-holder">
            <button id="download-low" class="download-button">~360p</button>
            <button id="download-mid" class="download-button">~720p</button>
            <button id="download-high" class="download-button">~1080p</button>
        </div>
    </div>`;

container.querySelector("#download-low").addEventListener("click", () => {
    homeStartDL("360p");
});
container.querySelector("#download-mid").addEventListener("click", () => {
    homeStartDL("720p");
});
container.querySelector("#download-high").addEventListener("click", () => {
    homeStartDL("1080p");
});

let animeContent = document.querySelector(".anime-content");
animeContent.appendChild(container);