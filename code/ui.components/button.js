// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

class TwoStateButton {

    #implementation = {};
    
    constructor(element, handler) {
        let down = true;
        const theElement = element;
        let theHandler = handler;
        const downClassName = theElement.classList[theElement.classList.length - 1];
        theElement.onclick = event => {
            down = !down;
            this.#implementation.setDown(down);
        }; //theElement.onclick
        this.#implementation.getDown = () => down;
        this.#implementation.setDown = value => {
            down = value;
            if (value)
                theElement.classList.add(downClassName);
            else
                theElement.classList.remove(downClassName);
            if (theHandler) theHandler(value);
        } //this.setDown
        this.#implementation.setFocus = () => theElement.focus();
        this.#implementation.click = () => theElement.click();
        this.#implementation.setHandler = value => theHandler = value;
        this.#implementation.setDisabled = value => theElement.disabled = value;
        this.#implementation.setHidden = value => theElement.style.visibility = value ? "hidden" : "visible";
        this.#implementation.getDataset = () => theElement.dataset;
    } //constructor

    focus() { this.#implementation.setFocus(); }
    click() { this.#implementation.click(); }

    get isDown() { return this.#implementation.getDown(); }
    set isDown(value) { this.#implementation.setDown(value); }

    set handler(aHandler) { this.#implementation.setHandler(aHandler); }

    set disabled(value) { this.#implementation.setDisabled(value); }
    set hidden(value) { this.#implementation.setHidden(value); }

    get dataset() { return this.#implementation.getDataset(); }

} //class TwoStateButton
