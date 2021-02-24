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
            const doRepeat = data.rows[rowIndex][data.rows[rowIndex].length - 1] == repeat;
            const rowDescriptor = { cyclicShift: 0, intervalChain: null, repeat: doRepeat };
            let maxColumns = 0;
            for (let columnIndex = 0; columnIndex < workingDimensions.columnCount; ++columnIndex) {
                const userCellData = data.rows[rowIndex][columnIndex];
                if (!userCellData) break;
                if (userCellData === repeatObject) break;
                ++maxColumns;
            } //loop columns
            rowDescriptor.cycleSize = maxColumns;
            if (data.rowTitles && data.rowTitles[rowIndex]) {
                const lastIndex = data.rowTitles[rowIndex].length - 1;
                const lastObject = data.rowTitles[rowIndex][lastIndex];
                if (lastObject == repeatObject && data.rowTitles[rowIndex][lastIndex - 1] && data.rowTitles[rowIndex][lastIndex - 1].constructor == String)
                    rowDescriptor.repeatedTitleIndex = lastIndex - 1;
            } //if
            rowDescriptors.push(rowDescriptor);
        } //loop rows
        this.#implementation.cycleMode = (rowIndex, value) => {
            rowDescriptors[rowIndex].cyclicShift =
                (value + rowDescriptors[rowIndex].cyclicShift) % rowDescriptors[rowIndex].cycleSize;
        }; //this.#implementation.cycleMode
        this.#implementation.resetAllModes = () => {
            for (let rowIndex = 0; rowIndex < workingDimensions.rowCount; ++ rowIndex)
                rowDescriptors[rowIndex].cyclicShift = 0;
        }; //this.#implementation.resetAllModes
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
            if (rowIndex > this.#implementation.workingDimensions.rowCount - 1) return;
            const rowDescriptor = rowDescriptors[rowIndex];
            let result = null;
            const column = rowIndex % workingDimensions.columnCount;
            const startingIndex = rowIndex - column;
            if (rowDescriptor.cyclicShift == 0 || rowDescriptor.intervalChain == null) {
                const baseIntervalSet = [];
                for (let index = startingIndex; index < startingIndex + rowDescriptor.cycleSize; ++index) {
                    const shiftedIndex = index % rowDescriptor.cycleSize;
                    const frequency = getFrequencyFromUserData(data.rows[rowIndex][shiftedIndex]);
                    baseIntervalSet.push(frequency);
                    trackFrequencyDomain(frequencyDomain, frequency);
                } //loop population
                if (rowDescriptor.intervalChain == null) {
                    rowDescriptor.intervalChain = [];
                    for (let index = 1; index < baseIntervalSet.length; ++index)
                        rowDescriptor.intervalChain.push(baseIntervalSet[index]/baseIntervalSet[index - 1]);
                    rowDescriptor.intervalChain.push(
                        data.base * 2 / baseIntervalSet[baseIntervalSet.length - 1]); //sic!
                } //populate intervalChain
                if (rowDescriptor.cyclicShift == 0)
                    result = baseIntervalSet;
            } //if
            if (result == null) {
                let currentFrequency = data.base;
                result = [currentFrequency];
                for (let index = 0 + rowDescriptor.cyclicShift; index < rowDescriptor.cyclicShift + rowDescriptor.cycleSize; ++index) {
                    const indexInChain = index % rowDescriptor.intervalChain.length;
                    currentFrequency *= rowDescriptor.intervalChain[indexInChain];
                    result.push(currentFrequency);
                } //loop result from intervalChain
            } //if
            // now handle repetitions:
            let octave = 2;
            let indexInBase = 0;
            for (let index = startingIndex + rowDescriptor.cycleSize; index < workingDimensions.columnCount; ++index) {
                const upperFrequency = result[indexInBase] * octave;
                trackFrequencyDomain(frequencyDomain, upperFrequency);
                result[index] = upperFrequency;
                if (indexInBase == rowDescriptor.cycleSize) {
                    octave *= 2;
                    indexInBase = 0;
                } //if
                ++indexInBase;
            } //loop repetitions
            return result;
        }; //this.#implementation.createRowFrequencySet
        this.#implementation.titleHandler = (x, y) => {
            if (y > this.#implementation.workingDimensions.rowCount - 1) return;
            let shift = rowDescriptors[y].cyclicShift;
            if (!data.rowTitles) return;
            if (!data.rowTitles[y]) return;
            if (rowDescriptors[y].repeatedTitleIndex != null && shift >= rowDescriptors[y].repeatedTitleIndex)
                shift = rowDescriptors[y].repeatedTitleIndex;
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
            if (!rowDescriptors[y].repeat && x >= rowDescriptors[y].cycleSize) return null;
            if (y > this.#implementation.workingDimensions.rowCount - 1) return;
            const column = (x + rowDescriptors[y].cyclicShift) % rowDescriptors[y].cycleSize;
            const userCellData = data.rows[y][column];
            return getLabelFromUserData(userCellData);
        }; //this.#implementation.labelHandler
        if (!data.transpositionUnits) return;
        const audibleDomain = this.constructor.definitionSet.audibleDomain;
        this.#implementation.getRealisticTransposition = () => [
            Math.ceil(data.transpositionUnits * (Math.log2(audibleDomain[0]) - Math.log2(frequencyDomain[0]))),
            Math.floor((data.transpositionUnits * (Math.log2(audibleDomain[1]) - Math.log2(frequencyDomain[1])))),
        ]; //this.#implementation.realisticTransposition
    } //constructor

    static getKeyboardStyle() {
        if (!tones.keyboardStyle) return null;
        if (!tones.keyboardStyle.className) return null;
        if (!tones.keyboardStyle.className.constructor != String) return null;
        if (!tones.keyboardStyle.rules) return null;
        if (tones.keyboardStyle.rules.constructor != Array) return null;
        if (tones.keyboardStyle.rules.length < 1) return null;
        return [tones.keyboardStyle.className, tones.keyboardStyle.rules];
    } //getKeyboardStyle

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
        const validateKeyboardStyle = () => {
            if (!tones.keyboardStyle) return true;
            if (!tones.keyboardStyle.className) return "invalid or undefined tones.keyboardStyle.className";
            if (tones.keyboardStyle.className.constructor != String) return "tones.keyboardStyle.className must be a string";
            if (!tones.keyboardStyle.rules) return "invalid or undefined tones.keyboardStyle.rules";
            if (tones.keyboardStyle.rules.constructor != Array) return "tones.keyboardStyle.rules must be an array";
            if (tones.keyboardStyle.rules.length < 1) return "tones.keyboardStyle.rules must be a non-empty array";
            let ruleIndex = 0;
            for (let rule of tones.keyboardStyle.rules) {
                if (!rule) return `invalid or undefined tones.keyboardStyle.rules[${ruleIndex}]`;
                if (rule.constructor != String) return `invalid or undefined tones.keyboardStyle.rules[${ruleIndex}]: must be a string`;
                ++ruleIndex;
            } //loop
            return true;
        };
        return validateKeyboardStyle();
    } //validate

    get labelHandler() { return this.#implementation.labelHandler; }
    get titleHandler() { return this.#implementation.titleHandler; }
    get transpositionUnits() { return tones.transpositionUnits; } 
    get realisticTransposition() { // returns [min, max]:
        if (!tones.transpositionUnits) return;
        return this.#implementation.getRealisticTransposition();
    } //realisticTransposition
    get workingDimensions() { return this.#implementation.workingDimensions; }

    createRowFrequencySet(rowIndex) { return this.#implementation.createRowFrequencySet(rowIndex); }

    cycleMode(rowIndex, value) { this.#implementation.cycleMode(rowIndex, value); }
    resetAllModes() { this.#implementation.resetAllModes(); }

} //class UserPopulations