// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

class Recorder {

    #implementation = { recorderPhase: { none: 0, recording: 1, playing: 2, }, phase: 0, sequence: [] };

    constructor() {
        
    } //constructor

    record(what, where) {
        if (this.#implementation.phase != this.#implementation.recorderPhase.recording) return;
        const when = performance.now();
        this.#implementation.sequence.push([what, where, when]);
    } //record
    
    play(handler) { // handler(where, what) that is, handler(keyIndex, bool on/off)
        if (this.#implementation.phase == this.#implementation.recorderPhase.recording) return;
        for (let www of this.#implementation.sequence) {
            const what = www[0];
            const where = www[1];
            const when = www[2];
            setTimeout((where, what) => handler(where, what), when, where, what);
        } //loop
    } //play

    set recording(isRecording) {
        if (this.#implementation.phase == this.#implementation.recorderPhase.playing) return;
        if (isRecording && this.#implementation.phase == this.#implementation.recorderPhase.recording) return;
        if (!isRecording && this.#implementation.phase != this.#implementation.recorderPhase.recording) return;
        this.#implementation.phase = isRecording ? this.#implementation.recorderPhase.recording : this.#implementation.recorderPhase.none;
        if (isRecording) return;
        if (this.#implementation.sequence.length < 1) return;
        const startTime = this.#implementation.sequence[0][2];
        for (let www of this.#implementation.sequence) {
            www[2] = Math.round(www[2]);
            www[2] -= startTime;
            if (www[2] < 0) www[2] = 0;
        } //loop
    } //set recording

    get recording() { return this.#implementation.phase == this.#implementation.recorderPhase.recording; }
    get playing() { return this.#implementation.phase == this.#implementation.recorderPhase.playing; }

} //class Recorder
