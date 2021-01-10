 // Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

class History {

    #implementation = {  };

    constructor() {
        
        const history = [];
        let historyPosition = -1;

        this.#implementation.move = doRedo => {
            if (!this.#implementation.can(doRedo)) return;
            if (doRedo) historyPosition++; else historyPosition--;
            return history[historyPosition];
        } //this.#implementation.move

        this.#implementation.can = redo => {
            if (redo)
                return historyPosition >= 0 && historyPosition < history.length - 1;
            else
                return historyPosition > 0;
        } //this.#implementation.can

        this.#implementation.push = data => {
            history.splice(historyPosition + 1);
            history.push(data);
            historyPosition++;
        } //this.#implementation.push

    } //constructor

    get canUndo() { return this.#implementation.can(false); }
    get canRedo() { return this.#implementation.can(true); }
    undo() { return this.#implementation.move(false); }
    redo() { return this.#implementation.move(true); }
    push(data) { return this.#implementation.push(data); }

} //class History
