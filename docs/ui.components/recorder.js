// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

const soundRecorderPhase = { recording: 1, playing: 2, };

class Recorder {

    #implementation = { keyboardSet: [], phase: new Set(), playSequence: [], recordSequence: [], cancelSequence: [] };

    constructor(keyboardSet, silenceHandler) {
        this.#implementation.keyboardSet = keyboardSet;
        this.#implementation.silenceHandler = silenceHandler;
        this.#implementation.callPhaseChangeHandler = stopPlay => {
            if (stopPlay)
                this.#implementation.phase.delete(soundRecorderPhase.playing);
            if (this.#implementation.changePhaseHandler)
                this.#implementation.changePhaseHandler(this.#implementation.phase, this.#implementation.playSequence.length);
        }; //this.#implementation.callPhaseChangeHandler
        this.#implementation.normalizeSequence = sequence => {
            if (sequence.length < 1) return;
            const startTime = Math.round(sequence[0][2]);
            if (startTime == 0) return;
            for (let www of sequence) {
                www[0] = www[0] ? 1 : 0;
                www[2] = Math.round(www[2]);
                www[2] -= startTime;
                if (www[2] < 0) www[2] = 0;
            } //loop
        } //this.#implementation.normalizeSequence
    } //constructor

    record(what, where) {
        if (!this.#implementation.phase.has(soundRecorderPhase.recording)) return;
        const when = performance.now();
        this.#implementation.recordSequence.push([what, where, when]);
    } //record
    
    play(handler) {
        if (this.#implementation.phase.has(soundRecorderPhase.playing)) { //cancel
            for (let functionToCancel of this.#implementation.cancelSequence)
                clearTimeout(functionToCancel);            
            this.#implementation.cancelSequence.splice(0);
            for (let keyboard of this.#implementation.keyboardSet)
                keyboard.stopAllSounds(true);
            if (this.#implementation.silenceHandler)
                this.#implementation.silenceHandler();
            return this.#implementation.callPhaseChangeHandler(true);
        } //if cancel
        this.#implementation.phase.add(soundRecorderPhase.playing);
        this.#implementation.callPhaseChangeHandler();
        let actualPlayCount = this.#implementation.playSequence.length;
        if (actualPlayCount < 1)
            return this.#implementation.callPhaseChangeHandler(true);
        this.#implementation.cancelSequence.splice(0);
        for (let www of this.#implementation.playSequence) {
            const what = www[0];
            const where = www[1];
            const when = www[2];
            this.#implementation.cancelSequence.push(setTimeout((where, what) => {
                handler(where, what);
                --actualPlayCount;
                if (actualPlayCount <= 0)
                    this.#implementation.callPhaseChangeHandler(true);
            }, when, where, what));
        } //loop
    } //play

    set recording(isRecording) {
        if (isRecording && this.#implementation.phase.has(soundRecorderPhase.recording)) return;
        if (!isRecording && !this.#implementation.phase.has(soundRecorderPhase.recording)) return;
        if (isRecording)
            this.#implementation.phase.add(soundRecorderPhase.recording)
        else
            this.#implementation.phase.delete(soundRecorderPhase.recording)
        if (!isRecording) {
            this.#implementation.playSequence = this.#implementation.recordSequence;
            this.#implementation.normalizeSequence(this.#implementation.playSequence);
            this.#implementation.recordSequence = [];
        } //if
        this.#implementation.callPhaseChangeHandler();
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

    set phaseChangeHandler(value) { this.#implementation.changePhaseHandler = value; }

    get serializedSequence() { return JSON.stringify(this.#implementation.playSequence); }
    set serializedSequence(data) {
        const list = this.validateData(data);
        if (list) {
            this.#implementation.playSequence = list;
            this.#implementation.callPhaseChangeHandler();
        } //if
        return list;
    } //serializedSequence

} //class Recorder
