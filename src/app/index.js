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
        await generatePPM(files[i], (p) => {
            console.log("gen jpg", p)
            generateJPG(p, p.replace("ppm", "jpg"))
        })
    }
}

document.querySelector("#tbo-dev").addEventListener("click", () => {
    document.querySelectorAll(".pannel").forEach(el => el.style.display = "none")
    document.querySelector(".develop-pannel").style.display = "block"
})

document.querySelector("#tbo-lib").addEventListener("click", () => {
    document.querySelectorAll(".pannel").forEach(el => el.style.display = "none")
    document.querySelector(".library-pannel").style.display = "block"
})

const image = document.querySelector("#image-dv-main");
let zoomScale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

image.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        
        const rect = image.getBoundingClientRect();
        const mouseX = e.clientX - rect.left; 
        const mouseY = e.clientY - rect.top;
        
        const oldZoomScale = zoomScale;
        zoomScale += e.deltaY * -0.01;
        zoomScale = Math.min(Math.max(0.5, zoomScale), 3);

        translateX -= (mouseX - rect.width / 2) * (zoomScale - oldZoomScale) / oldZoomScale;
        translateY -= (mouseY - rect.height / 2) * (zoomScale - oldZoomScale) / oldZoomScale;

        updateTransform();

        image.style.cursor = zoomScale > 1.3 ? "grab" : "default";
    }
});

image.addEventListener('mousedown', (e) => {
    if (zoomScale > 1.3) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        image.style.cursor = "grabbing";
    }
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        translateX += dx;
        translateY += dy;

        startX = e.clientX;
        startY = e.clientY;

        updateTransform();
    }
});

window.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        image.style.cursor = zoomScale > 1.3 ? "grab" : "default";
    }
});

function updateTransform() {
    image.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${zoomScale})`;
}


document.querySelector("#image-dv-main").addEventListener("click", (e) => {
    if (e.detail == 2) {
        zoomScale = 1
        e.target.style.transform = `translate(-50%, -50%) scale(${zoomScale})`
        startX = 0
        startY = 0
        translateX = 0
        translateY = 0
    }
})