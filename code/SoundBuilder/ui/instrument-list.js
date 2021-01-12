// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/5268512/Sound-Builder

"use strict";

class InstrumentListException extends Error {
    constructor(message, fileName, lineNumber, isWarning) {
        super(message, fileName, lineNumber);
        this.isWarning = isWarning;
    }
} //class InstrumentListException

const instrumentList = {

    initialize: function(controls, exceptionHandler, clearExceptionHandler) { //exceptionHandler(exception, customPrefix, customTitle), clearExceptionHandler()
        this.lastFileName = null;
        this.map = new Map();
        this.controls = controls;
        this.clear();
        this.updateStates();
        controls.list.onselectionchange = event => this.updateStates();
        controls.add.onclick = _ => {
            clearExceptionHandler();
            fileIO.loadTextFile(((fileName, text) => {
                let data;
                try {
                    data = JSON.parse(text);
                    if (!data.header)
                        throw new InstrumentListException(`header should be specified`);
                    if (!data.header.instrumentName) { //just warning:
                        data.header.instrumentName = fileName;
                        throw new InstrumentListException(`header.instrumentName should be specified`, null, null, true); 
                    } else
                        data.header.fileName = fileName;
                } catch (ex) {
                    const prefix = ex.isWarning ? "Warning" : "Error";
                    exceptionHandler(ex, prefix);
                    if (!ex.isWarning)
                        return;
                } //exception
                const option = document.createElement("option");
                option.textContent = `${data.header.instrumentName}`;
                controls.list.appendChild(option);
                controls.list.selectedIndex = controls.list.childElementCount - 1;
                this.map.set(option, data);
                this.updateStates();    
            }), ".json");
        }; //controls.add.onclick
        controls.remove.onclick = _ => {
            clearExceptionHandler();
            const currentSelection = controls.list.selectedIndex;
            controls.list.remove(currentSelection);
            this.map.delete(controls.list.children[currentSelection]);
            if (currentSelection > 0 && currentSelection < controls.list.childElementCount)
                controls.list.selectedIndex = currentSelection;
            else if (currentSelection - 1 > 0 && currentSelection - 1 < controls.list.childElementCount)
                controls.list.selectedIndex = currentSelection - 1;
            else if (controls.list.childElementCount > 0)
                controls.list.selectedIndex = 0;
            this.updateStates();
        }; //controls.remove.onclick
        controls.save.onclick = _ => {
            clearExceptionHandler();
            if (controls.list.childElementCount < 1) return;
            const data = [];
            let mapIndex = 0;
            for (let _ in controls.list.children) {
                if (controls.list.children[mapIndex] && controls.list.children[mapIndex].constructor == HTMLOptionElement)
                    data[mapIndex] = this.map.get(controls.list.children[mapIndex]);
                ++mapIndex;
            } //loop
            const text = JSON.stringify(data, null, definitionSet.fileStorage.tabSizeJSON);
            const fileName = this.lastFileName ? this.lastFileName : definitionSet.fileStorage.initialInstrumentListFileName;
            const constantName = definitionSet.fileStorage.instrumentListFileObjectName;
            fileIO.storeFile(fileName, `const ${constantName} = ${text}; //${constantName}`);
        }; //controls.save.onclick
    }, //initialize

    clear: function() {
        while(this.controls.list.childElementCount > 0)
            this.controls.list.remove(this.controls.list.lastChild);
    }, //clear

    updateStates: function() {
        this.controls.save.disabled = this.controls.list.childElementCount < 1;
        this.controls.remove.disabled = (this.controls.list.childElementCount < 1) || this.controls.list.selectedIndex < 0;
        this.controls.list.style.visibility = this.controls.list.childElementCount > 0 ? "visible" : "hidden";
    }, //updateStates

}; //instrumentList