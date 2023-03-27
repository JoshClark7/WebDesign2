// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element, sourceNode, analyserNode, gainNode, trebleNode, bassNode, distortionFilter;

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    gain: 0.5,
    numSamples: 256
});


// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
const audioData = new Uint8Array(DEFAULTS.numSamples / 2);


// **Next are "public" methods - we are going to export all of these at the bottom of this file**
const setupWebaudio = (filepath) => {
    element = new Audio();

    // 1 - The || is because WebAudio has not been standardized across browsers yet
    audioCtx = new(window.AudioContext || window.webkitAudioContex);

    // 3 - have it point at a sound file
    loadSoundFile(filepath);

    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // 5 - create an analyser node
    analyserNode = audioCtx.createAnalyser() // note the UK spelling of "Analyser"

    /*
    // 6
    We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
    across the sound spectrum.

    If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
    the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
    the amplitude of that frequency.
    */

    trebleNode = audioCtx.createBiquadFilter();
    trebleNode.type = "highshelf";

    bassNode = audioCtx.createBiquadFilter();
    bassNode.type = "lowshelf";

    distortionFilter = audioCtx.createWaveShaper();

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    // 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(gainNode);
    gainNode.connect(trebleNode);
    trebleNode.connect(bassNode);
    bassNode.connect(distortionFilter);
    distortionFilter.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);

    document.querySelector("#cb-treble").checked = false;
    document.querySelector("#cb-bass").checked = false;
    document.querySelector("#cb-distortion").checked = false;
    toggleBass();
    toggleTreble();
    toggleDistortion();
}

const loadSoundFile = (filePath) => {
    element.src = filePath;
}

const playCurrentSound = () => {
    element.play();
}

const pauseCurrentSound = () => {
    element.pause();
}

const setVolume = (value) => {
    // Its so loud
    value = Number(value) / 5; // make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}

const toggleTreble = () => {
    if (document.querySelector("#cb-treble").checked) {
        trebleNode.frequency.setValueAtTime(1000, audioCtx.currentTime);
        let val = Number(document.querySelector("#slider-treble").value) / 100 * 25;
        trebleNode.gain.setValueAtTime(val, audioCtx.currentTime);
    } else {
        trebleNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

const toggleBass = () => {
    if (document.querySelector("#cb-bass").checked) {
        bassNode.frequency.setValueAtTime(1000, audioCtx.currentTime);
        let val = Number(document.querySelector("#slider-bass").value) / 100 * 25;
        bassNode.gain.setValueAtTime(val, audioCtx.currentTime);
    } else {
        bassNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

const toggleDistortion = () => {
    if (document.querySelector("#cb-distortion").checked) {
        distortionFilter.curve = null;
        let val = Number(document.querySelector("#slider-distortion").value) / 100 * 25;
        distortionFilter.curve = makeDistortionCurve(val);
    } else {
        distortionFilter.curve = null;
    }
}

// from: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
const makeDistortionCurve = (amount = 20) => {
    let n_samples = 256,
        curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}

export { audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode, toggleTreble, toggleBass, toggleDistortion }