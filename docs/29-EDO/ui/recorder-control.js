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
        recorder.phaseChangeHandler = value => {
            for (let button of [buttonPlay, buttonToClipboard, buttonFromClipboard])
                button.disabled = value != soundRecorderPhase.none;
            buttonRecord.hidden = value == soundRecorderPhase.playing;
        } //recorder.phaseChangeHandler
        buttonRecord.handler = value => recorder.recording = value;
        buttonPlay.onclick = playHandler;
    },

}; //recorderControl