function importPhotos(directory) {

}

const { ipcRenderer } = require("electron")
const { fromEvent } = require('file-selector');

document.addEventListener("keydown", async (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key == "i") {
        try {
            // idk how to handle files that are only images since raw returns type blank so idk
            const handles = await window.showOpenFilePicker({
                multiple: true
            });
            const files = await fromEvent(handles);
            console.log(files);

            for (let i = 0; i < files.length; i++) {
                generateSmallJPG(files[i].path)
            }

        } catch (error) {
            // Handle errors, e.g. user cancels the dialog
            console.error('File selection canceled:', error);
        }
    }
})