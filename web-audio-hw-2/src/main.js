/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as audio from './audio.js';
import * as utils from './utils.js';
import * as canvas from './visualizer.js';

const drawParams = {
    showGradient: true,
    showBars: true,
    showCircles: true,
    showNoise: true
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/New Adventure Theme.mp3"
});

function init() {
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}

function setupUI(canvasElement) {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");
    const gradientCB = document.querySelector("#gradientCB");
    const barsCB = document.querySelector("#barsCB");
    const circlesCB = document.querySelector("#circlesCB");
    const noiseCB = document.querySelector("#noiseCB");

    gradientCB.checked = true;
    barsCB.checked = true;
    circlesCB.checked = true;
    noiseCB.checked = true;

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };

    gradientCB.onchange = e => {
        drawParams.showGradient = gradientCB.checked;
    };

    barsCB.onchange = e => {
        drawParams.showBars = barsCB.checked;
    };

    circlesCB.onchange = e => {
        drawParams.showCircles = circlesCB.checked;
    };

    noiseCB.onchange = e => {
        drawParams.showNoise = noiseCB.checked;
    };

    // hooking up the button
    playButton.onclick = e => {
        console.log(`audioCtx,state before = ${audio.audioCtx.stat}`);

        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        console.log(`audioCtx,state after = ${audio.audioCtx.stat}`);
        if (e.target.dataset.playing == "no") {
            audio.playCurrentSound();
            e.target.dataset.playing = "yes";
        } else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";
        }
    }

    // Hookup volume
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    volumeSlider.oninput = e => {
        audio.setVolume(e.target.value);
        volumeLabel.innerHTML = Math.round(e.target.value / 2 * 100);
    }

    volumeSlider.dispatchEvent(new Event("input"));

    // Hookup track
    let trackSelect = document.querySelector("#trackSelect");

    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        if (playButton.dataset.playing == "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    }
} // end setupUI

function loop() {
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
    /*
      /* NOTE: This is temporary testing code that we will delete in Part II
      // 1) create a byte array (values of 0-255) to hold the audio data
      // normally, we do this once when the program starts up, NOT every frame
      let audioData = new Uint8Array(audio.analyserNode.fftSize / 2);

      // 2) populate the array of audio data *by reference* (i.e. by its address)
      audio.analyserNode.getByteFrequencyData(audioData);

      // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
      console.log(audioData);

      console.log("-----Audio Stats-----");
      let totalLoudness = audioData.reduce((total, num) => total + num);
      let averageLoudness = totalLoudness / (audio.analyserNode.fftSize / 2);
      let minLoudness = Math.min(...audioData); // ooh - the ES6 spread operator is handy!
      let maxLoudness = Math.max(...audioData); // ditto!
      // Now look at loudness in a specific bin
      // 22050 kHz divided by 128 bins = 172.23 kHz per bin
      // the 12th element in array represents loudness at 2.067 kHz
      let loudnessAt2K = audioData[11];
      console.log(`averageLoudness = ${averageLoudness}`);
      console.log(`minLoudness = ${minLoudness}`);
      console.log(`maxLoudness = ${maxLoudness}`);
      console.log(`loudnessAt2K = ${loudnessAt2K}`);
      console.log("---------------------");
    */
}

export { init };