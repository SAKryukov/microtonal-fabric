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
        this.#implementation.setHandler = value => theHandler = value;
    } //constructor

    focus() { this.#implementation.setFocus(); }

    get isDown() { return this.#implementation.getDown(); }
    set isDown(value) { this.#implementation.setDown(value); }

    set handler(aHandler) { this.#implementation.setHandler(aHandler); }

} //class TwoStateButton
