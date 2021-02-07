// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

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

        this.#implementation.canQuit = () => {
            return history.length < 2;
        }; //this.#implementation.canQuit

    } //constructor

    get canUndo() { return this.#implementation.can(false); }
    get canRedo() { return this.#implementation.can(true); }
    get canQuit() { return this.#implementation.canQuit(); }
    undo() { return this.#implementation.move(false); }
    redo() { return this.#implementation.move(true); }
    push(data) { return this.#implementation.push(data); }

} //class History
