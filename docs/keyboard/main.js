// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2019
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard"use strict";

(function main() {

    (function setCopyright() {
        definitionSet.elements.copyright.spanYears.textContent = definitionSet.options.copyright.years;
        definitionSet.elements.copyright.spanVersion.textContent = definitionSet.options.copyright.version;
    })(); //setCopyright

    (function MicrosoftFeatureRejection() {
        for (let attribute of definitionSet.elements.keyboard.attributes)
            break;
    })(); //MicrosoftFeatureRejection

    let visibleChordTable;
    let selectedTet;
    let chord;

    (function setupChordTables() {
        for (let chordSetElement of definitionSet.elements.chordSet) {
            const table = chordSetElement.table;
            const toneCount = chordSetElement.toneCount;
            const baseOctave = definitionSet.options.defaultOctave;
            const buildButton = chordSetElement.buildButton;
            buildButton.style.visibility = "hidden";
            const resetButton = chordSetElement.resetButton;
            const closeButton = chordSetElement.closeButton
            setupChordTable(table, toneCount, baseOctave, buildButton, resetButton, closeButton,
                function () {
                    keyboardHandler.chordSetter(visibleChordTable.chordBuilder.build());
                    showChordTable(visibleChordTable, false);
                });
        } //loop    
    })();

    function optimizeTableLocation(table) {
        const room = { x: window.innerWidth, y: window.innerHeight };
        const x = Math.floor((room.x - table.offsetWidth) / 2);
        const y = definitionSet.elements.keyboard.clientHeight - table.offsetHeight > 0 ?
            Math.floor((definitionSet.elements.keyboard.clientHeight - table.offsetHeight) / 2)
            : 22; //SA???
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

    definitionSet.elements.buttonShowChordTable.onclick = function (event) {
        showChordTable(selectedTet.chordTable, !visibleChordTable);
    } //definitionSet.elements.buttonShowChordTable.onclick

    function setTet(option, system, blocking) {
        let currentRow = 0;
        let currentNoteNumber = system.names.length; // 1 octave up, mostly to accommodate Janko which adds -1: definitionSet.notes.tet12Janko.smallRowIncrement: -1
        // we keep C at note #0
        let currentFirst = currentNoteNumber;
        const names = system.names;
        const bigRowIncrement = system.bigRowIncrement;
        const smallRowIncrement = system.smallRowIncrement;
        const rightIncrement = system.rightIncrement;
        keyboardStructure.labelKeys(function (cell) {
            cell.toneSystem = system;
            cell.note = currentNoteNumber;
            cell.tone = currentNoteNumber * 12 / system.names.length;
            const label = names[currentNoteNumber % names.length];
        currentRow = cell.row;
            const rowLength = keyboardStructure.rows[currentRow].length;
            if (cell.numberInRow == rowLength - 1) {
                let increment = (rowLength % 2) > 0 ? bigRowIncrement : smallRowIncrement;
                currentNoteNumber = currentFirst + increment;
                currentFirst = currentNoteNumber;
            } else
                currentNoteNumber += rightIncrement;
            return label;
        });
        if (blocking) keyboardStructure.block();
        keyboardHandler.chordSetter(option.chordTable.chordBuilder.build());
        if (!option) return;
        if (!option.chordTable) return;
        if (!visibleChordTable) return;
        showChordTable(visibleChordTable, false);
        showChordTable(option.chordTable, true);
    } //setTet
    
    definitionSet.elements.radioTet.radio12et.onclick = function (event) {
        if (event.target.checked) {
            setTet(event.target, definitionSet.notes.tet12);
            selectedTet = event.target;
        } //if
        definitionSet.elements.legend19et.style.visibility = "hidden";
        definitionSet.elements.legend29et.style.visibility = "hidden";
        definitionSet.elements.legend31et.style.visibility = "hidden";
        definitionSet.elements.buttonShowChordTable.disabled = false;
    };
    definitionSet.elements.radioTet.radio12etJanko.onclick = function (event) {
        if (event.target.checked) {
            setTet(event.target, definitionSet.notes.tet12Janko);
            selectedTet = event.target;
        } //if
        definitionSet.elements.legend19et.style.visibility = "hidden";
        definitionSet.elements.legend29et.style.visibility = "hidden";
        definitionSet.elements.legend31et.style.visibility = "hidden";
        definitionSet.elements.buttonShowChordTable.disabled = false;
    };
    definitionSet.elements.radioTet.radio19et.onclick = function (event) {
        if (event.target.checked) {
            setTet(event.target, definitionSet.notes.tet19);
            selectedTet = event.target;
        } //if
        definitionSet.elements.legend31et.style.visibility = "hidden";
        definitionSet.elements.legend29et.style.visibility = "hidden";
        definitionSet.elements.legend19et.style.visibility = "visible";
        definitionSet.elements.buttonShowChordTable.disabled = false;
    };
    definitionSet.elements.radioTet.radio29et.onclick = function (event) {
        if (event.target.checked) {
            setTet(event.target, definitionSet.notes.tet29);
            selectedTet = event.target;
        } //if            33
        definitionSet.elements.legend19et.style.visibility = "hidden";
        definitionSet.elements.legend31et.style.visibility = "hidden";
        definitionSet.elements.legend29et.style.visibility = "visible";
        definitionSet.elements.buttonShowChordTable.disabled = true;
    };
    definitionSet.elements.radioTet.radio31et.onclick = function (event) {
        if (event.target.checked) {
            setTet(event.target, definitionSet.notes.tet31);
            selectedTet = event.target;
        } //if            
        definitionSet.elements.legend19et.style.visibility = "hidden";
        definitionSet.elements.legend29et.style.visibility = "hidden";
        definitionSet.elements.legend31et.style.visibility = "visible";
        definitionSet.elements.buttonShowChordTable.disabled = false;
    };
    definitionSet.elements.radioTet.radio31et.checked = true;
    setTet(definitionSet.elements.radioTet.radio31et, definitionSet.notes.tet31, true);
    selectedTet = definitionSet.elements.radioTet.radio31et;
    definitionSet.elements.legend31et.style.visibility = "visible";
    keyboardStructure.block();

    (function setHardwareKeyboardControl() {
        let useComputerKeyboard = true;
        definitionSet.elements.showOptions.optionUseComputerKeyboard.checked = true;
        const keyDictionary = {};
        const markComputerKeyboard = function(doMark) {
            for (let index in keyDictionary) {
                const cell = keyDictionary[index];
                cell.currentColor = doMark ? definitionSet.options.highlightHardwareKey : definitionSet.options.highlightDefault;
                cell.rectangle.style.fill = cell.currentColor;                
            } //loop
        }; //markComputerKeyboard
        definitionSet.elements.showOptions.optionUseComputerKeyboard.onclick = function (event) {
            useComputerKeyboard = event.target.checked;
            markComputerKeyboard(useComputerKeyboard);
        }; //definitionSet.elements.showOptions.optionUseComputerKeyboard.onclick
        const keyHandler = function (event, doActivate) {
            if (doActivate && !useComputerKeyboard) return true;
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
        const placeKeys = () => {
            const location = (function test() {
                const startingRow = Math.round((keyboardStructure.rows.length - hardwareKeyboard.rows.length) / 2)
                const leftmost = -hardwareKeyboard.rows.length
                let rightmost = 0;
                for (let index = 0; index < hardwareKeyboard.rows.length; ++index) {
                    value = hardwareKeyboard.rows[index].length;
                    if (index % 2 == 0) value--; 
                    if (value > rightmost) rightmost = value;
                } //loop
                const width = rightmost;
                const keyShift = Math.round((definitionSet.options.keyboardSize.longRowWidth - width) / 2);
                return { startingRow: startingRow, keyShift: keyShift };  
            })();
            const startingRow = location.startingRow;
            let rowIndex = startingRow;
            let xShift = 0;
            const maxRowIndex = keyboardStructure.rows.length - 1;
            for (let row of hardwareKeyboard.rows) {
                if (rowIndex > maxRowIndex) break;
                let xIndex = location.startingRow + 1 + location.keyShift;
                if (keyboardStructure.rows[rowIndex].length % 2 > 0)
                    xShift++;
                xIndex -= rowIndex - xShift;
                const maxXIndex = keyboardStructure.rows[rowIndex].length - 1; 
                for (let key of row) {
                    if (xIndex > maxXIndex) break;
                    const cell = keyboardStructure.rows[rowIndex][xIndex];
                    if (!cell) break;
                    keyDictionary[key] = cell;
                    cell.currentColor = definitionSet.options.highlightHardwareKey;
                    cell.rectangle.style.fill = cell.currentColor;
                    ++xIndex;
                } //loop xIndex
                ++rowIndex
            } //loop rowIndex    
        } //placeKeys
        placeKeys();
        for (let substitutionIndex in hardwareKeyboard.substitutions) {
            const substitution = hardwareKeyboard.substitutions[substitutionIndex];
            keyDictionary[substitutionIndex] = keyDictionary[substitution];
        } //loop hardwareKeyboard.substitutions
    })(); //setHardwareKeyboardControl

    let started = false;
    const unblock = (keyEvent) => {
        if (started) return;
        if (keyEvent && (keyEvent.key.includes("Shift") || keyEvent.key.includes("Alt") || keyEvent.key.includes("Meta") || keyEvent.key.includes("Control")))
            return;
        keyboardHandler.setupTouch();
        keyboardHandler.audioContext.resume();
        keyboardStructure.unblock();
        started = true;
    } //unblock
    window.onclick = () => { unblock(); }
    window.onmouseup = () => { unblock(); }
    window.onkeydown = (keyEvent) => { unblock(keyEvent); }

})(); //main
