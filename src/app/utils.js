const { exec } = require('child_process');
const fs = require("fs")
const path = require("path")

const config = {
    catalogLocation: path.join(__dirname, "../", "catalog"),
    previewLocation: path.join(__dirname, "../previews")
}

function generatePPM(input, cb) {
    exec(`dcraw -w -o 1 -q 3 "${input}"`, async (err, stdout, stderr) => {
        // this command takes the longest- should be used for each photo once when imported, then just keep the PPM for editing previews
        if (err) {
            console.error(`Error converting RAW file: ${stderr}`);
            return;
        }

        const fn = `${input.replace(input.split(".").pop(), "")}ppm`;

        // fn.replace removes the path (just gets filename)
        fs.rename(fn, path.join(config.catalogLocation, fn.replace(/^.*[\\/]/, '')), (err) => {
            if (err) return console.error(err)
            cb(path.join(config.catalogLocation, fn.replace(/^.*[\\/]/, '')))
        })
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

function generateJPG(input, output, cb) {
    exec(`magick "${input}" "${output}"`, (err, stdout, stderr) => {
        // this one is fast, can be used for updating previews after changes to PPM are made
        // higher quality (bigger file size tho), keeps all details and more simialr to what the changes will look like after photo export.
        if (err) {
            console.error(`Error converting to JPEG: ${stderr}`);
            return;
        }
        cb()
    })
}

function createHistogram() {
    const barCount = 100;
    const imageHeight = 200;

    createCanvas(400, 400);
    background(255);

    img.resize(0, imageHeight);
    imageMode(CENTER);
    image(img, width / 2, imageHeight / 2);
    img.loadPixels();

    const histogram = new Array(barCount).fill(0);

    for (let x = 0; x < img.width; x += 5) {
        for (let y = 0; y < img.height; y += 5) {
            const loc = (x + y * img.width) * 4;
            const r = img.pixels[loc];
            const g = img.pixels[loc + 1];
            const b = img.pixels[loc + 2];
            const a = img.pixels[loc + 3];
            const barIndex = floor(barCount * b / 255);
            histogram[barIndex]++;
        }
    }

    fill(100, 100, 300);
    strokeWeight(0);

    const maxCount = max(histogram);

    const barWidth = width / barCount;
    const histogramHeight = height - imageHeight;

    for (let i = 0; i < barCount; i++) {
        const count = histogram[i];
        const y1 = round(map(count, 0, maxCount, height, imageHeight));
        const y2 = height;
        const x1 = i * barWidth;
        const x2 = x1 + barWidth;
        rect(x1, y1, barWidth, height - y1);
    }
}  