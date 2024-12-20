const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const sharp = require('sharp');
const fs = require("fs");
const { exec } = require('child_process');

const config = {
    catalogLocation: "./catalog"
}

const createWindow = async () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    ipcMain.handle("dialog:openPicker", async (event, e) => {
        const result = await dialog.showOpenDialog(win, {
            properties: ['openFile', 'multiSelections'], // Allow only files
        });
        return result.filePaths;
    })

    win.loadFile('app/index.html')
    
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

function generatePPM(input, output) {
    exec(`dcraw -w -o 1 -q 3 ${input}`, async (err, stdout, stderr) => {
        // this command takes the longest- should be used for each photo once when imported, then just keep the PPM for editing previews
        if (err) {
            console.error(`Error converting RAW file: ${stderr}`);
            return;
        }
    })
}

function generateSmallJPG(input) {
    exec(`dcraw -e ${input}`, async (err, stdout, stderr) => {
        // this command is faster and creates a "thumbnail" jpeg version
        if (err) {
            console.error(`Error creating thumbnail, ${stderr}`)
            return
        }
    })
}

function generateJPG(input, output) {
    exec(`magick ${input} ${output}`, (err, stdout, stderr) => {
        // this one is shorter, can be used for updating previews
        if (err) {
            console.error(`Error converting to JPEG: ${stderr}`);
            return;
        }
    })
}