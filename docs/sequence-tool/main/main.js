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
    const thinSpace = String.fromCodePoint(0x2009);
    controls.product.textContent = `${sharedDefinitionSet.years}, v.${thinSpace}${sharedDefinitionSet.version}`;
    const sequenceMap = new Map();

    const showException = ex => {
        controls.error.textContent = ex ? ex.message : "";
    }; //showException

    const updateStatus = target => {
        const value = target.selectedOptions.length > 0;
        for (let index in controls.shift.time)
            controls.shift.time[index].disabled = !value;
        for (let index in controls.shift.key)
            controls.shift.key[index].disabled = !value;
        for (let index in controls.mark)
            controls.mark[index].disabled = !value;
        for (let element of [controls.move.up, controls.move.down])
            element.disabled = !value;
    }; //updateStatus
    updateStatus(controls.sequence);
    controls.sequence.onchange = event => updateStatus(event.target);

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
            if (element[1].constructor == Array)
                sequence.push(element[1]);
        return JSON.stringify(sequence);
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

    const operationKind = { shiftForward: 0, shiftBack: 1, multiply: 2, set: 3, };
    const shift = (indexInWWW, valueInput, operation) => {
        let shiftValue = operation == operationKind.multiply ? parseFloat(valueInput.value) : parseInt(valueInput.value);
        if (!shiftValue || isNaN(shiftValue)) return;
        if (operation == operationKind.shiftBack)
            shiftValue = -shiftValue;
        for(let option of controls.sequence.children) {
            if (!option.selected) continue;
            const www = sequenceMap.get(option);
            if (!www) continue;
            if (operation == operationKind.shiftBack || operation == operationKind.shiftForward)
                www[indexInWWW] += shiftValue;
            else if (operation == operationKind.multiply)
                www[indexInWWW] = Math.round(www[indexInWWW] * shiftValue);
            else
                www[indexInWWW] = shiftValue;
            if (www[indexInWWW] < 0)
                www[indexInWWW] = 0;
            option.textContent = formatWwwItem(www[0], www[1], www[2]);
            sequenceMap.set(option, www);
        } //loop
    }; //shift

    const addMark = value => {
        const selected = controls.sequence.selectedOptions;
        if (selected.length < 1) return;
        const mark = document.createElement("option");
        mark.textContent = `${String.fromCodePoint(0x274C)} ${value}`;
        mark.onclick = event => {
            const style = getComputedStyle(event.target);
            const mainText = document.createElement("span");
            mainText.style.font = style.getPropertyValue("font");
            const text = document.createElement("span");
            text.textContent = event.target.textContent[0];
            mainText.appendChild(text);
            document.body.appendChild(mainText);
            const textWidth = text.offsetWidth;
            document.body.removeChild(mainText);
            const left = parseInt(style.getPropertyValue('padding-left'));
            const position = event.clientX - event.target.offsetLeft;
            const correctClick = left <= position && position <= left + textWidth;
            if (!correctClick) return;
            const list = event.target.parentElement;
            list.removeChild(event.target);
            updateStatus(list);
        }; //mark.onclick
        controls.sequence.insertBefore(mark, selected[0]);
    }; //addMark

    controls.sequence.onkeydown = event => {
        if (event.key != "Delete") return;
        const selected = [];
        for (let option of controls.sequence.selectedOptions)
            selected.push(option);
        for (let option of selected)
            if (!sequenceMap.get(option))
                controls.sequence.removeChild(option);
        updateStatus(controls.sequence);
    }; //controls.sequence.onkeydown

    const moveUpDown = up => {
        if (controls.sequence.selectedOptions.length < 1) return;
        let index = 0;        
        const selected = [];
        for (let option of controls.sequence.children) {
            if (option.selected)
                selected.push({ selected: option, index: index});
            ++index;
        } //loop
        if (up && selected[0].index < 1) return;
        if (!up && selected[selected.length - 1] > controls.sequence.childElementCount - 1) return;
        const shift = up ? -1 : 1;
        if (shift < 0)
            for (let element of selected) {
                controls.sequence.removeChild(element.selected);
                controls.sequence.insertBefore(element.selected, controls.sequence.children[element.index + shift]);
            } //loop
        else
            for (let index = selected.length - 1; index >= 0; --index) {
                const element = selected[index];
                controls.sequence.removeChild(element.selected);
                controls.sequence.insertBefore(element.selected, controls.sequence.children[element.index + shift]);
            } //loop
        updateStatus(controls.sequence);
    }; //moveUpDown

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

    controls.shift.time.left.onclick = () => shift(2, controls.shift.time.input, operationKind.shiftBack);
    controls.shift.time.right.onclick = () => shift(2, controls.shift.time.input, operationKind.shiftForward);
    controls.shift.key.left.onclick = () => shift(1, controls.shift.key.input, operationKind.shiftBack);
    controls.shift.key.right.onclick = () => shift(1, controls.shift.key.input, operationKind.shiftForward);

    controls.shift.time.timeSet.onclick = () => shift(2, controls.shift.time.input, operationKind.set);
    controls.shift.time.tempoFactor.onclick = () => shift(2, controls.shift.time.input, operationKind.multiply);
    controls.mark.add.onclick = () => addMark(controls.mark.input.value);

    controls.move.up.onclick = () => moveUpDown(true);
    controls.move.down.onclick = () => moveUpDown(false);

    populate([[0, 0, 0]]);

}; //window.onload
