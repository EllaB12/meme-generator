'use strict'

var gKeywords = { 'happy': 12, 'funny puk': 1 };
var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny','politician'] },
    { id: 2, url: 'img/2.jpg', keywords: ['cute','animal','dog'] },
    { id: 3, url: 'img/3.jpg', keywords: ['cute','animal','baby','dog'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cute','animal','cat'] },
    { id: 5, url: 'img/5.jpg', keywords: ['cute','happy','baby'] },
    { id: 6, url: 'img/6.jpg', keywords: [] },
    { id: 7, url: 'img/7.jpg', keywords: ['funny'] },
    { id: 8, url: 'img/8.jpg', keywords: ['cute'] },
    { id: 9, url: 'img/9.jpg', keywords: ['funny'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny','politician'] },
    { id: 11, url: 'img/11.jpg', keywords: [] },
    { id: 12, url: 'img/12.jpg', keywords: ['celebrity'] },
    { id: 13, url: 'img/13.jpg', keywords: ['celebrity'] },
    { id: 14, url: 'img/14.jpg', keywords: [] },
    { id: 15, url: 'img/15.jpg', keywords: [] },
    { id: 16, url: 'img/16.jpg', keywords: ['excited'] },
    { id: 17, url: 'img/17.jpg', keywords: ['politician'] },
    { id: 18, url: 'img/18.jpg', keywords: [] },
];
var gMeme = creatMeme();
var gFilter = 'All';
var gKeywords = [];

function getImgForDisplay() {
    if (gFilter === 'All' || !gFilter) return gImgs;
    addKeyWord(gFilter);
    var imgsForDisplay = gImgs.filter(function (img) {
        return img.keywords.find(keyWord =>  keyWord.includes(gFilter.toLowerCase()))
    })

    return imgsForDisplay;
}

function addKeyWord(word) {
    var foundWord = gKeywords.findIndex(keyword => keyword === word);

    if (foundWord === -1) {
        var keyWord = {
            word,
            count: 0,
            size: 16
        }
        gKeywords.push(keyWord);
    } else {
        getKeyWords[foundWord].count++;
        getKeyWords[foundWord].size++;
    }
}

function getKeyWords() {
    return gKeywords;
}

function updateFilter(filter) {
    gFilter = filter;
}

function changeFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function addLine() {
    var line = {
        txt: 'Your Text',
        size: 50,
        align: 'center',
        color: 'white',
        font: 'Impact'
    }

    gMeme.lines.push(line);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function removeLine() {
    var currLineIdx = gMeme.selectedLineIdx;
    gMeme.lines.splice(currLineIdx, 1)
    gMeme.selectedLineIdx--;
}

function changeTxtColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}


function changeTxtSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
}

function switchLine() {
    gMeme.selectedLineIdx++;

    if (gMeme.selectedLineIdx >= gMeme.lines.length) {
        gMeme.selectedLineIdx = 0;
    }
}

function updateAlignText(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align;
}

function updateMemeImg(imgId) {
    gMeme.selectedImgId = imgId;
}

function updateMemeText(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function getMemeImg() {
    return gImgs.find(img => img.id === gMeme.selectedImgId);
}

function getMeme() {
    return gMeme;
}

function getSelectedLineIdx() {
    return gMeme.selectedLineIdx;
}

function updateMeme() {
    gMeme = creatMeme();
}

function updateSavedMeme(meme) {
    gMeme = meme;
}

function creatMeme() {
    return {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [
            { txt: 'Your Text', size: 50, align: 'center', color: 'white', font: 'Impact' },
            { txt: 'Your Text', size: 50, align: 'center', color: 'white', font: 'Impact' }]
    }
}
