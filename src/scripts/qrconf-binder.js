
import {  toBase64 } from "./tools";

export async function qrCodeApply({ qrCode, state ,field, data }){
    if (field === "image") {
        if (data && data[0]) {
            const result= await toBase64(data[0])
                qrCode.update({
                    image: result
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
                        color: state.dotsOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: state.dotsOptionsHelper.gradient.color2
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
                        color: state.dotsOptionsHelper.gradient.color2
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
                        color: state.dotsOptionsHelper.gradient.color1
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
                    rotation: state.dotsOptionsHelper.gradient.rotation / 180 * Math.PI,
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
                    type: state.cornersSquareOptionsHelper.gradient.linear ? "linear" : "radial",
                    rotation: state.cornersSquareOptionsHelper.gradient.rotation / 180 * Math.PI,
                    colorStops: [{
                        offset: 0,
                        color: state.cornersSquareOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: state.cornersSquareOptionsHelper.gradient.color2
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
                        color: state.cornersSquareOptionsHelper.gradient.color2
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
                        color: state.cornersSquareOptionsHelper.gradient.color1
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
                    rotation: state.cornersSquareOptionsHelper.gradient.rotation / 180 * Math.PI,
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
                    type: state.cornersDotOptionsHelper.gradient.linear ? "linear" : "radial",
                    rotation: state.cornersDotOptionsHelper.gradient.rotation / 180 * Math.PI,
                    colorStops: [{
                        offset: 0,
                        color: state.cornersDotOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: state.cornersDotOptionsHelper.gradient.color2
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
                        color: state.cornersDotOptionsHelper.gradient.color2
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
                        color: state.cornersDotOptionsHelper.gradient.color1
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
                    rotation: state.cornersDotOptionsHelper.gradient.rotation / 180 * Math.PI,
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
                    type: state.backgroundOptionsHelper.gradient.linear ? "linear" : "radial",
                    rotation: state.backgroundOptionsHelper.gradient.rotation / 180 * Math.PI,
                    colorStops: [{
                        offset: 0,
                        color: state.backgroundOptionsHelper.gradient.color1
                    }, {
                        offset: 1,
                        color: state.backgroundOptionsHelper.gradient.color2
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
                        color: state.backgroundOptionsHelper.gradient.color2
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
                        color: state.backgroundOptionsHelper.gradient.color1
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
                    rotation: state.backgroundOptionsHelper.gradient.rotation / 180 * Math.PI,
                }
            }
        });
        return;
    }
}//qrCodeApply()