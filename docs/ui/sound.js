// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard"use strict";

(function setupSounds() {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const player = new WebAudioFontPlayer();
    for (let preset of definitionSet.presets)
        player.adjustPreset(audioContext, preset.preset);

    const startStopNote = function (object, octave, tone, doStart) {
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
                    soundControlSet.volume);
    } //startStopNote

    keyboardHandler.soundActionSetter(function (object, octave, tone, doStart) {
        startStopNote(object, octave, tone, doStart);
    }, function (chord, doStart) {
        for (let chordElement of chord) {
            const object = chordElement.object;
            const octave = chordElement.octave;
            const tone = chordElement.tone;
            startStopNote(object, octave, tone, doStart);
        } //loop
    });

})();
