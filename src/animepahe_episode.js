function getRes(input) {
    const match = input.match(/(\d+)p/);
    return match ? parseInt(match[1], 10) : 0;
}

function episodePickDL(buttonList, res) {
    let closest = Math.abs(res - getRes(buttonList[0].innerText));
    let index = 0;
    for (let i = 1; i < buttonList.length; i++) {
        const cur = Math.abs(res - getRes(buttonList[i].innerText));
        if (cur < closest) {
            closest = cur;
            index = i;
        }
    }
    return buttonList[index];
}

async function episodeStartDL(res) {
    let buttonList = Array.from(document.querySelectorAll("#pickDownload a")).filter((e) => {
        return e.querySelector("span.badge-warning") === null;
    });
    chrome.runtime.sendMessage({
        action: "openTab",
        url: episodePickDL(buttonList, res).href,
    })

    let nextList = document.querySelectorAll(".sequel a");
    if (nextList.length !== 0) {
        chrome.runtime.sendMessage({
            action: "openTab",
            url: nextList[0].href + "#APBD" + res + "p",
        });
    }
    chrome.runtime.sendMessage({action: "deleteTab"});
}

async function startEpisode() {
    if (window.location.href.includes("#APBD")) {
        await episodeStartDL(getRes(window.location.href.split("#")[1]));
    }
}

setTimeout(startEpisode, 1000);