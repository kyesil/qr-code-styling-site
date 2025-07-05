import QrCodeStyling from "qr-code-styling";
import NodesBinder from "./nodes-binder";

import { qrCodeApply } from "./qrconf-binder";

import { getFormData, setFormData } from "./form-util";
import { toBase64 } from "./tools";
import { drawText } from "./canvas-util";
const NODE_KEY = "data-node";

const form = document.getElementById("form");
const descriptionContainer = document.getElementById("qr-description");



const json = localStorage.getItem("qr-code-form");
const formdata = json && json !== "undefined" ? JSON.parse(json) : null;


const inputList = form.querySelectorAll(`[${NODE_KEY}]`);

setFormData(inputList, formdata);

const nodesBinder = new NodesBinder({
    root: form,
    nodekey: NODE_KEY
});
const initState = nodesBinder.getState();


delete initState.dotsOptions.gradient;
let initimg = "/assets/linux.png"
if (formdata)
    initimg = formdata["form-image-file"] === undefined ? null : formdata["form-image-file"];
const qrCode = new QrCodeStyling({
    ...initState,
    image: initimg,
});
await drawText({ qrCode, text: initState.text, pos: initState.textpos, textFontFactor: initState.textFontFactor });

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

updateDescriptionContainerBackground(initState.dotsOptions.color, initState.backgroundOptions.color);

nodesBinder.onStateUpdate(async ({ field, data }) => {
    const state = nodesBinder.getState();
    delete state.image;
    updateDescriptionContainerBackground(state.dotsOptions.color, state.backgroundOptions.color);
    try {
        await qrCodeApply({ qrCode, state, field, data });

        qrCode.update(state);
        await drawText({ qrCode: qrCode, text: state.text, pos: state.textpos, textFontFactor: state.textFontFactor });

        const fdata = await getFormData(inputList);
        const imagefile = document.getElementById("form-image-file");
        if (imagefile.files && imagefile.files.length > 0) {
            fdata["form-image-file"] = await toBase64(imagefile.files[0]);
        } else if (qrCode._options.image) {
            fdata["form-image-file"] = qrCode._options.image;
        }
        localStorage.setItem("qr-code-form", JSON.stringify(fdata));
    } catch (e) {
        console.error("Error updating QR code:", e);
        alert("Error: " + (e.message ?? e));
    }
});

const qrContainer = document.getElementById("qr-code-generated");

qrCode.append(qrContainer);

document.getElementById("button-cancel").onclick = () => {
    nodesBinder.setState({ image: null });
    fdata["form-image-file"]
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



document.getElementById("export-options").addEventListener("click", async () => {
    const fdata = await getFormData(inputList);
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
                    setFormData(inputList, json);
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
