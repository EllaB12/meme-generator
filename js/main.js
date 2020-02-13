'use strict'

var gCanvas;
var gCtx;

var gTxtLinePosition = [{ x: 250, y: 50 }, { x: 250, y: 450 }];

var gIsDraggable = false;

function onInit() {
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
    if (window.innerWidth < 740) resizeCanvas();
    showImg();
    renderImages();

    gCanvas.addEventListener("mouseup", onMouseUp, false);
    gCanvas.addEventListener("mousemove", onMouseMove, false);
    gCanvas.addEventListener("mousedown", onMouseDown, false);
}

function renderImages() {
    var imgs = getImgs();

    var strHtml = imgs.map(img => {
        return `
                <img src="${img.url}" onclick="onUpdateMemeImg(${img.id})">
               `
    })

    var elImgsGallery = document.querySelector('.image-gallery');
    elImgsGallery.innerHTML = strHtml.join('');

}

function renderCanvas() {
    showImg();
}

function showImg() {
    var img = new Image()
    img.src = getMemeImg().url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        addText()
    }
}

function addText() {
    var meme = getMeme();
    drawText(meme);
}

function drawText(meme) {
    var lines = meme.lines;

    lines.forEach((line, Idx) => {
        var x = gTxtLinePosition[Idx].x;
        var y = gTxtLinePosition[Idx].y;
        gCtx.lineWidth = '2'
        gCtx.strokeStyle = 'black'
        gCtx.fillStyle = line.color
        gCtx.font = line.size + 'px ' + line.font;
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt, x, y)
        gCtx.strokeText(line.txt, x, y)
    });
}

function onWriteText() {
    var txt = document.querySelector('.text-input').value;
    if (gCtx.measureText(txt).width < gCanvas.width || gCtx.measureText(txt).width === 1) {
        updateMemeText(txt);
        renderCanvas();
    }
}

function onUpdateMemeImg(imgId) {
    document.querySelector('.image-gallery').style.display = 'none';
    document.querySelector('.canvas-container').style.display = 'block';
    document.querySelector('.text-input').style.display = 'block';
    document.querySelector('.btn-container').style.display = 'block';
    document.querySelector('.main-content').classList.add('main-bkg');
    updateMemeImg(imgId);
    renderCanvas();
}

function onIncreaseTxt() {
    var meme = getMeme();
    var lineIndex = meme.selectedLineIdx;
    var txtSize = meme.lines[lineIndex].size;
    IncreaseTxtSize(txtSize);
    renderCanvas();
}

function onDecreaseTxt() {
    var meme = getMeme();
    var lineIndex = meme.selectedLineIdx;
    var txtSize = meme.lines[lineIndex].size;
    decreaseTxtSize(txtSize);
    renderCanvas();
}

function onUpTxt() {
    var lineIdx = getSelectedLineIdx();
    gTxtLinePosition[lineIdx].y--;
    gTxtLinePosition[lineIdx].y--;
    renderCanvas();
}

function onDownTxt() {
    var lineIdx = getSelectedLineIdx();
    gTxtLinePosition[lineIdx].y++;
    gTxtLinePosition[lineIdx].y++;
    renderCanvas();
}

function onSwitchLine() {
    switchLine()
    renderCanvas();
}

function onAlignLeft() {
    var currIdxLine = getSelectedLineIdx();
    var x = 10;
    gTxtLinePosition[currIdxLine].x = x;

    updateAlignText('left');
    renderCanvas();
}

function onAlignCenter() {
    var currIdxLine = getSelectedLineIdx();
    var x = gCanvas.width / 2;
    gTxtLinePosition[currIdxLine].x = x;

    updateAlignText('center');
    renderCanvas();
}

function onAlignRight() {
    var currIdxLine = getSelectedLineIdx();
    var x = gCanvas.width - 10;
    gTxtLinePosition[currIdxLine].x = x;

    updateAlignText('right');
    renderCanvas();
}

function onChangeTxtColor() {
    var colorValue = document.querySelector('#valueInput').value;
    changeTxtColor('#' + colorValue);
    renderCanvas();
}

function resizeCanvas() {
    gCanvas.width = 400;
    gCanvas.height = 400;
}

function onRemoveLine() {
    var currLineIdx = getSelectedLineIdx();
    gTxtLinePosition.splice(currLineIdx, 1);
    removeLine();
    renderCanvas();
}

function onAddLine() {
    var position = { x: gCanvas.width / 2, y: gCanvas.height / 2 }
    gTxtLinePosition.push(position);
    addLine();
    renderCanvas();
}

function onChangeFont() {
    var font = document.querySelector('.change-font').value;
    changeFont(font);
    renderCanvas();
}

function onMouseDown(ev) {
    gIsDraggable = true;
    var { offsetX, offsetY } = ev;
}

function onMouseUp(ev) {
    gIsDraggable = false;
}

function onMouseMove(ev) {
    gCanvas.onmouseout = () => {
        gIsDraggable = false;
        return
    }

    if (gIsDraggable) {
        var endX = ev.offsetX;
        var endY = ev.offsetY;

        var currLineIdx = getSelectedLineIdx();
        gTxtLinePosition[currLineIdx].x = endX;
        gTxtLinePosition[currLineIdx].y = endY;
        renderCanvas();
    }
}