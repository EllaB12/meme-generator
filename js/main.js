'use strict'

var gCanvas;
var gCtx;

var gTxtLinePosition = [{ x: 250, y: 60 }, { x: 250, y: 450 }];

var gIsDraggable = false;

var gSavedMemesImg;
var gSavedMemes;

function onInit() {
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
    if (window.innerWidth < 740) resizeCanvas();
    showImg();
    renderImages();

    gCanvas.addEventListener("mouseup", onMouseUp, false);
    gCanvas.addEventListener("mousemove", onMouseMove, false);
    gCanvas.addEventListener("mousedown", onMouseDown, false);

    gSavedMemesImg = (loadFromStorage('memes')) ? loadFromStorage('memes') : [];
    gSavedMemes = (loadFromStorage('memesObj')) ? loadFromStorage('memesObj') : [];
}

function renderImages() {
    var imgs = getImgForDisplay();

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
    document.querySelector('.text-input').value = '';

    document.querySelector('.gallery').classList.remove('active');
    document.querySelector('.about').classList.remove('active');

    document.querySelector('.meme-container').style.display = 'flex';
    document.querySelector('.canvas-container').style.display = 'block';
    document.querySelector('.btn-container').style.display = 'block';

    document.querySelector('.image-gallery').style.display = 'none';
    document.querySelector('.about-container').style.display = 'none';
    document.querySelector('.search-container').style.display = 'none';


    updateMeme();
    updateMemeImg(imgId);
    if (window.innerWidth < 740) resizeCanvas();
    else {
        gTxtLinePosition = [{ x: 250, y: 60 }, { x: 250, y: 450 }];
    }
    renderCanvas();

    var elHeader = document.querySelector('header');
    elHeader.scrollIntoView();
}

function onChangeTxtSize(diff) {
    changeTxtSize(diff);
    renderCanvas();
}

function onMoveTxt(diff) {
    var lineIdx = getSelectedLineIdx();
    gTxtLinePosition[lineIdx].y += diff;
    renderCanvas();
}

function onSwitchLine() {
    switchLine();

    var lineIdx = getSelectedLineIdx();
    var y = gTxtLinePosition[lineIdx].y;
    var size = getMeme().lines[lineIdx].size;
    drawRect(size, y);

}

function drawRect(size, y) {
    gCtx.beginPath()
    gCtx.rect(10, y - (size * 1.5) + 20, 480, size * 1.5)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
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

    gTxtLinePosition = [{ x: 200, y: 50 }, { x: 200, y: 350 }];
}

function onRemoveLine() {
    document.querySelector('.text-input').value = '';
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

function onDisplayMain(el) {
    var elMeme = document.querySelector('.meme-container');
    var elSaveMemes = document.querySelector('.saves-memes');

    if (elMeme.style.display !== 'none' || elSaveMemes.style.display !== 'none') {
        document.querySelector('.canvas-container').style.display = 'none';
        document.querySelector('.btn-container').style.display = 'none';
        document.querySelector('.saved-memes').style.display = 'none';
        document.querySelector('.meme-container').style.display = 'flex';
        document.querySelector('.image-gallery').style.display = 'grid';
        document.querySelector('.about-container').style.display = 'flex';
        document.querySelector('.search-container').style.display = 'block';
    }

    if (el.innerText === 'Gallery') {
        el.classList.add('active');
        document.querySelector('.about').classList.remove('active');
        document.querySelector('.memes').classList.remove('active');
    } else {
        el.classList.add('active');
        document.querySelector('.gallery').classList.remove('active');
        document.querySelector('.memes').classList.remove('active');
    }
}

function onDisplaySavedMemes(el) {
    document.querySelector('.canvas-container').style.display = 'none';
    document.querySelector('.btn-container').style.display = 'none';
    document.querySelector('.image-gallery').style.display = 'none';
    document.querySelector('.about-container').style.display = 'none';

    el.classList.add('active');
    document.querySelector('.gallery').classList.remove('active');
    document.querySelector('.about').classList.remove('active');

    renderSavedMemes()
    document.querySelector('.saved-memes').style.display = 'grid';
}

function onDownloadDropdown() {
    document.querySelector('.download-content').classList.toggle('show');

    window.onclick = function (event) {
        if (!event.target.matches('.download-btn')) {
            var dropdowns = document.querySelector('.download-content');
            if (dropdowns.classList.contains('show')) {
                dropdowns.classList.remove('show');
            }
        }
    }
}

function onShareDropdown() {
    document.querySelector('.share-content').classList.toggle('show');

    window.onclick = function (event) {
        if (!event.target.matches('.share-btn')) {
            var dropdowns = document.querySelector('.share-content');
            if (dropdowns.classList.contains('show')) {
                dropdowns.classList.remove('show');
            }
        }
    }
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function saveImg() {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    gSavedMemesImg.push(imgContent);
    saveToStorage('memes', gSavedMemesImg);

    var meme = getMeme();
    gSavedMemes.push(meme);
    saveToStorage('memesObj', gSavedMemes);
}

function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-content').innerHTML = `
        <a href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;"> 
        <i class="fab fa-facebook"></i> Share
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}

function renderSavedMemes() {
    var strHtml = gSavedMemesImg.map((saveMeme, Idx) => {
        return `
                <img onclick="onShowSavedMeme(${Idx})" src="${saveMeme}">
               `
    });

    document.querySelector('.saved-memes').innerHTML = strHtml.join('');
}

function onShowSavedMeme(memeId) {
    var memeImg = gSavedMemes[memeId].selectedImgId;
    var meme = gSavedMemes[memeId];

    console.log(meme);

    onUpdateMemeImg(memeImg);
    updateSavedMeme(meme);
    document.querySelector('.saved-memes').style.display = 'none';
}

function onUpdateSearchInput() {
    var filter = document.querySelector('.search-input').value;
    updateFilter(filter);
    renderImages();
}

function myFunction() {
    var inputEl = document.querySelector('.text-input');
    inputEl.value = '';
}
