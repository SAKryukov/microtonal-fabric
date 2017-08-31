"use strict";

(function setKeyboardLayoutControl() {

    let visibleChordTable;
    let selectedTet;
    let chord;

    (function setupChordTables(){
        for (let chordSetElement of elements.chordSet) {
            const table = chordSetElement.table;
            const toneCount = chordSetElement.toneCount;
            const baseOctave = definitionSet.defaultOctave;
            const buildButton = chordSetElement.buildButton;
            buildButton.style.visibility = "hidden";
            const resetButton = chordSetElement.resetButton;
            const closeButton = chordSetElement.closeButton
            setupChordTable(table, toneCount, baseOctave, buildButton, resetButton, closeButton,
                function() {
                    showChordTable(visibleChordTable, false);
                });
        } //loop    
    })();

    function optimizeTableLocation(table) {
        const room = { x: window.innerWidth, y: window.innerHeight };
        //const svgNS = keyboard.getAttribute("xmlns");        
        const x = Math.floor((room.x - table.offsetWidth) / 2);
        //if (table.offsetHeight <= elements.keyboard.offsetHeight)
        const y = elements.keyboard.clientHeight - table.offsetHeight > 0 ?
            Math.floor((elements.keyboard.clientHeight - table.offsetHeight) / 2)
            : 22;
        return { x: x, y: y };
    } //optimizeTableLocation

    function showChordTable(table, doShow) {
        if (doShow && visibleChordTable) return;
        if (!doShow && !visibleChordTable) return;
        if (doShow) {
            visibleChordTable = table;
            table.style.position = "absolute";
            table.style.top = 0;
            document.body.appendChild(table);
            table.style.marginLeft = "0px";
            table.style.marginTop = "0px";
            const bestLocation = optimizeTableLocation(table);
            table.style.marginLeft = bestLocation.x + "px";
            table.style.marginTop = bestLocation.y + "px";
        } else {
            document.body.removeChild(visibleChordTable);
            visibleChordTable = null;
        } //if
    } //showChordTable

    elements.buttonShowChordTable.onclick = function (event) {
        showChordTable(selectedTet.chordTable, !visibleChordTable);
    } //elements.buttonShowChordTable.onclick

    function setTet(option, system) {
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
        keyboardHandler.chordSetter(option.chordTable.chordBuilder.build());        
        if (!option) return;
        if (!option.chordTable) return;
        if (!visibleChordTable) return;
        showChordTable(visibleChordTable, false);
        showChordTable(option.chordTable, true);
    } //setTet

    elements.radioTet.radio12et.onclick = function (event) {
        if (event.target.checked) {
            setTet(event.target, notes.tet12);
            selectedTet = event.target;
        } //if
        elements.legend19et.style.visibility = "hidden";
        elements.legend31et.style.visibility = "hidden";
    };
    elements.radioTet.radio12etJanko.onclick = function (event) {
        if (event.target.checked) {
            setTet(event.target, notes.tet12Janko);
            selectedTet = event.target;
        } //if
        elements.legend19et.style.visibility = "hidden";
        elements.legend31et.style.visibility = "hidden";
    };
    elements.radioTet.radio19et.onclick = function (event) {
        if (event.target.checked) {
            setTet(event.target, notes.tet19);
            selectedTet = event.target;
        } //if
        elements.legend19et.style.visibility = "visible";
        elements.legend31et.style.visibility = "hidden";
    };
    elements.radioTet.radio31et.onclick = function (event) {
        if (event.target.checked) {
            setTet(event.target, notes.tet31);
            selectedTet = event.target;
        } //if            
        elements.legend19et.style.visibility = "hidden";
        elements.legend31et.style.visibility = "visible";
    };
    elements.radioTet.radio31et.checked = true;
    setTet(elements.radioTet.radio31et, notes.tet31);
    selectedTet = elements.radioTet.radio31et;
    elements.legend31et.style.visibility = "visible";

    (function setHardwareKeyboardControl() {
        const keyDictionary = {};
        const keyHandler = function (event, doActivate) {
            if (event.ctrlKey) return true;
            if (event.altKey) return true;
            if (event.metaKey) return true;
            const keyCode = event.keyCode || event.which;
            if (event.shiftKey && keyCode != 16) return; //16 is shift
            const cell = keyDictionary[keyCode];
            if (!cell) return true;
            cell.activate(cell, event.ctrlKey, doActivate);
            event.preventDefault();
            return false;
        }; //keyHandler
        window.onkeydown = function (event) { keyHandler(event, true); }
        window.onkeyup = function (event) { keyHandler(event, false); }
        const startingRow = definitionSet.hardwareKeyboardControl.startingRow;
        let rowIndex = startingRow;
        let xShift = 0;
        for (let row of hardwareKeyboard.rows) {
            let xIndex = definitionSet.hardwareKeyboardControl.keyShift;
            if (keyboardHandler.rows[rowIndex].length % 2 > 0)
                xShift++;
            xIndex -= rowIndex - xShift;
            for (let key of row) {
                const cell = keyboardHandler.rows[rowIndex][xIndex];
                keyDictionary[key] = cell;
                cell.currentColor = definitionSet.highlightHardwareKey;
                cell.rectangle.style.fill = cell.currentColor;
                ++xIndex;
            } //loop xIndex
            ++rowIndex
        } //loop rowIndex
        for (let substitutionIndex in hardwareKeyboard.substitutions) {
            const substitution = hardwareKeyboard.substitutions[substitutionIndex];
            keyDictionary[substitutionIndex] = keyDictionary[substitution];
        } //loop hardwareKeyboard.substitutions
    })();

})();
