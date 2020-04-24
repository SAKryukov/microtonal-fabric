"use strict";

const instrumentList = {

    initialize: function(controls, exceptionHandler, clearExceptionHandler) { //exceptionHandler(Exception), clearExceptionHandler()
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
                        throw new Error(`header should be specified`);
                    if (!data.header.instrumentName)
                        throw new Error(`instrumentName should be specified`);
                } catch (ex) {
                    exceptionHandler(ex)
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
            const text = JSON.stringify(data, null, DefinitionSet.FileStorage.tabSizeJSON);
            const fileName = this.lastFileName ? this.lastFileName : DefinitionSet.FileStorage.initialInstrumentListFileName;
            const constantName = DefinitionSet.FileStorage.instrumentListFileObjectName;
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