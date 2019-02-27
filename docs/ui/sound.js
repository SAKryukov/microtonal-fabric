// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2019
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

"use strict";

const soundActionSet = (definitionSet, soundControlSet) => {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const player = new WebAudioFontPlayer();

    const resume = () => { audioContext.resume; };

    const startStopNote = function (object, octave, tone, doStart, volumeDynamics) {
        for (let preset of definitionSet.options.presets)
            player.adjustPreset(audioContext, preset.preset);
        if (object.audioGraph && !doStart) {
            object.audioGraph.cancel();
            object.audioGraph = null;
        } else if (!object.audioGraph && doStart)
            object.audioGraph =
                player.startNote(
                    audioContext, audioContext.destination,
                    soundControlSet.preset,
                    audioContext.currentTime,
                    (definitionSet.options.defaultOctave + octave) * 12 + tone + soundControlSet.transposition,
                    false,
                    soundControlSet.volume * volumeDynamics);
    } //startStopNote

    return { resume: resume, startStopNote: startStopNote };

}; //soundActionSet
