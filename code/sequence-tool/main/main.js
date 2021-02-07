// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

window.onload = () => {

    const controls = getControls();
    for (let value of durationTimingChoiceNames) {
        const option = document.createElement("option");
        option.textContent = value;
        controls.advanced.durationTiming.appendChild(option)
    } //loop
    controls.advanced.durationTiming.selectedIndex = durationTimingChoiceDefault;

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
        controls.advanced.durationAdjust.disabled = target.selectedOptions.length < 2; //SA???
        controls.advanced.rhythmization.disabled = target.selectedOptions.length < 6; //SA???
        controls.clipboard.to.disabled = !value;
    }; //updateStatus
    updateStatus(controls.sequence);
    controls.sequence.onchange = event => updateStatus(event.target);

    const population = {
        cloneObject: data => Object.assign({}, data),
        cloneArray: data => Object.assign([], data),
        clear: () => {
            sequenceMap.clear();
            while (controls.sequence.firstElementChild)
                controls.sequence.removeChild(controls.sequence.firstElementChild);
        },
        clearSelection: () => {
            for (let element of controls.sequence.children)
                element.selected = false;
        },
        formatWwwItem: (what, where, when) => {
            where = `${where}`.padStart(3, "0");
            when = `${when}`.padStart(8, "0");
            return `${what} ${where} ${when}`;
        },
        setOptionWww: function(option, www) {
            option.textContent = this.formatWwwItem(www[0], www[1], www[2]);
            sequenceMap.set(option, www);
        },
        formatMark: value => `${String.fromCodePoint(0x274C)} ${value}`,
        addElement: function(sequenceElement, select, optionParent, optionBefore) {
            const option = document.createElement("option");
            if (sequenceElement.constructor != String)
                this.setOptionWww(option, sequenceElement);
            else
                option.textContent = this.formatMark(sequenceElement);
            if (select) option.selected = true;
            if (optionParent && optionBefore)
                optionParent.insertBefore(option, optionBefore);
            else
                controls.sequence.appendChild(option);
            return option;
        },
        serializeOption: (element, sequenceMap) => {
            const data = sequenceMap.get(element);
            if (data)
                return data;
            else
                return element.textContent.slice(2);
        },
        loadSequence: function(sequence, append, select) {
            if (!append)
                this.clear();
            updateStatus(controls.sequence);
            for (let www of sequence)
                this.addElement(www, select);
        } //loadSequence
    }; //population

    const fromHistory = data => {
        if (!data) return;
        population.clear();
        for (const element of data) {
            const option = population.addElement(element.element);
            if (element.selected)
                option.selected = true;
        } //loop        
    }; //fromHistory
    const toHistory = historyAgent => {
        const core = (historyAgent) => {
            const data = [];
            if (controls.sequence.children.length < 1) return;
            for (let child of controls.sequence.children) {
                const sequenceElement = sequenceMap.get(child);
                data.push({
                    selected: child.selected,
                    element: sequenceElement ? population.cloneArray(sequenceElement) : child.textContent.slice(2)
                });
            } //loop
            if (data.length < 1) return;
            historyAgent.push(data);
        }; //core
        setTimeout(core, 0, historyAgent);
    }; //toHistory

    const historyAgent = (() => {
        const result = new History();
        const undo = () => fromHistory(result.undo());
        const redo = () => fromHistory(result.redo());
        window.onkeydown = event => {
            if (event.repeat) return;
            if (!event.ctrlKey) return;
            const doUndo = event.code == "KeyZ";
            const doRedo = event.code == "KeyY";
            if (!doUndo && !doRedo) return;
            if (doUndo) undo(); else if (doRedo) redo();
            event.preventDefault();
        }; //window.onclick
        return result;
    })(); //historyAgent

    const serialize = sequenceMap => {
        const sequence = [];
        for (let element of controls.sequence.selectedOptions) 
            sequence.push(population.serializeOption(element, sequenceMap));
        return JSON.stringify(sequence);
    } //serialize

    const fromClipboard = append => {
        showException();
        navigator.clipboard.readText().then(value => {
            try {
                const validatedSequence = Recorder.readAndValidateData(value, true); // from ui.components/Recorder.js
                if (!validatedSequence)
                    throw new Error("Invalid sequence");
                if (controls.sequence.selectedOptions.length > 0) {
                    toHistory(historyAgent); // save selection
                    population.clearSelection();
                } // do selection
                population.loadSequence(validatedSequence, append, true);
            } catch (ex) {
                showException(ex);
            } //exception
        });
        updateStatus(controls.sequence);
        toHistory(historyAgent);
    }; //fromClipboard

    const toClipboard = () => {
        showException();
        navigator.clipboard.writeText(serialize(sequenceMap));
    }; //toClipboard

    const operationKind = { shiftForward: 0, shiftBack: 1, multiply: 2, set: 3, };
    const shift = (indexInWWW, valueInput, operation) => {
        showException();
        let shiftValue = operation == operationKind.multiply ? parseFloat(valueInput.value) : parseInt(valueInput.value);
        if (isNaN(shiftValue)) return;
        if (operation == operationKind.shiftBack)
            shiftValue = -shiftValue;
         for (let option of controls.sequence.children) {
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
            population.setOptionWww(option, www);
        } //loop
        updateStatus(controls.sequence);
        toHistory(historyAgent);
    }; //shift

    const addMark = (value, isUp) => {
        showException();
        const selected = controls.sequence.selectedOptions;
        if (selected.length < 1) return;
        const mark = document.createElement("option");
        mark.textContent = population.formatMark(value);
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
        if (isUp)
            controls.sequence.insertBefore(mark, selected[0]);
        else {
            const next = selected[selected.length-1].nextElementSibling;
            if (next)
                controls.sequence.insertBefore(mark, next);
            else
                controls.sequence.appendChild(mark);
        } //if
        updateStatus(controls.sequence);
        toHistory(historyAgent);
    }; //addMark

    controls.sequence.onkeydown = event => {
        showException();
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
        showException();
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
        toHistory(historyAgent);
    }; //moveUpDown

    const clone = () => {
        showException();
        if (controls.sequence.selectedOptions.length < 1) return;
        const insertElement = controls.sequence.selectedOptions[0];
        for (let element of controls.sequence.selectedOptions) {
            const data = population.serializeOption(element, sequenceMap);
            const newOption = population.addElement(data, true, controls.sequence, insertElement);
            if (data.constructor != String)
                sequenceMap.set(newOption, data);
            element.selected = false;
        } //loop
        updateStatus(controls.sequence);
        toHistory(historyAgent);
    }; //clone
    const remove = () => {
        showException();
        const removeSet = [];
        for (let element of controls.sequence.selectedOptions)
            removeSet.push(element);
        for (let element of removeSet) {
            sequenceMap.delete(element);
            controls.sequence.removeChild(element);
        } //loop
        updateStatus(controls.sequence);
        toHistory(historyAgent);
    }; //remove

    const rhythmizationMethods = rhythmizationTransform(population, showException);

    const doRhythmization = () => {
        showException();
        rhythmizationMethods.doRhythmization(
            controls.sequence.selectedOptions,
            sequenceMap,
            controls.advanced.rhythmicPattern.value,
            controls.advanced.rhythmBeatTime.value);
        updateStatus(controls.sequence);
        toHistory(historyAgent);
    }; //doRhythmization

    const adjustDuration = () => {
        showException();
        rhythmizationMethods.adjustDuration(
            controls.sequence.selectedOptions,
            sequenceMap,
            controls.advanced.durationTime.value,
            controls.advanced.durationTiming.selectedIndex);
        updateStatus(controls.sequence);
        toHistory(historyAgent);
    }; //adjustDuration

    (function filterInputs() {
        const filterInput = (control, criterion) => {
            control.addEventListener('beforeinput', event => {
                if (event.data != null && !criterion(event.data, event.target.value))
                    event.preventDefault();
            });
        } //filterInput
        const filterInputInteger = control => filterInput(control, (data, _) => data.match(/^[0-9]+$/));
        const filterInputIntegerSet = control => filterInput(control, (data, _) => data.match(/^[0-9\s]+$/));
        const filterInputIntegerMixedNumberType = control => 
            filterInput(control, (data, value) => {
                const decimal = '.';
                if (value.includes(decimal) && data.includes(decimal)) return false;
                return data.match(/^[0-9\.]*$/);
            });
        //
        filterInputIntegerMixedNumberType(controls.shift.time.input);
        filterInputIntegerSet(controls.advanced.rhythmicPattern);
        filterInputInteger(controls.advanced.rhythmBeatTime);
        filterInputIntegerMixedNumberType(controls.advanced.durationTime);
    })(); //filterInputs

    controls.clipboard.from.onclick = () => fromClipboard(false);
    controls.clipboard.appendFrom.onclick = () => fromClipboard(true);
    controls.clipboard.to.onclick = () => toClipboard();

    controls.shift.time.left.onclick = () => shift(2, controls.shift.time.input, operationKind.shiftBack);
    controls.shift.time.right.onclick = () => shift(2, controls.shift.time.input, operationKind.shiftForward);
    controls.shift.key.left.onclick = () => shift(1, controls.shift.key.input, operationKind.shiftBack);
    controls.shift.key.right.onclick = () => shift(1, controls.shift.key.input, operationKind.shiftForward);

    controls.shift.time.timeSet.onclick = () => shift(2, controls.shift.time.input, operationKind.set);
    controls.shift.time.tempoFactor.onclick = () => shift(2, controls.shift.time.input, operationKind.multiply);
    controls.mark.addUp.onclick = () => addMark(controls.mark.input.value, true);
    controls.mark.addDown.onclick = () => addMark(controls.mark.input.value, false);

    controls.move.up.onclick = () => moveUpDown(true);
    controls.move.down.onclick = () => moveUpDown(false);

    controls.advanced.clone.onclick = () => clone();
    controls.advanced.remove.onclick = () => remove();
    controls.advanced.rhythmization.onclick = () => doRhythmization();
    controls.advanced.durationAdjust.onclick = () => adjustDuration();

    population.loadSequence([[0, 0, 0]]);
    setInterval(() => {
        controls.sequence.style.minWidth = `${controls.sequence.offsetWidth}px`;
    });
    toHistory(historyAgent);

    window.addEventListener("beforeunload", function (e) { // protect from losing unsaved data
        if (!historyAgent.canQuit) { // guarantee unload prompt for all browsers:
            e.preventDefault();
            e.returnValue = true; // show confirmation dialog!
        } else // guarantee unconditional unload for all browsers:
            delete(e.returnValue);
    }); // protect from losing unsaved data

    document.body.addEventListener("focusout", () => updateStatus(controls.sequence));
    document.body.addEventListener("focusin", () => updateStatus(controls.sequence));

}; //window.onload
