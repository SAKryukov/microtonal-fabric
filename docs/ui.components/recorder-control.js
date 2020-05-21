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

        recorder.phaseChangeHandler = (value, sequenceLength) => {
            for (let button of [buttonToClipboard, buttonFromClipboard]) {
                button.disabled = value.has(soundRecorderPhase.playing) || value.has(soundRecorderPhase.recording);
                if (sequenceLength < 1)
                    button.disabled = true;
            } //loop
            buttonPlay.disabled = sequenceLength < 1;
        } //recorder.phaseChangeHandler

        buttonRecord.handler = value => recorder.recording = value;

        buttonPlay.onclick = playHandler;

        buttonToClipboard.onclick = _ => {
            navigator.clipboard.writeText(recorder.serializedSequence);
        }; //ToClipboard

        buttonFromClipboard.onclick = _ => {            
            navigator.clipboard.readText().then(value => recorder.serializedSequence = value);
        }; //FromClipboard

    }, //init

}; //recorderControl