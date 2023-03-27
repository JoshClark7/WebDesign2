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
    showNoise: false,
    showInvert: false,
    showEmboss: false,
    mode: 2,
    isPlaying: false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/New Adventure Theme.mp3"
});

const init = () => {
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}

const setupUI = (canvasElement) => {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#button-fs");
    const modeButton = document.querySelector("#button-mode");
    const gradientCB = document.querySelector("#cb-gradient");
    const barsCB = document.querySelector("#cb-bars");
    const circlesCB = document.querySelector("#cb-circles");
    const noiseCB = document.querySelector("#cb-noise");
    const invertCB = document.querySelector("#cb-invert");
    const embossCB = document.querySelector("#cb-emboss");
    const playButton = document.querySelector("#button-play");
    const bassCB = document.querySelector("#cb-bass");
    const trebleCB = document.querySelector("#cb-treble");
    const distortionCB = document.querySelector("#cb-distortion");

    gradientCB.checked = true;
    barsCB.checked = true;
    circlesCB.checked = true;
    noiseCB.checked = false;

    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };

    modeButton.onclick = e => {
        if (drawParams.mode == 1) {
            drawParams.mode = 2;
        } else if (drawParams.mode == 2) {
            drawParams.mode = 1;
        }
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

    invertCB.onchange = e => {
        drawParams.showInvert = invertCB.checked;
    };

    embossCB.onchange = e => {
        drawParams.showEmboss = embossCB.checked;
    };

    bassCB.onchange = e => {
        audio.toggleBass();
    };

    trebleCB.onchange = e => {
        audio.toggleTreble();
    };

    distortionCB.onchange = e => {
        audio.toggleDistortion();
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
            drawParams.isPlaying = true;
        } else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";
            drawParams.isPlaying = false;
        }
    }

    let volumeSlider = document.querySelector("#slider-volume");
    let volumeLabel = document.querySelector("#label-volume");
    let bassSlider = document.querySelector("#slider-bass");
    let bassLabel = document.querySelector("#label-bass");
    let trebleSlider = document.querySelector("#slider-treble");
    let trebleLabel = document.querySelector("#label-treble");
    let distortionSlider = document.querySelector("#slider-distortion");
    let distortionLabel = document.querySelector("#label-distortion");

    // volume
    volumeSlider.oninput = e => {
        audio.setVolume(e.target.value);
        volumeLabel.innerHTML = Math.round(e.target.value / 2 * 100);
    }

    volumeSlider.dispatchEvent(new Event("input"));

    // bass
    bassSlider.oninput = e => {
        audio.toggleBass();
        bassLabel.innerHTML = Math.round(e.target.value);
    }

    bassSlider.dispatchEvent(new Event("input"));

    // treble
    trebleSlider.oninput = e => {
        audio.toggleTreble();
        trebleLabel.innerHTML = Math.round(e.target.value);
    }

    trebleSlider.dispatchEvent(new Event("input"));

    // distortion
    distortionSlider.oninput = e => {
        audio.toggleDistortion();
        distortionLabel.innerHTML = Math.round(e.target.value);
    }

    distortionSlider.dispatchEvent(new Event("input"));

    // Hookup track
    let trackSelect = document.querySelector("#select-track");

    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        if (playButton.dataset.playing == "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    }
}

const loop = () => {
    setTimeout(loop);
    canvas.draw(drawParams);
    /*
      // NOTE: This is temporary testing code that we will delete in Part II
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