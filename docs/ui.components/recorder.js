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
                this.#implementation.changePhaseHandler(this.#implementation.phase, this.#implementation.sequence.length);
        }; //this.#implementation.callPhaseChangeHandler
        this.#implementation.normalizeSequence = _ => {
            if (this.#implementation.sequence.length < 1) return;
            const startTime = Math.round(this.#implementation.sequence[0][2]);
            for (let www of this.#implementation.sequence) {
                www[0] = www[0] ? 1 : 0;
                www[2] = Math.round(www[2]);
                www[2] -= startTime;
                if (www[2] < 0) www[2] = 0;
            } //loop
        } //this.#implementation.normalizeSequence
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
        if (actualPlayCount < 1)
            return this.#implementation.callPhaseChangeHandler(soundRecorderPhase.none);
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
        else
            this.#implementation.normalizeSequence();
    } //set recording

    validateData(data) {
        if (data.constructor != String) return false;
        let list;
        try {
            list = JSON.parse(data);
            if (list.constructor != Array) return false
            for (let www of list) {
                if (!www) return false;
                if (www.constructor != Array) return false;
                if (www.length != 3) return false;
                let index = 0;
                for (let w of www) {
                    if (index == 0 && w !== 0 && w !== 1)
                        return false;
                    if (w == undefined || w == null) return;
                    if (w.constructor != Number) return;
                    ++index;
                } //loop w
            } //loop www
        } catch {
            return false;
        } //exception
        return list;
    } //validateData

    get recording() { return this.#implementation.phase == soundRecorderPhase.recording; }
    get playing() { return this.#implementation.phase == soundRecorderPhase.playing; }

    set phaseChangeHandler(value) { this.#implementation.changePhaseHandler = value; }

    get serializedSequence() { return JSON.stringify(this.#implementation.sequence); }
    set serializedSequence(data) {
        const list = this.validateData(data);
        if (list) {
            this.#implementation.sequence = list;
            this.#implementation.callPhaseChangeHandler();
        } //if
        return list;
    } //serializedSequence

} //class Recorder
