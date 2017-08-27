const keyboardHandler = (function () {

    let soundAction = null; // soundAction: function(object, octave, tone, doStart)
    let chordSoundAction = null; // chordSoundAction: function(chord, doStart), where chord is and array of: {object, octave: element.octave, tone: element.tone}
    const setSoundActions = function (soundActionInstance, chordSoundActionInstance) {
        soundAction = soundActionInstance;
        chordSoundAction = chordSoundActionInstance;
    }; //setSoundActions

    const rows = [];

    const nodes = elements.keyboard.childNodes;

    let numberOfRows = 0;
    for (let node of nodes)
        if (node.constructor == SVGGElement)
            numberOfRows++;
    for (let node of nodes) {
        const rowCells = [];
        rowCells.rowNumber = rows.length;
        if (node.constructor != SVGGElement) continue;
        for (let rowCell of node.childNodes) {
            if (rowCell.constructor != SVGRectElement) continue;
            const key = {};
            key.rectangle = rowCell;
            key.rectangle.key = key;
            key.numberInRow = rowCells.length;
            key.row = numberOfRows - rows.length - 1;
            rowCells.push(key);
            key.activate = function (key, doActivate) {
                if (soundAction)
                    soundAction(key, 0, key.tone, doActivate);
                if (doActivate)
                    key.rectangle.style.fill = definitionSet.highlightSound;
                else
                    key.rectangle.style.fill = definitionSet.highlightDefault;
            }; //key.activate
            key.rectangle.onmouseenter = function (event) {
                if (event.buttons == 1)
                    event.target.key.activate(event.target.key, true);
                return false;
            };
            key.rectangle.onmouseleave = function (event) {
                event.target.key.activate(event.target.key, false);
                return false;
            };
            key.rectangle.onmousedown = function (event) {
                if (event.button == 0)
                    event.target.key.activate(event.target.key, true);
                else
                    event.target.key.activate(event.target.key, false);
                return false;
            };
            key.rectangle.onmouseup = function (event) {
                if (event.button == 0)
                    event.target.key.activate(event.target.key, false);
                return false;
            };
        } //loop cells
        rows.splice(0, 0, rowCells);
    } //loop rows
    const svgNS = keyboard.getAttribute("xmlns");
    const notesGroup = document.createElementNS(svgNS, "g");
    keyboard.appendChild(notesGroup);

    rows.iterateKeys = function (handler) { // handler(key)
        for (let row of rows)
            for (let cell of row)
                handler(cell);
    }; //rows.iterateKeys

    rows.labelKeys = function (labelMaker) {
        while (notesGroup.firstChild)
            notesGroup.removeChild(notesGroup.firstChild);
        if (!labelMaker) return;
        for (let row of rows)
            for (let cell of row) {
                const label = document.createElementNS(svgNS, "text");
                label.innerHTML = labelMaker(cell);
                const width = cell.rectangle.width.baseVal.value / 3;
                label.style = "pointer-events:none";
                label.style.fontFamily = definitionSet.labelFontFamily;
                label.style.fontSize = width;
                label.setAttributeNS(null, "x", cell.rectangle.x.baseVal.value + 2);
                label.setAttributeNS(null, "y", cell.rectangle.y.baseVal.value + width + 1);
                notesGroup.appendChild(label);
            } //loop
    }; //rows.labelKeys

    return { rows: rows, soundActionSetter: setSoundActions };

})();
