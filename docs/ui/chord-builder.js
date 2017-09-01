"use strict";

function ChordBuilder(table) {

    this.table = table;
    this.notes = [];

    const addInverter = function(radio, note, octaveValue) {
        if (!note.inverters)
            note.inverters = [];
        const inverterId = radio.dataset["inverter" + octaveValue];
        if (!inverterId) return;
        const inverter = document.getElementById(inverterId);
        if (!inverter) return;
        note.inverters.push(inverter);   
    } //addInverter
    const addInverters = function(radio, note) {
        addInverter(radio, note, 2);
        addInverter(radio, note, 4);
        if (note.inverters[1]) {
            if (note.inverters[1].lower) return;
            note.inverters[1].lower = note.inverters[0];
            note.inverters[1].onclick = function(event) {
                event.target.lower.disabled = event.target.checked;
            } //onclick
        } //if there are two
    } //addInverters

    ChordBuilder.prototype.parseTableElement = function (element) {
        for (let child of element.childNodes) {
            const constructor = child.constructor;
            if (constructor == HTMLInputElement) {
                if (child.dataset.note) {
                    const note = { radio: child };
                    note.note = child.dataset.note;
                    addInverters(child, note);
                    this.notes.push(note);
                } //if
            } //if
            this.parseTableElement(child);
        } //loop
    } //parseTableElement
    this.parseTableElement(this.table);

    ChordBuilder.prototype.build = function () {
        const result = [];
        for (let note of this.notes) {
            if (!note.radio.checked) continue;
            let octave = 0;
            if (note.inverters.length > 1 && note.inverters[1].checked) {
                    octave -= 2;
            } else if (note.inverters[0].checked)
                --octave;
            result.push({octave: octave, note: parseInt(note.note), title: note.radio.innerHTML });
        } //loop
        return result;
    } //build

    return this;

} //ChordBuilder