// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

const soundRecorderPhase = { none: 1, recording: 2, playing: 4, };

class Recorder {

    #implementation = { phase: soundRecorderPhase.none, sequence: [] };

    constructor() {
        this.#implementation.callPhaseChangeHandler = forced => {
            if (forced)
                this.#implementation.phase = forced;
            if (this.#implementation.changePhaseHandler)
                this.#implementation.changePhaseHandler(this.#implementation.phase);
        }; //this.#implementation.callPhaseChangeHandler
    } //constructor

    record(what, where) {
        if (this.#implementation.phase != soundRecorderPhase.recording) return;
        const when = performance.now();
        this.#implementation.sequence.push([what, where, when]);
    } //record
    
    play(handler) { // handler(where, what) that is, handler(keyIndex, bool on/off)
        if (this.#implementation.phase == soundRecorderPhase.recording) return;
        this.#implementation.phase = soundRecorderPhase.playing;
        this.#implementation.callPhaseChangeHandler();
        let actualPlayCount = this.#implementation.sequence.length;
        for (let www of this.#implementation.sequence) {
            const what = www[0];
            const where = www[1];
            const when = www[2];
            setTimeout((where, what) => {
                handler(where, what);
                --actualPlayCount;
                if (actualPlayCount <= 0)
                    this.#implementation.callPhaseChangeHandler(soundRecorderPhase.none);
            }, when, where, what);
        } //loop
    } //play

    set recording(isRecording) {
        if (this.#implementation.phase == soundRecorderPhase.playing) return;
        if (isRecording && this.#implementation.phase == soundRecorderPhase.recording) return;
        if (!isRecording && this.#implementation.phase != soundRecorderPhase.recording) return;
        this.#implementation.phase = isRecording ? soundRecorderPhase.recording : soundRecorderPhase.none;
        this.#implementation.callPhaseChangeHandler();
        if (isRecording)
            this.#implementation.sequence.splice(0);
        else {
            if (this.#implementation.sequence.length < 1) return;
            const startTime = this.#implementation.sequence[0][2];
            for (let www of this.#implementation.sequence) {
                www[2] = Math.round(www[2]);
                www[2] -= startTime;
                if (www[2] < 0) www[2] = 0;
            } //loop
        } //if
    } //set recording

    get recording() { return this.#implementation.phase == soundRecorderPhase.recording; }
    get playing() { return this.#implementation.phase == soundRecorderPhase.playing; }

    set phaseChangeHandler(value) { this.#implementation.changePhaseHandler = value; }

} //class Recorder
