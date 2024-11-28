const { ipcRenderer, dialog } = require("electron")
const { fromEvent } = require('file-selector');

document.addEventListener("keydown", async (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key == "i") {
        try {
            importPhotos();
        } catch (error) {
            console.error('File selection canceled:', error);
        }
    }
})

document.querySelector("#tl-import").addEventListener("click", importPhotos)

async function importPhotos() {
    const files = await ipcRenderer.invoke("dialog:openPicker")

    for (let i = 0; i < files.length; i++) {
        await generateSmallJPG(files[i], (p) => {
            const ele = document.createElement("div");
            ele.classList.add("lp-image")
            ele.innerHTML = `
                    <img src="${p}" alt="${p.replace(/^.*[\\/]/, '')}">
                    <span class="lp-num">${i + 1}</span>`
            document.querySelector(".library").appendChild(ele)
        })
    }
}