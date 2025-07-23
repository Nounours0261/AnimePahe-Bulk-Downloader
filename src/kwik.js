async function startKwik() {
    if (document.querySelectorAll("[type=submit]").length === 0) {
        location.reload();
        return;
    }
    document.title = "APBD-kwik";
    document.addEventListener("APBD-download", () => {
        let buttonList = document.querySelectorAll("[type=submit]");
        if (buttonList.length === 1) {
            buttonList[0].click();
        } else {
            console.warn(buttonList);
            window.alert("Found too many buttons, the selectors may need to be updated.");
        }
    });
}

setTimeout(startKwik, 1000);