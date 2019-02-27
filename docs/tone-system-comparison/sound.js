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

const soundActionSet = () => {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const player = new WebAudioFontPlayer();

    const resume = () => { audioContext.resume; };

    const startStopNote = function (object, octave, tone, doStart, volumeDynamics) {
        for (let preset of definitionSet.presets)
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
                    (definitionSet.defaultOctave + octave) * 12 + tone + soundControlSet.transposition,
                    false,
                    soundControlSet.volume * volumeDynamics);
    }; //startStopNote

    const chordSoundAction = (chord, doStart, volumeDynamics) => {
        for (let chordElement of chord) {
            const object = chordElement.object;
            const octave = chordElement.octave;
            const tone = chordElement.tone;
            startStopNote(object, octave, tone, doStart, volumeDynamics);
        } //loop
    }; //chordSoundAction

    return { resume: resume, startStopNote: startStopNote, chordSoundAction: chordSoundAction };

}; //soundActionSet
