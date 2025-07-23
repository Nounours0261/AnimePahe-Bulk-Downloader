async function startPaheWin() {
    let button = document.querySelector(".redirect");
    let observer = new MutationObserver(() => {
        if (button.href.includes("kwik.si")) {
            observer.disconnect();
            button.click();
        }
    });
    observer.observe(button, {attributes: true});
}

setTimeout(startPaheWin, 3000);