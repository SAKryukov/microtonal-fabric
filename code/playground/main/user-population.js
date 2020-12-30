// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

"use strict";

class UserPopulation {

    #implementation = { rowLabelHandler: null, labelHandler: null, frequencySet: [] }

    constructor(data, keyboardRowCount, keyboardColumnCount, repeatObject) {
        const labelSet = [];
        const workingDimensions = (function getDimensions() {
            let maxRowCount = data.rows.length;
            if (keyboardRowCount < maxRowCount) maxRowCount = keyboardRowCount;
            let maxColumnCount = 0;
            for (let rowIndex = 0; rowIndex < maxRowCount; ++rowIndex) {
                const userRowLength = data.rows[rowIndex].length;
                if (userRowLength >= keyboardColumnCount) {
                    maxColumnCount = keyboardColumnCount; break;
                } //if
                if (data.rows[rowIndex][userRowLength - 1] === repeatObject) { // "repeat" indication
                    maxColumnCount = keyboardColumnCount; break;
                } else
                    if (userRowLength > maxColumnCount)
                        maxColumnCount = userRowLength;
            } //loop
            return { rowCount: maxRowCount, columnCount: maxColumnCount };
        })();
        const repeatPoints = [];
        for (let rowIndex = 0; rowIndex < workingDimensions.rowCount; ++rowIndex) {
            const labelRow = [];
            for (let columnIndex = 0; columnIndex < workingDimensions.columnCount; ++columnIndex) {
                const frequencySetIndex = rowIndex * keyboardColumnCount + columnIndex;
                const userCellData = data.rows[rowIndex][columnIndex];
                if (!userCellData) continue;
                if (userCellData.constructor == Interval || userCellData.constructor == Number) {
                    labelRow[columnIndex] = userCellData.toString();
                    if (userCellData.constructor == Interval) 
                        this.#implementation.frequencySet[frequencySetIndex] = userCellData.toReal() * data.base;
                    else // Number:
                        this.#implementation.frequencySet[frequencySetIndex] = userCellData;
                } else if (userCellData.constructor == Object) {
                    if (userCellData.label && userCellData.label.constructor == String) {
                        labelRow[columnIndex] = userCellData.label;
                    } else
                        labelRow[columnIndex] = null; // "disabled" indication
                    if (userCellData.interval && userCellData.interval.constructor == Interval)
                        this.#implementation.frequencySet[frequencySetIndex] = userCellData.interval.toReal() * data.base;
                    else if (userCellData.frequency && userCellData.frequency.constructor == Number)
                        this.#implementation.frequencySet[frequencySetIndex] = userCellData.frequency;
                    else if (userCellData === repeatObject) { // "repeat" indication
                        if (columnIndex == data.rows[rowIndex].length - 1)
                            repeatPoints.push({ row: rowIndex, column: columnIndex, frequencySetIndex: frequencySetIndex });
                    } else
                        labelRow[columnIndex] = null; // "disabled" indication
                } else
                    labelRow[columnIndex] = null; // "disabled" indication
            } //loop columns
            labelSet.push(labelRow);
        } //loop rows
        for (let repeatItem of repeatPoints) {
            const sourceLength = repeatItem.column;
            const targetLength = keyboardColumnCount - sourceLength;
            for (let index = repeatItem.column; index < keyboardColumnCount; ++index) {
                const steps = Math.trunc(targetLength/sourceLength) + 1;
                for (let stepIndex = 0; stepIndex < steps; ++stepIndex) {
                    const octave = Math.pow(2, stepIndex + 1);
                    for (let sourceIndex = 0; sourceIndex < sourceLength; ++sourceIndex) {
                        const sourceLabel = labelSet[repeatItem.row][sourceIndex];
                        const targetIndex = repeatItem.column +  stepIndex * sourceLength + sourceIndex;
                        if (targetIndex >= keyboardColumnCount) continue;
                        labelSet[repeatItem.row][targetIndex] = sourceLabel;
                        const sourceFrequencyIndex = repeatItem.frequencySetIndex - sourceLength + sourceIndex;
                        const sourceFrequency = this.#implementation.frequencySet[sourceFrequencyIndex];
                        if (!sourceFrequency) continue;
                        const targetFrequencyIndex = targetIndex - repeatItem.column + repeatItem.frequencySetIndex;
                        this.#implementation.frequencySet[targetFrequencyIndex] = sourceFrequency * octave;
                    } //loop within step
                } //loop step
            } //loop
        } //loop repeatPoints
        this.#implementation.labelHandler = (x, y) => {
            const row = labelSet[y];
            if (!row) return null;
            return row[x];
        }; //this.#implementation.labelHandler
        const titleSet = [];
        if (data.rowTitles && data.rowTitles.constructor == Array)
            for (let index = 0; index < data.rowTitles.length; ++index)
                if (data.rowTitles[index])
                    titleSet[index] = data.rowTitles[index].toString();
        this.#implementation.titleHandler = (x, y) => {
            return titleSet[y];
        } //this.#implementation.titleHandler
        this.#implementation.cleanUp = () => {
            this.#implementation.frequencySet = undefined;
            data.rows = undefined;
            data.rowTitles = undefined;
            data.metadata = undefined;
            labelSet.splice(0, labelSet.length);
        } //this.#implementation.cleanUp
    } //constructor

    static validate() {
        const userDataType = typeof(tones);
        if (!userDataType) return undefined;
        if (userDataType == typeof(undefined)) return undefined;
        if (!tones.size) return "invalid or undefined tones.size";
        if (!tones.size.width) return "invalid or undefined tones.size.width";
        if (!tones.size.height) return "invalid or undefined tones.size.height";
        if (tones.size.width.constructor != Number) return "tones.size.width is not a number";
        if (tones.size.height.constructor != Number) return "tones.size.height is not a number";
        if (!tones.rows) return "invalid or undefined tones.row";
        if (tones.rows.constructor != Array) return "tones.rows is not an array"
        let index = 0;
        for (let element of tones.rows) {
            if (!element) return `invalid row ${index}`;
            if (element.constructor != Array) return `in tones.rows, row ${index} is not an array`;
            ++index;
        } //loop
        return true;
    } //validate

    get labelHandler() { return this.#implementation.labelHandler; }
    get titleHandler() { return this.#implementation.titleHandler; }
    get frequencySet() { return this.#implementation.frequencySet; }

    cleanUp() { this.#implementation.cleanUp(); }

} //class UserPopulation