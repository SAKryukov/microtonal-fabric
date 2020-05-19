// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

const recorderControl = {
    
    init: (recorder, buttonRecord, buttonPlay, buttonToClipboard, buttonFromClipboard, playHandler) => {
        buttonRecord.handler = value => recorder.recording = value;
        buttonPlay.onclick = playHandler;
    },

}; //recorderControl