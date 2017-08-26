const keyboardRows = (function () {

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
                if (doActivate)
                    key.rectangle.style.fill = "yellow"; //SA???
                else
                    key.rectangle.style.fill = "white"; //SA???
                if (key.activationHandler)
                    key.activationHandler(key, doActivate);
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

    rows.setActivationHandler = function (activationHandler) { // activationHandler(key, bool)
        for (let row of rows)
            for (let cell of row)
                cell.activationHandler = activationHandler;
    }; //rows.setActivationHandler

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
                label.style.fontFamily = "Arial"; //SA???
                label.style.fontSize = width;
                label.setAttributeNS(null, "x", cell.rectangle.x.baseVal.value + 2);
                label.setAttributeNS(null, "y", cell.rectangle.y.baseVal.value + width + 1);
                notesGroup.appendChild(label);
            } //loop
    }; //rows.labelKeys

    return rows;

})();

function setTet(system) {
    let currentRow = 0;
    let currentX = system.startingMidiNote;
    let currentFirst = currentX;
    const names = system.names;
    const bigRowIncrement = system.bigRowIncrement;
    const smallRowIncrement = system.smallRowIncrement;
    const rightIncrement = system.rightIncrement;
    keyboardRows.labelKeys(function (cell) {
        if (currentRow != cell.row) {
            currentRow = cell.row;
            let increment = (keyboardRows[cell.row].length % 2) == 0 ? bigRowIncrement : smallRowIncrement;
            currentX = increment + currentFirst;
            currentFirst = currentX;
        } //if
        const result = names[currentX % names.length];
        currentX += rightIncrement;
        return result;
    });
} //setTet

(function setKeyboardLayoutControl() {
    elements.radioTet.radio12et.onclick = function (event) {
        if (event.target.checked)
            setTet(notes.tet12);
        elements.legend19et.style.visibility = "hidden";
        elements.legend31et.style.visibility = "hidden";
    };
    elements.radioTet.radio12etJanko.onclick = function (event) {
        if (event.target.checked)
            setTet(notes.tet12Janko);
        elements.legend19et.style.visibility = "hidden";
        elements.legend31et.style.visibility = "hidden";
    };
    elements.radioTet.radio19et.onclick = function (event) {
        if (event.target.checked)
            setTet(notes.tet19);
        elements.legend19et.style.visibility = "visible";
        elements.legend31et.style.visibility = "hidden";
    };
    elements.radioTet.radio31et.onclick = function (event) {
        if (event.target.checked)
            setTet(notes.tet31);
        elements.legend19et.style.visibility = "hidden";
        elements.legend31et.style.visibility = "visible";
    };
    elements.radioTet.radio31et.checked = true;
    setTet(notes.tet31);
    elements.legend31et.style.visibility = "visible";
})();

console.log("done 3");
