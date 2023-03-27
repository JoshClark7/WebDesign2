let ctx;
let paused;
let createRect;
let createCircle;
let createLine;
let canvas;

import { getRandomColor } from "./utils.js";
import { getRandomInt } from "./utils.js";
import { drawCircle } from "./canvas-utils.js";
import { drawLine } from "./canvas-utils.js";
import { drawRect } from "./canvas-utils.js";

const init = () => {
    console.log("page loaded!");
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    paused = false;
    createRect = true;
    createCircle = true;
    createLine = true;
    setupUI();
    update();

    // I removed the original drawing code in init a long time ago as it seemed useless and took up a lot of space
}

const drawRandomRect = (ctx) => {
    drawRect(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(0, 100), getRandomInt(0, 100), getRandomColor(), getRandomInt(-10, 10), getRandomColor())
}

const drawRandomCircle = (ctx) => {
    drawCircle(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(0, 100), getRandomColor(), getRandomInt(-10, 10), getRandomColor())
}

const drawRandomLine = (ctx) => {
    drawLine(ctx, getRandomInt(-100, 740), getRandomInt(-100, 580), getRandomInt(-100, 740), getRandomInt(-100, 580), getRandomInt(1, 10), getRandomColor())
}

const drawRandom = (ctx) => {
    let i = getRandomInt(0, 2);
    switch (i) {
        case 0:
            if (createRect) drawRandomRect(ctx)
            break;
        case 1:
            if (createCircle) drawRandomCircle(ctx)
            break;
        case 2:
            if (createLine) drawRandomLine(ctx)
            break;
    }
}

const update = () => {
    if (paused) {
        return;
    }
    requestAnimationFrame(update);
    drawRandom(ctx);
}

const canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX, mouseY);
    for (let i = 0; i < 10; i++) {
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let radius = getRandomInt(1, 100);
        drawCircle(ctx, x, y, radius, getRandomColor())
    }
}

const setupUI = () => {
    document.querySelector("#btn-Pause").onclick = (e) => {
        paused = true;
    };
    document.querySelector("#btn-Play").onclick = (e) => {
        if (paused) {
            paused = false;
            update();
        }
    };
    document.querySelector("#btn-Clear").onclick = (e) => {
        ctx.fillStyle = 'white';
        ctx.beginPath()
        ctx.rect(0, 0, 1000, 1000);
        ctx.fill();
        ctx.closePath();
    };
    document.querySelector("#cb-Rectangles").onclick = (e) => {
        createRect = e.target.checked;
    };
    document.querySelector("#cb-Circles").onclick = (e) => {
        createCircle = e.target.checked;
    };
    document.querySelector("#cb-Lines").onclick = (e) => {
        createLine = e.target.checked;
    };

    canvas.addEventListener('click', canvasClicked);
}

init();