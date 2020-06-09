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

    const rhythmizationAlgorithms = {
        averageDuration: 0,
        maximumDuration: 1,
        customDuration: 2,
        legato: 3};
    const rhythmizationAlgorithmNames = [ "Average Duration", "Maximum Duration" , "Custom Duration using Time", "Legato" ];

    const controls = getControls();
    for (let value of rhythmizationAlgorithmNames) {
        const option = document.createElement("option");
        option.textContent = value;
        controls.advanced.rhythmizationAlgorithm.appendChild(option)
    } //loop
    controls.advanced.rhythmizationAlgorithm.selectedIndex = 0;

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
        for (let element of [controls.advanced.clone, controls.advanced.remove])
            element.disabled = !value;
        controls.advanced.rhythmization.disabled = target.selectedOptions.length < 6;
        controls.clipboard.to.disabled = !value;
    }; //updateStatus
    updateStatus(controls.sequence);
    controls.sequence.onchange = event => updateStatus(event.target);

    const what = www => www[0];
    const where = www => www[1];
    const when = www => www[2];

    const formatWwwItem = (what, where, when) => {
        where = `${where}`.padStart(3, "0");
        when = `${when}`.padStart(8, "0");
        return `${what} ${where} ${when}`;
    } //formatWwwItem

    const formatMark = value => {
        return `${String.fromCodePoint(0x274C)} ${value}`;
    } //formatMark

    const setOptionWww = (option, www) => {
        option.textContent = formatWwwItem(www[0], www[1], www[2]);
        sequenceMap.set(option, www);
    }; //setOptionWww

    const getSelection = select => {
        const selection = [];
        for(let option in select.children)
           selection.append(option);
        return selection;
    }; //getSelection
    const setSelection = (select, selection) => {
    } //setSelection

    const populate = (sequence, append) => {
        if (!append) {
            sequenceMap.clear();
            while (controls.sequence.firstElementChild)
                controls.sequence.removeChild(controls.sequence.firstElementChild);
        } //if
        let index = 0;
        for (let www of sequence) {
            const option = document.createElement("option");
            if (www.constructor != String)
                setOptionWww(option, www);
            else
                option.textContent = formatMark(www);
            controls.sequence.appendChild(option);
        } //loop
    } //populate

    const validateSequence = sequence => {
        if (sequence.constructor != Array) return false;
        for (let www of sequence) {
            if (!www) return false;
            if (www.constructor == String) continue;
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
        for (let element of controls.sequence.selectedOptions) {
            const data = sequenceMap.get(element);
            if (data)
                sequence.push(data);
            else
                sequence.push(element.textContent.slice(2)); // 2: exclude deletion and blank space
        } //loop
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
            setOptionWww(option, www);
        } //loop
    }; //shift

    const addMark = value => {
        const selected = controls.sequence.selectedOptions;
        if (selected.length < 1) return;
        const mark = document.createElement("option");
        mark.textContent = formatMark(value);
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

    const clone = () => {
        if (controls.sequence.selectedOptions.length < 1) return;
        const insertElement = controls.sequence.selectedOptions[0];
        for (let element of controls.sequence.selectedOptions) {
            const option = document.createElement("option");
            option.textContent = element.textContent;
            controls.sequence.insertBefore(option, insertElement);
            sequenceMap.set(sequenceMap.get(element));
            element.selected = false;
            option.selected = true;
        } //loop
        updateStatus(controls.sequence);
    }; //clone
    const remove = () => {
        const removeSet = [];
        for (let element of controls.sequence.selectedOptions)
            removeSet.push(element);
        for (let element of removeSet) {
            sequenceMap.delete(element);
            controls.sequence.removeChild(element);
        } //loop
        updateStatus(controls.sequence);
    }; //remove

    const doRhythmization = () => {
        const orderedSet = (() => {
            const result = [];
            for (let element of controls.sequence.selectedOptions) {
                const www = sequenceMap.get(element);
                if (www)
                    result.push({ element: element, www: www });
            } //loop            
            if (result.length < 6)
                return showException("Nothing to process");
            result.sort((left, right) => {
                if (what(left.www) == what(right.www) && where(left.www) == where(right.www) && when(left.www) == when(right.www)) return 0;
                if (when(left.www) < when(right.www)) return -1; else if (when(left.www) > when(right.www)) return 1;
                if (what(left.www) < what(right.www)) return 1; else if (what(left.www) > what(right.www)) return -1;
                if (where(left.www) < where(right.www)) return -1; else if (where(left.www) > where(right.www)) return 1;
            });
            return result;
        })();
        (orderedSet => {
            const aSet = new Map();
            for (let element of orderedSet) {
                const existingElement = aSet.get(where(element.www));
                if (existingElement) {
                    if (element.what) {
                        existingElement.push({down: { element: element.element, www: element.www }, up: null });
                    } else {
                        for (let note of existingElement) {
                            if (note.up) continue;
                            note.up = { element: element.element, www: element.www };
                            note.original.up = element;
                            break;
                        } //loop pairs    
                    } //if                
                } else
                    if (what(element.www))
                        aSet.set(where(element.www), [{ original: element, down: { element: element.element, www: element.www }, up: null }]);
            } //loop
        })(orderedSet);
        ((sequence) => {
            let timeFirst = Number.POSITIVE_INFINITY;
            let timeLast = 0;
            let pressCount = 0;
            for (let element of sequence) {
                if (!element.up) continue;
                if (!element.www[0]) continue;
                if (timeFirst > when(element.www)) timeFirst = when(element.www);
                if (timeLast < when(element.www)) timeLast = when(element.www);
                pressCount++;
            } //loop
            if (!pressCount) return;
            if (!timeLast) return;
            if (!isFinite(timeFirst)) return;
            const period = Math.round((timeLast - timeFirst) / pressCount);
            const duration = period; //SA???
            let index = 0;
            for (let element of sequence) {
                if (!element.up) continue;
                if (!element.www[0]) continue;
                element.www[2] = timeFirst + index * period;
                element.up.www[2] = when(element.www) + duration; //SA???
                setOptionWww(element.element, element.www);
                setOptionWww(element.up.element, element.up.www);
            } //loop
        })(orderedSet);
        updateStatus(controls.sequence);
    }; //doRhythmization

    // const filterInput = input => {
    //     input.onchange = event => {
    //         if (event.target.value != '0')
    //             event.preventDefault();
    //     }
    // }; //filterInput

    // filterInput(controls.shift.time.input);
    // filterInput(controls.shift.key.input);

    controls.clipboard.from.onclick = () => fromClipboard(false);
    controls.clipboard.appendFrom.onclick = () => fromClipboard(true);
    controls.clipboard.to.onclick = () => toClipboard();

    controls.shift.time.left.onclick = () => shift(2, controls.shift.time.input, operationKind.shiftBack);
    controls.shift.time.right.onclick = () => shift(2, controls.shift.time.input, operationKind.shiftForward);
    controls.shift.key.left.onclick = () => shift(1, controls.shift.key.input, operationKind.shiftBack);
    controls.shift.key.right.onclick = () => shift(1, controls.shift.key.input, operationKind.shiftForward);

    controls.shift.time.timeSet.onclick = () => shift(2, controls.shift.time.input, operationKind.set);
    controls.shift.time.tempoFactor.onclick = () => shift(2, controls.shift.time.input, operationKind.multiply);
    controls.mark.add.onclick = () => addMark(controls.mark.input.value);

    controls.move.up.onclick = () => moveUpDown(true);
    controls.move.down.onclick = () => moveUpDown(false);

    controls.advanced.clone.onclick = () => clone();
    controls.advanced.remove.onclick = () => remove();
    controls.advanced.rhythmization.onclick = () => doRhythmization();

    populate([[0, 0, 0]]);

}; //window.onload
