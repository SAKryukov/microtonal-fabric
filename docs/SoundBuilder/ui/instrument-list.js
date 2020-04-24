"use strict";

const instrumentList = {

    initialize: function(controls) {
        this.__debugCount = 0;
        this.controls = controls;
        this.clear();
        this.updateStates();
        controls.list.onselectionchange = event => this.updateStates();
        controls.add.onclick = event => {
            const option = document.createElement("option");
            option.textContent = `Noname instrument ${this.__debugCount++}`;
            controls.list.appendChild(option);
            controls.list.selectedIndex = controls.list.childElementCount - 1;
            this.updateStates();
        }; //controls.add.onclick
        controls.remove.onclick = event => {
            const currentSelection = controls.list.selectedIndex;
            controls.list.remove(currentSelection);
            if (currentSelection > 0 && currentSelection < controls.list.childElementCount)
                controls.list.selectedIndex = currentSelection;
            else if (currentSelection - 1 > 0 && currentSelection - 1 < controls.list.childElementCount)
                controls.list.selectedIndex = currentSelection - 1;
            else if (controls.list.childElementCount > 0)
                controls.list.selectedIndex = 0;
            this.updateStates();
        }; //controls.remove.onclick
    }, //initialize

    clear: function() {
        while(this.controls.list.childElementCount > 0)
            this.controls.list.remove(this.controls.list.lastChild);
    }, //clear

    updateStates: function() {
        this.controls.remove.disabled = (this.controls.list.childElementCount < 1) || this.controls.list.selectedIndex < 0;
        this.controls.list.style.visibility = this.controls.list.childElementCount > 0 ? "visible" : "hidden";
    }, //updateStates

}; //instrumentList