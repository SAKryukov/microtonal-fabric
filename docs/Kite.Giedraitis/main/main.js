window.onload = () => {

    const elements = {
        keyboard: new Keyboard(document.querySelector("body > section:first-child")),
        labelType: {
            intervals: document.querySelector("#label-type-intervals"),
            noteNames: document.querySelector("#label-type-note-names"),
            none: document.querySelector("#label-type-none"),
        },
    };

    (function setLabelTypes() {
        elements.labelType.intervals.onchange = event => {
            if (event.target.checked) elements.keyboard.labelVisibility = Keyboard.labelType.intervals;
        };
        elements.labelType.noteNames.onchange = event => {
            if (event.target.checked) elements.keyboard.labelVisibility = Keyboard.labelType.noteNames;
        };
        elements.labelType.none.onchange = event => {
            if (event.target.checked)  elements.keyboard.labelVisibility = Keyboard.labelType.none;
        };
        elements.labelType.intervals.checked = true;    
    })();

}; //window.onload