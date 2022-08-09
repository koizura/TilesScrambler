let img, imageWidth, imageHeight, WIDTH, HEIGHT;
let pixelSize = 10;
let pixelSizeSetting;
function preload() {
    img = loadImage("assets/moon.jpg");
}
function setup() {
    canvasContainer = document.querySelector(".canvas-container");
    pixelSizeSetting = new Setting("#pixelSizeSlider", "#pixelSizeInput", 30);
    
    let canvas = createCanvas(500,500);
    canvas.parent("canvas-container");
    
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

}
function draw() {
    
}
document.querySelectorAll(".drop-zone__input").forEach(inputElement => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", e => {
        inputElement.click();
    });
    inputElement.addEventListener("change", e => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    });

    dropZoneElement.addEventListener("dragover", e => {
        dropZoneElement.classList.add("drop-zone--over");
        e.preventDefault();
        
    });
    ["dragleave", "dragend"].forEach(type => {
        dropZoneElement.addEventListener(type, e => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });
    dropZoneElement.addEventListener("drop", e => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }
        dropZoneElement.classList.remove("drop-zone--over");
    });
});
function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        dropZoneElement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label = file.name;

    if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
            loadImage(reader.result, image => {
                img = image;
                onWindowResize();
                render();
            });
        };
    } else {
        thumbnailElement.style.backgroundImage = null;
    }
}
function render() {
    //image(img, 0, 0, imageWidth, imageHeight);
    pixelSize = pixelSizeSetting.valueNum;
    
    for (let y = 0; y < imageHeight; y += pixelSize) {
        for (let x = 0; x < imageWidth; x += pixelSize) {
            push();
            translate(x + pixelSize/2, y + pixelSize/2);
            const dir = floor(random(0, 4)) * 90;
            rotate(radians(dir));
            image(img, 
                -pixelSize/2, -pixelSize/2, pixelSize, pixelSize, 
                map(x, 0, imageWidth, 0, img.width), map(y, 0, imageHeight, 0, img.height),
                img.width * pixelSize / imageWidth, img.height * pixelSize / imageHeight,
                );
            pop();
        }
    }
}


function onWindowResize() {
    WIDTH = canvasContainer.clientWidth, HEIGHT = canvasContainer.clientHeight;
    const aspectRatio = img.height/img.width;
    imageWidth = WIDTH;
    imageHeight = WIDTH * aspectRatio;
    if (imageHeight > HEIGHT) {
        imageHeight = HEIGHT;
        imageWidth = HEIGHT / aspectRatio;
    }
    resizeCanvas(imageWidth, imageHeight);
    render();
}
class Setting {
    constructor(slider, input, startValue) {
        const _this = this;
        this.slider = document.querySelector(slider);
        this.input = document.querySelector(input);
        this.slider.value = startValue;
        this.input.innerHTML = startValue;
        this.value = startValue;
        this.valueNum = this.slider.valueAsNumber;
        this.slider.oninput = function() { 
            
            _this.input.innerHTML = this.value;
            _this.value = this.value;
            _this.valueNum = this.valueAsNumber;
            render();
        }
    }
}