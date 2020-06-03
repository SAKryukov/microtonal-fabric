// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

window.onload = () => {

    const controls = getControls();
    const sequenceMap = new Map();

    const showException = ex => {
        controls.error.textContent = ex ? ex.message : "";
    }; //showException

    const formatWwwItem = (what, where, when) => {
        where = `${where}`.padStart(3, "0");
        when = `${when}`.padStart(8, "0");
        return `${what} ${where} ${when}`;
    } //formatWwwItem

    const getSelection = select => {
        const selection = [];
        for(let option in select.children)
           selection.append(option);
        return selection;
    }; //getSelection
    const setSelection = (select, selection) => {
    } //setSelection

    const populate = (sequence, append) => {
        sequenceMap.clear();
        if (!append)
            while (controls.sequence.firstElementChild)
                controls.sequence.removeChild(controls.sequence.firstElementChild);
        let index = 0;
        for (let www of sequence) {
            const option = document.createElement("option");
            option.textContent = formatWwwItem(www[0], www[1], www[2]);
            controls.sequence.appendChild(option);
            sequenceMap.set(option, www);
        } //loop
    } //populate

    const validateSequence = sequence => {
        if (sequence.constructor != Array) return false;
        for (let www of sequence) {
            if (!www) return false;
            if (www.constructor != Array) return false;
            if (www.length != 3) return false;
            let index = 0;
            for (let w of www) {
                if (index == 0 && w !== 0 && w !== 1)
                    return false;
                if (w == undefined || w == null) return;
                if (w.constructor != Number) return;
                ++index;
            } //loop w
        } //loop www
        return sequence;
    } //validateSequence

    const serialize = sequenceMap => {
        const sequence = [];
        for (let element of sequenceMap) 
            sequence.push(element[1]);
        return JSON.serialize(sequence);
    } //serialize

    const fromClipboard = append => {
        showException(null);
        navigator.clipboard.readText().then(value => {
            try {
                const sequence = JSON.parse(value);
                const validatedSequence = validateSequence(sequence);
                if (!validatedSequence)
                    throw new Error("Invalid sequence");
                populate(validatedSequence, append);
            } catch (ex) {
                showException(ex);
            } //exception
        });
    }; //fromClipboard

    const toClipboard = append => {
        showException(null);
        navigator.clipboard.writeText(serialize(sequenceMap));
    }; //toClipboard

    const shift = (indexInWWW, valueInput, forward) => {
        let shiftValue = parseInt(valueInput.value);
        if (!shiftValue || isNaN(shiftValue)) return;
        if (!forward) shiftValue = -shiftValue;
        for(let option of controls.sequence.children) {
            if (!option.selected) continue;
            const www = sequenceMap.get(option);
            www[indexInWWW] += shiftValue;
            if (www[indexInWWW] < 0)
                www[indexInWWW] = 0;
            option.textContent = formatWwwItem(www[0], www[1], www[2]);
            sequenceMap.set(option, www);
        } //loop
    }; //shift

    // const filterInput = input => {
    //     input.onchange = event => {
    //         if (event.target.value != '0')
    //             event.preventDefault();
    //     }
    // }; //filterInput

    // filterInput(controls.shift.time.input);
    // filterInput(controls.shift.key.input);

    controls.keyboard.from.onclick = () => fromClipboard(false);
    controls.keyboard.appendFrom.onclick = () => fromClipboard(true);
    controls.keyboard.to.onclick = () => toClipboard();

    controls.shift.time.left.onclick = () => shift(2, controls.shift.time.input, false);
    controls.shift.time.right.onclick = () => shift(2, controls.shift.time.input, true);
    controls.shift.key.left.onclick = () => shift(1, controls.shift.key.input, false);
    controls.shift.key.right.onclick = () => shift(1, controls.shift.key.input, true);

    populate([[0, 0, 0]]);

}; //window.onload
