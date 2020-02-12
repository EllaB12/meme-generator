'use strict'

var gKeywords = { 'happy': 12, 'funny puk': 1 };
var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny'] },
    { id: 2, url: 'img/2.jpg', keywords: ['cute'] },
    { id: 3, url: 'img/3.jpg', keywords: ['cute'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cute'] },
    { id: 5, url: 'img/5.jpg', keywords: ['cute'] },
    { id: 6, url: 'img/6.jpg', keywords: ['cute'] },
    { id: 7, url: 'img/7.jpg', keywords: ['cute'] },
    { id: 8, url: 'img/8.jpg', keywords: ['cute'] },
    { id: 9, url: 'img/9.jpg', keywords: ['cute'] },
    { id: 10, url: 'img/10.jpg', keywords: ['cute'] },
    { id: 11, url: 'img/11.jpg', keywords: ['cute'] },
    { id: 12, url: 'img/12.jpg', keywords: ['cute'] },
    { id: 13, url: 'img/13.jpg', keywords: ['cute'] },
    { id: 14, url: 'img/14.jpg', keywords: ['cute'] },
    { id: 15, url: 'img/15.jpg', keywords: ['cute'] },
    { id: 16, url: 'img/16.jpg', keywords: ['cute'] },
    { id: 17, url: 'img/17.jpg', keywords: ['cute'] },
    { id: 18, url: 'img/18.jpg', keywords: ['cute'] },
];
var gMeme = creatMeme();


function getImgs() {
    return gImgs;
}

function IncreaseTxtSize(size) {
    gMeme.lines[gMeme.selectedLineIdx].size = size + 1;
}

function decreaseTxtSize(size) {
    gMeme.lines[gMeme.selectedLineIdx].size = size - 1;
}

function switchLine() {
    if (gMeme.selectedLineIdx === 0) {
        gMeme.selectedLineIdx = 1;
    } else gMeme.selectedLineIdx = 0;
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

function creatMeme() {
    return {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [
            { txt: '', size: 50, align: 'center', color: 'white' },
            { txt: '', size: 50, align: 'center', color: 'white' }]
    }
}
