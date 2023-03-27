/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;

let arrPulses = [];
let numPulses = 0;

let timer = 0;
let lastUpdate;

const setupCanvas = (canvasElement, analyserNodeRef) => {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: 0, color: "black" }, { percent: .25, color: "black" }, { percent: .5, color: "gray" }, { percent: 1, color: "magenta" }]);
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;

    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);

    lastUpdate = Date.now();

}

const draw = (params = {}) => {

    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
    if (params.mode == 1) {
        analyserNode.getByteFrequencyData(audioData);
    } else if (params.mode == 2) {
        analyserNode.getByteTimeDomainData(audioData)
    }
    // OR
    //analyserNode.getByteTimeDomainData(audioData); // waveform data

    // 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // 3 - draw gradient
    if (params.showGradient) {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    // 4 - draw bars
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;


        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.50)';
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.50)';
        for (let i = 0; i < audioData.length; i++) {
            if (params.mode == 1) {
                ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i] / 2, barWidth, barHeight);
                ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i] / 2, barWidth, barHeight);
            } else if (params.mode == 2) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.50)';
                ctx.fillRect(margin + i * (barWidth + barSpacing), 60 + topSpacing + 128 / 2 - audioData[i], barWidth, barHeight / 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.50)';
                ctx.fillRect(margin + i * (barWidth + barSpacing), 100 + topSpacing + 128 - audioData[i], barWidth, barHeight / 2);
            }
        }
        ctx.restore();
    }

    for (let j = 0; j < numPulses; j++) {
        if (arrPulses[j] != undefined) {
            arrPulses[j].update();
            arrPulses[j].draw(ctx);

            if (arrPulses[j].finished) {
                arrPulses[j] = undefined;
            }
        }
    }

    if (params.isPlaying) {
        let now = Date.now();
        let dt = now - lastUpdate;
        timer += dt / 1000;
        lastUpdate = now;
        ctx.save();
        ctx.globalAlpha = 0.5;
        if (timer >= 0.1) {
            let strength = 5 * (audioData[5] / 255);
            arrPulses[numPulses] = new Pulse(canvasWidth / 2, canvasHeight / 2, strength);
            console.log(strength);
            numPulses++;
            timer = 0;
        }
    }

    // 5 - draw circles
    if (params.showCircles) {
        let maxRadius = canvasHeight / 4
        for (let i = 0; i < audioData.length; i++) {
            let percent = audioData[i] / 255;
            let circleRadius = percent * maxRadius;

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(100, 100, 100, .34 - percent / 3.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 0, 0.10 - percent / 10.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 200, .5 - percent / 5.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * .50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }

    // 6 - bitmap manipulation
    // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
    // regardless of whether or not we are applying a pixel effect
    // At some point, refactor this code so that we are looping though the image data only if
    // it is necessary

    // A) grab all of the pixels on the canvas and put them in the `data` array
    // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // the variable `data` below is a reference to that array 
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {
        // C) randomly change every 20th pixel
        if (Math.random() < 0.05 && params.showNoise) {
            {
                // data[i] is the red channel
                // data[i+1] is the green channel
                // data[i+2] is the blue channel
                // data[i+3] is the alpha channel
                // zero out the red and green and blue channels
                // make the red channel 100% red
                data[i] = data[i + 1] = data[i + 2] = 0;
                data[i] = 255;
            }
        }

        // invert
        if (params.showInvert) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
    }

    // Emboss
    if (params.showEmboss) {
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) {
                continue;
            }
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }

    // D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}

export { setupCanvas, draw };

class Pulse {
    static type = "Pulse";
    constructor(x, y, strength) {
        this.x = x;
        this.y = y;
        this.strength = strength;
        this.timer = 0;
        this.sizeMult = 1;
        this.lastUpdate = Date.now();
        this.finished = false;
    }

    update() {
        let now = Date.now();
        let dt = now - this.lastUpdate;
        this.timer += dt / 1000;
        this.lastUpdate = now;

        if (this.timer > this.strength) {
            this.finished = true;
        }
    }

    draw(ctx) {
        let baseRadius = 50;
        let circleRadius = (baseRadius * this.timer * (this.strength * this.strength / 2));

        ctx.save()
        ctx.beginPath();
        ctx.lineWidth = 7 * this.timer / this.strength;
        ctx.strokeStyle = utils.makeColor(255, 255, 255, (1 - (this.timer / this.strength)));
        ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}