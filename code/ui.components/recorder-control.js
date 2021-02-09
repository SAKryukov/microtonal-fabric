// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const recorderControl = {
    
    init: (recorder, buttonRecord, buttonPlay, buttonToClipboard, buttonFromClipboard, playHandler) => {

        const playContent = buttonPlay.innerHTML;
        const cancelContent = buttonPlay.dataset.cancelName;
        recorder.phaseChangeHandler = (value, sequenceLength) => {
            for (let button of [buttonToClipboard, buttonFromClipboard]) {
                button.disabled = value.has(soundRecorderPhase.playing) || value.has(soundRecorderPhase.recording);
                if (sequenceLength < 1)
                    button.disabled = true;
            } //loop
            buttonPlay.disabled = sequenceLength < 1;
            buttonPlay.innerHTML = value.has(soundRecorderPhase.playing) ? cancelContent : playContent;
        } //recorder.phaseChangeHandler

        window.addEventListener("keydown", event => {                
            for (let button of [buttonRecord, buttonPlay, buttonToClipboard, buttonFromClipboard])
                if (button.dataset.directAccessKey.toLowerCase() == event.key.toLowerCase())
                    button.click();
        }); // window onkeydown

        buttonRecord.handler = value => recorder.recording = value;

        buttonPlay.onclick = () => playHandler(recorder.playing);

        buttonToClipboard.onclick = () => {
            navigator.clipboard.writeText(recorder.serializedSequence);
        }; //ToClipboard

        buttonFromClipboard.onclick = () => {            
            navigator.clipboard.readText().then(value => recorder.serializedSequence = value);
        }; //FromClipboard

    }, //init

}; //recorderControl