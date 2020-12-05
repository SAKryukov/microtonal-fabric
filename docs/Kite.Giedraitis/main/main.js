window.onload = () => {

    const elements = {
        startButton: document.querySelector("body > section > button"),
        startButtonParent: document.querySelector("body > section"),
        hiddenControls: document.querySelectorAll("main > section"),
        keyboardLeft: new Keyboard(document.querySelector("body > header")),
        keyboardRight: new Keyboard(document.querySelector("body > header")),
        labelType: {
            intervals: document.querySelector("#label-type-intervals"),
            noteNames: document.querySelector("#label-type-note-names"),
            none: document.querySelector("#label-type-none"),
        },
    };

    initializationController.initialize(
        elements.hiddenControls,
        elements.startButton,
        elements.startButtonParent,
        start
    );

    (function setLabelTypes() {
        elements.labelType.intervals.onchange = event => {
            if (event.target.checked) elements.keyboardLeft.labelVisibility = Keyboard.labelType.intervals;
        };
        elements.labelType.noteNames.onchange = event => {
            if (event.target.checked) elements.keyboardLeft.labelVisibility = Keyboard.labelType.noteNames;
        };
        elements.labelType.none.onchange = event => {
            if (event.target.checked)  elements.keyboardLeft.labelVisibility = Keyboard.labelType.none;
        };
        elements.labelType.intervals.checked = true;    
    })();

    function start() {
        for (kbd of [elements.keyboardLeft, elements.keyboardRight])
            kbd.keyHandler = () => {};
    } //start

}; //window.onload