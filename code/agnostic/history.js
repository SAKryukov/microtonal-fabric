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

        this.#implementation.canUndo = () => {
            return historyPosition > 0;
        }; //this.#implementation.canUndo
        this.#implementation.canRedo = () => {
            return historyPosition < historyPosition.length - 1;
        }; //this.#implementation.canRedo
        
        this.#implementation.undo = () => {
            if (!this.#implementation.canUndo()) return;
        }; //this.#implementation.undo
        
        this.#implementation.redo = () => {
            if (!this.#implementation.canRedo()) return;
        }; //this.#implementation.redo

        this.#implementation.push = data => {
            history.push(data);
            historyPosition++;
        } //this.#implementation.push

    } //constructor

    get canUndo() { return this.#implementation.canUndo(); }
    get canRedo() { return this.#implementation.canRedo(); }
    undo() { return this.#implementation.undo(); }
    redo() { return this.#implementation.redu(); }
    push(data) { return this.#implementation.push(); }

} //class History
