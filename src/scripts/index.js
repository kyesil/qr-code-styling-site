import QrCodeStyling from "qr-code-styling";
import NodesBinder from "./nodes-binder";
import { getSrcFromFile } from "./tools";

import { getFormData, setFormData, toBase64 } from "./formutil";
const NODE_KEY = "data-node";

const form = document.getElementById("form");
const descriptionContainer = document.getElementById("qr-description");



const json = localStorage.getItem("qr-code-form");
const formdata = json && json !== "undefined" ? JSON.parse(json) : null;


setFormData(form, formdata, NODE_KEY);

const nodesBinder = new NodesBinder({
    root: form,
    nodekey: NODE_KEY
});
const initState = nodesBinder.getState();


delete initState.dotsOptions.gradient;

const qrCode = new QrCodeStyling({
    ...initState,
    image: formdata ? formdata["form-image-file"] ?? null : "/assets/linux.png",
});
updateText(initState.text);

function updateDescriptionContainerBackground(backgroundColor, qrColor) {
    let leftColor, rightColor;

    if (getPerceptualBrightness(backgroundColor) > getPerceptualBrightness(qrColor)) {
        leftColor = qrColor;
        rightColor = backgroundColor;
    } else {
        leftColor = backgroundColor;
        rightColor = qrColor;
    }

    descriptionContainer.style["background-image"] = `linear-gradient(90deg, #000 0%, ${leftColor} 50%, ${rightColor} 100%)`;
}

function getPerceptualBrightness(color) {

    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 6), 16);

    return r + g + b;
}
async function updateText(text, pos = "bottom") {
    await qrCode._canvasDrawingPromise; // canvasın çizilmesini bekle
    const canvas = qrCode._domCanvas;
    const ctx = canvas.getContext("2d");
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const qrwith = canvas.width;
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    if (pos === "right")
        canvas.width += qrwith; // 400
    else canvas.height += 50; // 400 
    ctx.fillStyle = qrCode._options.backgroundOptions.color || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);

    ctx.fillStyle = "black";
    ctx.baseAlign = "top";
    let x = 0, y = 0;
    if (pos === "right") {
        ctx.font = "50px Roboto";
        x = canvas.width / 2 + 40;
        y = 70;
        // ctx.textAlign = "center";
        let len = text.length;
        if (len > 36)
            text = text.substring(0, 36)
        if (len > 13)
            ctx.font = "italic " + (50 - (len - 14) * 2.5) + "px Roboto";

    } else{
        x = canvas.width / 2;
        y = canvas.height - 20;
        ctx.font = "italic 40px Roboto";
        ctx.textAlign = "center";
     
    }
    const tt = ctx.measureText(text); // TextMetrics object
    tt.width; // 16;
    console.log("text mesure", tt);
    ctx.fillText(text, x, y);


    //altına
    // await qrCode._canvasDrawingPromise; // canvasın çizilmesini bekle
    // const canvas = qrCode._domCanvas;
    // const ctx = canvas.getContext("2d");
    // const tempCanvas = document.createElement('canvas');
    // const tempCtx = tempCanvas.getContext('2d');
    // tempCanvas.width = canvas.width;
    // tempCanvas.height = canvas.height;
    // tempCtx.drawImage(canvas, 0, 0);
    // ctx.drawImage(tempCanvas, 0, 0);
    // const x = canvas.width / 2;
    // const y = canvas.height - 10;
    // ctx.textAlign = "center";
    // ctx.baseAlign = "top";
    // ctx.font = "22px Roboto";
    // const textBottom = text;
    // ctx.fillText(textBottom, x, y);
}
updateDescriptionContainerBackground(initState.dotsOptions.color, initState.backgroundOptions.color);

nodesBinder.onStateUpdate(async ({ field, data }) => {
    const { image, imageUrl, dotsOptionsHelper, cornersSquareOptionsHelper, cornersDotOptionsHelper, backgroundOptionsHelper, ...state } = nodesBinder.getState();

    updateDescriptionContainerBackground(state.dotsOptions.color, state.backgroundOptions.color);

    // if (field === "text") {
    //     console.log("text changed", data);
    //     qrCode.update();

    //     return
    // }

    if (field === "image") {
        if (data && data[0]) {
            getSrcFromFile(data[0], result => {
                qrCode.update({
                    image: result
                });
            });
        } else {
            qrCode.update({
                image: null
            });
        }
    }

    if (field === "dotsOptionsHelper.colorType.gradient" && data) {
        const showElements = document.getElementsByClassName("dotsOptionsHelper.colorType.gradient")
        const hideElements = document.getElementsByClassName("dotsOptionsHelper.colorType.single")

        Array.from(showElements).forEach((element) => {
            element.style.visibility = "visible";
            element.style.height = "auto";
        });

        Array.from(hideElements).forEach((element) => {
            element.style.visibility = "hidden";
            element.style.height = "0";
        });

        qrCode.update({
            dotsOptions: {
                color: undefined,
                gradient: {
                    type: dotsOptionsHelper.gradient.linear ? "linear" : "radial",
                    rotation: dotsOptionsHelper.gradient.rotation / 180 * Math.PI,
                    colorStops: [{
                        offset: 0,
                        color: dotsOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: dotsOptionsHelper.gradient.color2
                    }]
                }
            }
        });
        return;
    }

    if (field === "dotsOptionsHelper.colorType.single" && data) {
        const showElements = document.getElementsByClassName("dotsOptionsHelper.colorType.single")
        const hideElements = document.getElementsByClassName("dotsOptionsHelper.colorType.gradient")

        Array.from(showElements).forEach((element) => {
            element.style.visibility = "visible";
            element.style.height = "auto";
        });

        Array.from(hideElements).forEach((element) => {
            element.style.visibility = "hidden";
            element.style.height = "0";
        });

        qrCode.update({
            dotsOptions: {
                color: state.dotsOptions.color,
                gradient: null
            }
        });
        return;
    }

    if (field === "dotsOptionsHelper.gradient.linear" && data) {
        qrCode.update({
            dotsOptions: {
                gradient: {
                    type: "linear"
                }
            }
        });
        return;
    }

    if (field === "dotsOptionsHelper.gradient.radial" && data) {
        qrCode.update({
            dotsOptions: {
                gradient: {
                    type: "radial"
                }
            }
        });
        return;
    }

    if (field === "dotsOptionsHelper.gradient.color1") {
        qrCode.update({
            dotsOptions: {
                gradient: {
                    colorStops: [{
                        offset: 0,
                        color: data
                    }, {
                        offset: 1,
                        color: dotsOptionsHelper.gradient.color2
                    }]
                }
            }
        });
        return;
    }

    if (field === "dotsOptionsHelper.gradient.color2") {
        qrCode.update({
            dotsOptions: {
                gradient: {
                    colorStops: [{
                        offset: 0,
                        color: dotsOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: data
                    }]
                }
            }
        });
        return;
    }

    if (field === "dotsOptionsHelper.gradient.rotation") {
        qrCode.update({
            dotsOptions: {
                gradient: {
                    rotation: dotsOptionsHelper.gradient.rotation / 180 * Math.PI,
                }
            }
        });
        return;
    }


    if (field === "cornersSquareOptionsHelper.colorType.gradient" && data) {
        const showElements = document.getElementsByClassName("cornersSquareOptionsHelper.colorType.gradient")
        const hideElements = document.getElementsByClassName("cornersSquareOptionsHelper.colorType.single")

        Array.from(showElements).forEach((element) => {
            element.style.visibility = "visible";
            element.style.height = "auto";
        });

        Array.from(hideElements).forEach((element) => {
            element.style.visibility = "hidden";
            element.style.height = "0";
        });

        qrCode.update({
            cornersSquareOptions: {
                color: undefined,
                gradient: {
                    type: cornersSquareOptionsHelper.gradient.linear ? "linear" : "radial",
                    rotation: cornersSquareOptionsHelper.gradient.rotation / 180 * Math.PI,
                    colorStops: [{
                        offset: 0,
                        color: cornersSquareOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: cornersSquareOptionsHelper.gradient.color2
                    }]
                }
            }
        });
        return;
    }

    if (field === "cornersSquareOptionsHelper.colorType.single" && data) {
        const showElements = document.getElementsByClassName("cornersSquareOptionsHelper.colorType.single")
        const hideElements = document.getElementsByClassName("cornersSquareOptionsHelper.colorType.gradient")

        Array.from(showElements).forEach((element) => {
            element.style.visibility = "visible";
            element.style.height = "auto";
        });

        Array.from(hideElements).forEach((element) => {
            element.style.visibility = "hidden";
            element.style.height = "0";
        });

        qrCode.update({
            cornersSquareOptions: {
                color: state.cornersSquareOptions.color,
                gradient: null
            }
        });
        return;
    }

    if (field === "cornersSquareOptionsHelper.gradient.linear" && data) {
        qrCode.update({
            cornersSquareOptions: {
                gradient: {
                    type: "linear"
                }
            }
        });
        return;
    }

    if (field === "cornersSquareOptionsHelper.gradient.radial" && data) {
        qrCode.update({
            cornersSquareOptions: {
                gradient: {
                    type: "radial"
                }
            }
        });
        return;
    }

    if (field === "cornersSquareOptionsHelper.gradient.color1") {
        qrCode.update({
            cornersSquareOptions: {
                gradient: {
                    colorStops: [{
                        offset: 0,
                        color: data
                    }, {
                        offset: 1,
                        color: cornersSquareOptionsHelper.gradient.color2
                    }]
                }
            }
        });
        return;
    }

    if (field === "cornersSquareOptionsHelper.gradient.color2") {
        qrCode.update({
            cornersSquareOptions: {
                gradient: {
                    colorStops: [{
                        offset: 0,
                        color: cornersSquareOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: data
                    }]
                }
            }
        });
        return;
    }

    if (field === "cornersSquareOptionsHelper.gradient.rotation") {
        qrCode.update({
            cornersSquareOptions: {
                gradient: {
                    rotation: cornersSquareOptionsHelper.gradient.rotation / 180 * Math.PI,
                }
            }
        });
        return;
    }

    if (field === "cornersDotOptionsHelper.colorType.gradient" && data) {
        const showElements = document.getElementsByClassName("cornersDotOptionsHelper.colorType.gradient")
        const hideElements = document.getElementsByClassName("cornersDotOptionsHelper.colorType.single")

        Array.from(showElements).forEach((element) => {
            element.style.visibility = "visible";
            element.style.height = "auto";
        });

        Array.from(hideElements).forEach((element) => {
            element.style.visibility = "hidden";
            element.style.height = "0";
        });

        qrCode.update({
            cornersDotOptions: {
                color: undefined,
                gradient: {
                    type: cornersDotOptionsHelper.gradient.linear ? "linear" : "radial",
                    rotation: cornersDotOptionsHelper.gradient.rotation / 180 * Math.PI,
                    colorStops: [{
                        offset: 0,
                        color: cornersDotOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: cornersDotOptionsHelper.gradient.color2
                    }]
                }
            }
        });
        return;
    }

    if (field === "cornersDotOptionsHelper.colorType.single" && data) {
        const showElements = document.getElementsByClassName("cornersDotOptionsHelper.colorType.single")
        const hideElements = document.getElementsByClassName("cornersDotOptionsHelper.colorType.gradient")

        Array.from(showElements).forEach((element) => {
            element.style.visibility = "visible";
            element.style.height = "auto";
        });

        Array.from(hideElements).forEach((element) => {
            element.style.visibility = "hidden";
            element.style.height = "0";
        });

        qrCode.update({
            cornersDotOptions: {
                color: state.cornersDotOptions.color,
                gradient: null
            }
        });
        return;
    }

    if (field === "cornersDotOptionsHelper.gradient.linear" && data) {
        qrCode.update({
            cornersDotOptions: {
                gradient: {
                    type: "linear"
                }
            }
        });
        return;
    }

    if (field === "cornersDotOptionsHelper.gradient.radial" && data) {
        qrCode.update({
            cornersDotOptions: {
                gradient: {
                    type: "radial"
                }
            }
        });
        return;
    }

    if (field === "cornersDotOptionsHelper.gradient.color1") {
        qrCode.update({
            cornersDotOptions: {
                gradient: {
                    colorStops: [{
                        offset: 0,
                        color: data
                    }, {
                        offset: 1,
                        color: cornersDotOptionsHelper.gradient.color2
                    }]
                }
            }
        });
        return;
    }

    if (field === "cornersDotOptionsHelper.gradient.color2") {
        qrCode.update({
            cornersDotOptions: {
                gradient: {
                    colorStops: [{
                        offset: 0,
                        color: cornersDotOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: data
                    }]
                }
            }
        });
        return;
    }

    if (field === "cornersDotOptionsHelper.gradient.rotation") {
        qrCode.update({
            cornersDotOptions: {
                gradient: {
                    rotation: cornersDotOptionsHelper.gradient.rotation / 180 * Math.PI,
                }
            }
        });
        return;
    }



    if (field === "backgroundOptionsHelper.colorType.gradient" && data) {
        const showElements = document.getElementsByClassName("backgroundOptionsHelper.colorType.gradient")
        const hideElements = document.getElementsByClassName("backgroundOptionsHelper.colorType.single")

        Array.from(showElements).forEach((element) => {
            element.style.visibility = "visible";
            element.style.height = "auto";
        });

        Array.from(hideElements).forEach((element) => {
            element.style.visibility = "hidden";
            element.style.height = "0";
        });

        qrCode.update({
            backgroundOptions: {
                color: undefined,
                gradient: {
                    type: backgroundOptionsHelper.gradient.linear ? "linear" : "radial",
                    rotation: backgroundOptionsHelper.gradient.rotation / 180 * Math.PI,
                    colorStops: [{
                        offset: 0,
                        color: backgroundOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: backgroundOptionsHelper.gradient.color2
                    }]
                }
            }
        });
        return;
    }

    if (field === "backgroundOptionsHelper.colorType.single" && data) {
        const showElements = document.getElementsByClassName("backgroundOptionsHelper.colorType.single")
        const hideElements = document.getElementsByClassName("backgroundOptionsHelper.colorType.gradient")

        Array.from(showElements).forEach((element) => {
            element.style.visibility = "visible";
            element.style.height = "auto";
        });

        Array.from(hideElements).forEach((element) => {
            element.style.visibility = "hidden";
            element.style.height = "0";
        });

        qrCode.update({
            backgroundOptions: {
                color: state.backgroundOptions.color,
                gradient: null
            }
        });
        return;
    }

    if (field === "backgroundOptionsHelper.gradient.linear" && data) {
        qrCode.update({
            backgroundOptions: {
                gradient: {
                    type: "linear"
                }
            }
        });
        return;
    }

    if (field === "backgroundOptionsHelper.gradient.radial" && data) {
        qrCode.update({
            backgroundOptions: {
                gradient: {
                    type: "radial"
                }
            }
        });
        return;
    }

    if (field === "backgroundOptionsHelper.gradient.color1") {
        qrCode.update({
            backgroundOptions: {
                gradient: {
                    colorStops: [{
                        offset: 0,
                        color: data
                    }, {
                        offset: 1,
                        color: backgroundOptionsHelper.gradient.color2
                    }]
                }
            }
        });
        return;
    }

    if (field === "backgroundOptionsHelper.gradient.color2") {
        qrCode.update({
            backgroundOptions: {
                gradient: {
                    colorStops: [{
                        offset: 0,
                        color: backgroundOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: data
                    }]
                }
            }
        });
        return;
    }

    if (field === "backgroundOptionsHelper.gradient.rotation") {
        qrCode.update({
            backgroundOptions: {
                gradient: {
                    rotation: backgroundOptionsHelper.gradient.rotation / 180 * Math.PI,
                }
            }
        });
        return;
    }
    qrCode.update(state);
    await updateText(state.text,state.textpos);
    const form = document.getElementById("form");
    const fdata = await getFormData(form, NODE_KEY);
    const imagefile = document.getElementById("form-image-file");
    if (imagefile.files && imagefile.files.length > 0) {
        fdata["form-image-file"] = await toBase64(imagefile.files[0]);
    }
    localStorage.setItem("qr-code-form", JSON.stringify(fdata));
});

const qrContainer = document.getElementById("qr-code-generated");

qrCode.append(qrContainer);

document.getElementById("button-cancel").onclick = () => {
    nodesBinder.setState({ image: new DataTransfer().files });
};

document.getElementById("button-clear-corners-square-color").onclick = () => {
    const state = nodesBinder.getState();
    nodesBinder.setState({
        cornersSquareOptions: {
            color: state.dotsOptions.color
        }
    });
};

document.getElementById("button-clear-corners-dot-color").onclick = () => {
    const state = nodesBinder.getState();
    nodesBinder.setState({
        cornersDotOptions: {
            color: state.dotsOptions.color
        }
    });
};

document.getElementById("qr-download").onclick = () => {
    const extension = document.getElementById("qr-extension").value;
    qrCode.download({ extension, name: "qr-code-styling" });
};


function download(filename, text) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}


document.getElementById("export-options").addEventListener("click", async () => {
    const form = document.getElementById("form");
    const fdata = await getFormData(form, NODE_KEY);
    const imagefile = document.getElementById("form-image-file");
    if (imagefile.files && imagefile.files.length > 0) {
        fdata["form-image-file"] = await toBase64(imagefile.files[0]);
    }

    const blob = new Blob([JSON.stringify(fdata)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-data.json';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
});


document.getElementById("import-options").addEventListener("click", () => {
    const form = document.getElementById("form");
    let importInput = document.getElementById("import-options-input");
    if (!importInput) {
        importInput = document.createElement("input");
        importInput.type = "file";
        importInput.accept = ".json,application/json";
        importInput.style.display = "none";
        importInput.id = "import-options-input";
        importInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = evt => {
                try {
                    const json = JSON.parse(evt.target.result);
                    setFormData(form, json, NODE_KEY);
                } catch (err) {
                    alert('Invalid JSON file');
                }
            };
            reader.readAsText(file);
            fileInput.value = '';
        });
        document.body.appendChild(importInput);
    }

    importInput.value = ""; // reset
    importInput.click();
});

//Accordion
let acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
    if (acc[i].classList.contains("accordion--open")) {
        continue;
    }

    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");

        const panel = this.nextElementSibling;
        if (panel.style.display === "grid") {
            panel.style.display = "none";
        } else {
            panel.style.display = "grid";
        }
    });
}
