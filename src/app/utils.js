const { exec } = require('child_process');
const fs = require("fs")
const path = require("path")

const config = {
    catalogLocation: path.join(__dirname, "../", "catalog"),
    previewLocation: path.join(__dirname, "../previews")
}

function generatePPM(input, output) {
    exec(`dcraw -w -o 1 -q 3 "${input}"`, async (err, stdout, stderr) => {
        // this command takes the longest- should be used for each photo once when imported, then just keep the PPM for editing previews
        if (err) {
            console.error(`Error converting RAW file: ${stderr}`);
            return;
        }
    })
}

function generateSmallJPG(input, cb) {
    exec(`dcraw -e "${input}"`, async (err, stdout, stderr) => {
        // this command is faster and creates a "thumbnail" jpeg version (less quality, basically if camera captured in JPEG)
        if (err) {
            console.error(`Error creating thumbnail, ${stderr}`)
            return
        }

        const fn = `${input.replace(input.split(".").pop(), "")}thumb.jpg`;

        // fn.replace removes the path (just gets filename)
        fs.rename(fn, path.join(config.previewLocation, fn.replace(/^.*[\\/]/, '')), (err) => {
            if (err) return console.error(err)
            cb(path.join(config.previewLocation, fn.replace(/^.*[\\/]/, '')))
        })
    })
}

function generateJPG(input, output) {
    exec(`magick "${input}" "${output}"`, (err, stdout, stderr) => {
        // this one is fast, can be used for updating previews after changes to PPM are made
        // higher quality (bigger file size tho), keeps all details and more simialr to what the changes will look like after photo export.
        if (err) {
            console.error(`Error converting to JPEG: ${stderr}`);
            return;
        }
    })
}