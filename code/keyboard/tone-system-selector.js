(function setKeyboardLayoutControl() {

    function setTet(system) {
        let currentRow = 0;
        let currentX = system.startingMidiNote;
        let currentFirst = currentX;
        const names = system.names;
        const bigRowIncrement = system.bigRowIncrement;
        const smallRowIncrement = system.smallRowIncrement;
        const rightIncrement = system.rightIncrement;
        keyboardHandler.rows.labelKeys(function (cell) {
            if (currentRow != cell.row) {
                currentRow = cell.row;
                let increment = (keyboardHandler.rows[cell.row].length % 2) == 0 ? bigRowIncrement : smallRowIncrement;
                currentX = increment + currentFirst;
                currentFirst = currentX;
            } //if
            cell.note = currentX;
            cell.tone = currentX * 12 / system.names.length;
            const result = names[currentX % names.length];
            currentX += rightIncrement;
            return result;
        });
    } //setTet

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

    (function setHardwareKeyboardControl() {
        const keyDictionary = {};
        const keyHandler = function(event, doActivate) {
            if (event.repeat) return;
            if (event.ctrlKey) return;
            if (event.altKey) return;
            if (event.metaKey) return;
            if (event.shiftKey) return;
            const keyCode = event.keyCode || event.which;
            const cell = keyDictionary[keyCode]; 
            if (!cell) return;
            cell.activate(cell, doActivate);
            return false;
        }; //keyHandler
        window.onkeydown = function(event) { keyHandler(event, true); }
        window.onkeyup = function(event) { keyHandler(event, false); }
        const startingRow = definitionSet.hardwareKeyboardControl.startingRow;
        let rowIndex = startingRow;
        let xShift = 0;
        for (row of hardwareRows) {
            let xIndex = definitionSet.hardwareKeyboardControl.keyShift;
            if (keyboardHandler.rows[rowIndex].length % 2 > 0)
                xShift++;
                xIndex -= rowIndex - xShift;
            for (key of row) { 
                const cell = keyboardHandler.rows[rowIndex][xIndex];
                keyDictionary[key] = cell;
                cell.rectangle.style.fill = "lightGreen";
                ++xIndex;
            } //loop xIndex
            ++rowIndex
        } //loop rowIndex
    })();

})();
