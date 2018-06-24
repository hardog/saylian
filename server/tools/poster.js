'use strict';

const fs = require('fs');
const path = require('path');
const images = require('images');
const TextToSVG = require('text-to-svg');
const svg2png = require("svg2png");

const textToSVG = TextToSVG.loadSync(path.resolve('./assets/fonts/文泉驿微米黑.ttf'));

const sourceImg = images('./assets/tpls/poster-tpl.jpg');
const sWidth = sourceImg.width();
const sHeight = sourceImg.height();

const svg1 = textToSVG.getSVG('hardog', {
  x: 0,
  y: 0,
  fontSize: 24,
  anchor: 'top'
});

svg2png(svg1)
.then((buffer) => {
  let targetPath = './assets/hardog-poster.jpg';
  let ret = fs.writeFileSync(targetPath, buffer);

  let targetImg = images(targetPath);
  let tWidth = targetImg.width();
  let tHeight = targetImg.height();
  let offsetX = (sWidth - tWidth) / 2;
  let offsetY = 200;

  images(sourceImg)
    .draw(targetImg, offsetX, offsetY)
    .save('./assets/poster.jpg', { quality: 90 });
})
.catch((e) => console.log(e));
