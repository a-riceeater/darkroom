function importPhotos(directory) {

}

const { ipcRenderer, dialog } = require("electron")
const { fromEvent } = require('file-selector');

document.addEventListener("keydown", async (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key == "i") {
        try {
            // idk how to handle files that are only images since raw returns type blank so idk
            const files = await ipcRenderer.invoke("dialog:openPicker")

            for (let i = 0; i < files.length; i++) {
                await generateSmallJPG(files[i], (p) => {
                    const ele = document.createElement("div");
                    ele.classList.add("lp-image")
                    ele.innerHTML = `
                    <img src="${p}" alt="asd.jpg">
                    <span class="lp-num">${i + 1}</span>`
                    document.querySelector(".library").appendChild(ele)
                })
            }

        } catch (error) {
            // Handle errors, e.g. user cancels the dialog
            console.error('File selection canceled:', error);
        }
    }
})