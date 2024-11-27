function importPhotos(directory) {

}

document.addEventListener("keydown", async (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key == "i") {
        try {
            // idk how to handle files that are only images since raw returns type blank so idk
            const [fileHandle] = await window.showOpenFilePicker({
                multiple: true
            });
            const file = await fileHandle.getFile();
            // Do something with the selected file
            console.log(file);
        } catch (error) {
            // Handle errors, e.g. user cancels the dialog
            console.error('File selection canceled:', error);
        }
    }
})