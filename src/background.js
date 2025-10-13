chrome.runtime.onMessage.addListener(async (message, sender) => {
    if (message.action === "downloadImage") {
        chrome.downloads.download({
            url: message.url, filename: `${message.filename}.${new URL(message.url).pathname.split(".").slice(-1)}`
        })
    }
    if (message.action === "openTab") {
        await chrome.tabs.create({
            url: message.url, active: false
        });
    }
    if (message.action === "deleteTab") {
        chrome.tabs.remove(sender.tab.id);
    }
})

async function checkDownloads() {
    let currentDownloads = await chrome.downloads.search({state: "in_progress"});
    if (currentDownloads.length !== 0) {
        console.log("found current downloads : ", currentDownloads);
        return;
    }
    let toDownload = (await chrome.tabs.query({title: "APBD-kwik"}));
    if (toDownload.length === 0) {
        console.log("found nothing to download");
        return;
    }
    chrome.scripting.executeScript({
        target: {tabId: toDownload[0].id},
        func: () => {
            document.dispatchEvent(new CustomEvent('APBD-download'));
        }
    });
}

chrome.downloads.onCreated.addListener(async (delta) => {
        let downloadData = (await chrome.downloads.search({id: delta.id}))[0];
        if (downloadData.referrer.includes("kwik.cx")) {
            let origin = (await chrome.tabs.query({url: downloadData.referrer}))[0];
            if (origin) {
                chrome.tabs.remove(origin.id);
            }
        }
    }
)

chrome.downloads.onChanged.addListener((delta) => {
    if (delta.state && delta.state.current === "complete") {
        console.log("Checking downloads because one ended");
        checkDownloads();
    }
});

chrome.webNavigation.onCompleted.addListener(() => {
    console.log("Checking downloads because navigation happened to kwik.cx");
    setTimeout(checkDownloads, 3000);
}, {url: [{hostContains: 'kwik.cx'}]});

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('justInCaseAPBD', {periodInMinutes: 5});
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'justInCaseAPBD') {
        console.log("Checking downloads just in case");
        checkDownloads();
    }
});

chrome.action.onClicked.addListener(() => {
    console.log("Checking downloads because user requested it");
    checkDownloads();
});

console.log("Checking downloads because extension was launched");
checkDownloads();