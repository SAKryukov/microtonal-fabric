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

    const rhythmizationTimingChoice = {
        averageDuration: 0,
        keepDuration: 1,
        maximumDuration: 2,
        customDuration: 3,
        uniformLegato: 4,
        legato: 5};
    const rhythmizationTimingChoiceDefault = rhythmizationTimingChoice.uniformLegato;
    const rhythmizationTimingChoiceNames = [ "Average duration", "Keep original durations", "Maximum duration" , "Custom duration using Time", "Uniform legato using Time", "Legato" ];

    const controls = getControls();
    for (let value of rhythmizationTimingChoiceNames) {
        const option = document.createElement("option");
        option.textContent = value;
        controls.advanced.rhythmizationTiming.appendChild(option)
    } //loop
    controls.advanced.rhythmizationTiming.selectedIndex = rhythmizationTimingChoiceDefault;

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

    const population = {
        clear: () => {
            sequenceMap.clear();
            while (controls.sequence.firstElementChild)
                controls.sequence.removeChild(controls.sequence.firstElementChild);
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
        addElement: function(sequenceElement, select) {
            const option = document.createElement("option");
            if (sequenceElement.constructor != String)
                this.setOptionWww(option, sequenceElement);
            else
                option.textContent = this.formatMark(sequenceElement);
            if (select) option.selected = true;
            controls.sequence.appendChild(option);
            return option;
        },
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
        const data = [];
        if (controls.sequence.children.length < 1) return;
        for (let child of controls.sequence.children) {
            const sequenceElement = sequenceMap.get(child);
            data.push({
                selected: child.selected,
                element: sequenceElement ? new Object(sequenceElement) : child.textContent.substring(1)
            });
        } //loop
        if (data.length < 1) return;
        historyAgent.push(data);
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

    const populate = (sequence, append) => {
        if (!append)
            population.clear();
        for (let www of sequence)
            population.addElement(www);
    } //populate

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
        showException();
        navigator.clipboard.readText().then(value => {
            try {
                const validatedSequence = Recorder.readAndValidateData(value); // from ui.components/Recorder.js
                if (!validatedSequence)
                    throw new Error("Invalid sequence");
                populate(validatedSequence, append);
                toHistory(historyAgent);
            } catch (ex) {
                showException(ex);
            } //exception
        });
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
            population.setOptionWww(option, www);
        } //loop
        toHistory(historyAgent);
    }; //shift

    const addMark = value => {
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
        controls.sequence.insertBefore(mark, selected[0]);
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
            const option = document.createElement("option");
            option.textContent = element.textContent;
            controls.sequence.insertBefore(option, insertElement);
            sequenceMap.set(sequenceMap.get(element));
            element.selected = false;
            option.selected = true;
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

    const doRhythmization = () => {
        showException();
        let customDuration = null;
        const rhythmizationTiming = controls.advanced.rhythmizationTiming.selectedIndex;
        if (rhythmizationTiming == rhythmizationTimingChoice.customDuration || rhythmizationTimingChoice.uniformLegato) {
            customDuration = parseInt(controls.shift.time.input.value);
            if (!customDuration || isNaN(customDuration))
                return showException(new Error(`Invalid custom duration: ${controls.shift.time.input.value}`));
        } //if customDuration
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
        const history = (orderedSet => { // segregate histories of each key
            const history = new Map();
            for (let element of orderedSet) {
                const key = where(element.www);
                let historyList = history.get(key);
                if (!historyList) {
                    historyList = [];
                    history.set(key, historyList);
                } //if
                historyList.push(element);
            } //loop
            return history;
        }) (orderedSet);
        (history => {
            for (let [_, historyList] of history) {
                if (historyList.length < 2) continue;
                let lastDown = null;
                let lastUp = null;
                for (let element of historyList) {
                    if (what(element.www))
                        lastDown = element;
                    else {
                        lastUp = element;
                        if (lastDown)
                            lastDown.up = element;
                    } //if
                } //loop historyList
            } //loop
        })(history);
        ((sequence) => {
            let timeFirst = Number.POSITIVE_INFINITY;
            let timeLast = 0;
            let pressCount = 0;
            let maxDuration = -1;
            let sumDuration = 0;
            for (let element of sequence) {
                if (!element.up) continue;
                if (!what(element.www)) continue;
                if (timeFirst > when(element.www)) timeFirst = when(element.www);
                if (timeLast < when(element.www)) timeLast = when(element.www);
                const duration = when(element.up.www) - when(element.www);
                if (maxDuration < duration) maxDuration = duration;
                sumDuration += duration;
                pressCount++;
            } //loop
            if (!pressCount) return;
            if (!timeLast) return;
            if (!isFinite(timeFirst)) return;
            const period = rhythmizationTiming == rhythmizationTimingChoice.uniformLegato ?
                customDuration
                :
                Math.round((timeLast - timeFirst) / pressCount);
            let duration = null;
            if (rhythmizationTiming == rhythmizationTimingChoice.customDuration || rhythmizationTiming == rhythmizationTimingChoice.uniformLegato)
                duration = customDuration;
            else if (rhythmizationTiming == rhythmizationTimingChoice.averageDuration)
                duration = sumDuration / pressCount;
            else if (rhythmizationTiming == rhythmizationTimingChoice.maximumDuration)
                duration = maxDuration;
            else if (rhythmizationTiming == rhythmizationTimingChoice.legato)
                duration = period;
            // keepDuration is default
            let index = 0;
            for (let element of sequence) {
                if (!element.up) continue;
                if (!what(element.www)) continue;
                const effectiveDuration = duration != null ? duration : when(element.up.www) - when(element.www);
                element.www[2] = Math.round(timeFirst + index * period);
                element.up.www[2] = Math.round(when(element.www) + effectiveDuration);
                population.setOptionWww(element.element, element.www);
                population.setOptionWww(element.up.element, element.up.www);
                ++index;
            } //loop
        })(orderedSet);
        updateStatus(controls.sequence);
        toHistory(historyAgent);
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
