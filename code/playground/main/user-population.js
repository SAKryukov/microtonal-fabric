// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

class UserPopulation {

    #implementation = { rowLabelHandler: null, labelHandler: null, frequencySet: [] }

    static definitionSet = {
        audibleDomain: [20, 16000], //Hz
    }

    constructor(data, keyboardRowCount, keyboardColumnCount, repeatObject) {
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
        this.#implementation.workingDimensions = workingDimensions;
        const rowDescriptors = [];
        for (let rowIndex = 0; rowIndex < workingDimensions.rowCount; ++rowIndex) {
            const rowDescriptor = { cyclicPosition: 0, };
            let maxColumns = 0;
            for (let columnIndex = 0; columnIndex < workingDimensions.columnCount; ++columnIndex) {
                const userCellData = data.rows[rowIndex][columnIndex];
                if (!userCellData) break;
                if (userCellData === repeatObject) break;
                ++maxColumns;
            } //loop columns
            rowDescriptor.cycleSize = maxColumns;
            rowDescriptors.push(rowDescriptor);
        } //loop rows
        const getFrequencyFromUserData = userCellData => {
            if (userCellData.constructor == Interval)
                return userCellData.toReal() * data.base;
            else if (userCellData.constructor == Number)
                return userCellData;
            else if (userCellData.constructor == Object) {
                if (userCellData.interval)
                    return userCellData.interval.toReal() * data.base;
                else if (userCellData.frequency)
                    return userCellData.frequency;
            } //if
        } //getFrequencyFromUserData
        const frequencyDomain = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]; // min, max
        const trackFrequencyDomain = (frequencyDomain, frequency) => {
            if (frequency < frequencyDomain[0])
                frequencyDomain[0] = frequency;
            if (frequency > frequencyDomain[1])
                frequencyDomain[1] = frequency;
        }; //trackFrequencyDomain
        this.#implementation.createRowFrequencySet = rowIndex => {
            const result = [];
            const column = rowIndex % workingDimensions.columnCount;
            const startingIndex = rowIndex - column;
            for (let index = startingIndex; index < startingIndex + rowDescriptors[rowIndex].cycleSize; ++index) {
                const frequency = getFrequencyFromUserData(data.rows[rowIndex][index]);
                result.push(frequency);
                trackFrequencyDomain(frequencyDomain, frequency);
            } //loop population
            //SA cycle here!
            let octave = 2;
            let indexInBase = 0;
            for (let index = startingIndex + rowDescriptors[rowIndex].cycleSize; index < workingDimensions.columnCount; ++index) {
                const upperFrequency = result[indexInBase] * octave;
                trackFrequencyDomain(frequencyDomain, upperFrequency);
                result[index] = upperFrequency;
                if (indexInBase == rowDescriptors[rowIndex].cycleSize) {
                    octave *= 2;
                    indexInBase = 0;
                } //if
                ++indexInBase;
            } //loop repetitions
            return result;
        }; //this.#implementation.createRowFrequencySet
        this.#implementation.titleHandler = (x, y) => {
            const shift = rowDescriptors[y].cyclicPosition;
            return data.rowTitles[y][shift];
        } //this.#implementation.titleHandler
        const getLabelFromUserData = userCellData => {
            if (!userCellData) return null;
            if (userCellData.constructor == Interval)
                return userCellData.toString();
            else if (userCellData.constructor == Number)
                return userCellData.toString();
            else if (userCellData.constructor == Object)
                return userCellData.label;
        }; //getLabel
        this.#implementation.labelHandler = (x, y) => {
            //SA??? Cycle here!
            const userCellData = data.rows[y][x % rowDescriptors[y].cycleSize];
            return getLabelFromUserData(userCellData);
        }; //this.#implementation.labelHandler
        if (!data.transpositionUnits) return;
        const audibleDomain = this.constructor.definitionSet.audibleDomain;
        this.#implementation.getRealisticTransposition = () => [
            Math.ceil(data.transpositionUnits * (Math.log2(audibleDomain[0]) - Math.log2(frequencyDomain[0]))),
            Math.floor((data.transpositionUnits * (Math.log2(audibleDomain[1]) - Math.log2(frequencyDomain[1])))),
        ]; //this.#implementation.realisticTransposition
    } //constructor

    static validate(repeatObject) {
        const userDataType = typeof(tones);
        if (!userDataType) return undefined;
        if (userDataType == typeof(undefined)) return undefined;
        if (!tones.size) return "invalid or undefined tones.size";
        if (!tones.size.width) return "invalid or undefined tones.size.width";
        if (!tones.size.height) return "invalid or undefined tones.size.height";
        if (tones.size.width.constructor != Number) return `tones.size.width is not a number, cannot be “${tones.size.width}”`;
        if (tones.size.height.constructor != Number) return `tones.size.height is not a number, cannot be “${tones.size.height}”`;
        if (!tones.rows) return "invalid or undefined tones.row";
        if (tones.rows.constructor != Array) return "tones.rows is not an array"
        const invalidElementMessage = (element, row, indexInRow, extra) => {
            if (!extra) extra = "";
            return `invalid element ${element} in tones.row[${index}], index in row: ${indexInRow}${extra}`;
        }
        let index = 0;
        for (let row of tones.rows) {
            if (!row) return `invalid row ${index}`;
            if (row.constructor != Array) return `in tones.rows, row ${index} is not an array`;
            let indexInRow = 0;
            for (let element of row) {
                if (!element)
                    return invalidElementMessage(element, index, indexInRow);
                if (element.constructor == Number) {
                    if (element <= 0)
                        return invalidElementMessage(element, index, indexInRow, "; frequency shoud be positive");
                } //if Number
                if (element.constructor == Object) {
                    if (element === repeatObject) continue;
                    if (element.frequency == null && element.interval == null)
                        return invalidElementMessage(element, index, indexInRow, "; neither frequency nor interval are defined");
                    if (element.frequency != null) {
                        if (element.frequency.constructor != Number)
                            return invalidElementMessage(element, index, indexInRow, "; invalid frequency");
                        else if (element.frequency <= 0)
                            return invalidElementMessage(element, index, indexInRow, "; frequency shoud be positive");
                    } //if Object with frequency
                    if (element.interval != null) {
                        if (element.interval.constructor != Interval)
                            return invalidElementMessage(element.interval, index, indexInRow, "; interval is not of the type Interval");
                        if (!element.interval.real || element.interval.real <= 0)
                            return invalidElementMessage(element.interval.real, index, indexInRow, "; invalid interval value, should be positive rational number");
                    } //if Object with interval
                } //if Object
                ++indexInRow;
            } //loop in row
            ++index;
        } //loop
        if (tones.transpositionUnits != null) {
            if (tones.transpositionUnits.constructor != Number || tones.transpositionUnits <= 0)
                return `transpositionUnits should be a positive integer number, cannot be “${tones.transpositionUnits}”`;
        } //tones.transpositionUnits
        return true;
    } //validatef

    get labelHandler() { return this.#implementation.labelHandler; }
    get titleHandler() { return this.#implementation.titleHandler; }
    get transpositionUnits() { return tones.transpositionUnits; }
    get realisticTransposition() { return this.#implementation.getRealisticTransposition(); } // array [min, max]
    get workingDimensions() { return this.#implementation.workingDimensions; }

    createRowFrequencySet(rowIndex) { return this.#implementation.createRowFrequencySet(rowIndex); }

} //class UserPopulation