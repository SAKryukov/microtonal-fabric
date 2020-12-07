"use strict";

class UserPopulation {

    #implementation = { rowLabelHandler: null, labelHandler: null, frequencySet: [] }

    constructor(data, keyboardRowCount, keyboardColumnCount) {
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
                if (data.rows[rowIndex][userRowLength - 1] == true) { // "repeat" indication
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
                    if (userCellData.label && userCellData.label.constructor == String)
                        labelRow[columnIndex] = userCellData.label;
                    else
                        labelRow[columnIndex] = null; // "disabled" indication
                    if (userCellData.interval && userCellData.interval.constructor == Interval)
                        this.#implementation.frequencySet[frequencySetIndex] = userCellData.interval.toReal() * data.base;
                    else if (userCellData.frequency && userCellData.frequency.constructor == Number)
                        this.#implementation.frequencySet[frequencySetIndex] = userCellData.frequency;
                } else if (userCellData === true) // "repeat" indication
                    repeatPoints.push({ row: rowIndex, column: columnIndex, frequencySetIndex: frequencySetIndex });
                else
                    labelRow[columnIndex] = null; // "disabled" indication
            } //loop columns
            labelSet.push(labelRow);
        } //loop rows
        for (let repeatItem of repeatPoints) {
            const sourceLength = repeatItem.column;
            let current = 0;
            for (let index = repeatItem.column; index < keyboardColumnCount; ++index) {
                labelSet[repeatItem.row][index] = labelSet[repeatItem.row][index - repeatItem.column];
                const power = Math.trunc(current/sourceLength) + 1;
                const octave = Math.pow(2, power);
                const sourceFrequency = this.#implementation.frequencySet[repeatItem.frequencySetIndex + current - repeatItem.column];
                if (sourceFrequency)
                    this.#implementation.frequencySet[repeatItem.frequencySetIndex + current] = sourceFrequency * octave;
                ++current;
            } //loop
            //alert(current);
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
    } //constructor

    get labelHandler() { return this.#implementation.labelHandler; }
    get titleHandler() { return this.#implementation.titleHandler; }
    get frequencySet() { return this.#implementation.frequencySet; }

} //class UserPopulation