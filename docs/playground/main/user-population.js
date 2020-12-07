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
        for (let rowIndex = 0; rowIndex < workingDimensions.rowCount; ++rowIndex) {
            const labelRow = [];
            for (let columnIndex = 0; columnIndex < workingDimensions.columnCount; ++columnIndex) {
                const userCellData = data.rows[rowIndex][columnIndex];
                if (!userCellData) continue;
                if (userCellData.constructor == Interval || userCellData.constructor == Number) {
                    labelRow[columnIndex] = userCellData.toString();
                } else if (userCellData.constructor == Object) {
                    if (userCellData.label && userCellData.label.constructor == String)
                        labelRow[columnIndex] = userCellData.label;
                    else
                        labelRow[columnIndex] = null; // "disabled" indication
                } else
                    labelRow[columnIndex] = null; // "disabled" indication
            } //loop columns
            labelSet.push(labelRow);
        } //loop rows
        this.#implementation.labelHandler = (x, y) => {
            const row = labelSet[y];
            if (!row) return null;
            return row[x];
        }; //this.#implementation.labelHandler
    } //constructor

    get labelHandler() { return this.#implementation.labelHandler; }
    get frequencySet() { return this.#implementation.frequencySet; }

} //class UserPopulation