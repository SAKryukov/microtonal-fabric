﻿// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

class GridKeyboard extends AbstractKeyboard {

    testTest = { value: "value test" };

    constructor(element, keyWidth, keyHeight, rowCount, rowWidth, keyColors) {
        super(element, {keyWidth: keyWidth, keyHeight: keyHeight, rowCount: rowCount, rowWidth: rowWidth, keyColors: keyColors});
        this.derivedImplementation.keyColors = keyColors;
        this.metrics = { keyWidth: keyWidth, keyHeight: keyHeight, rowCount: rowCount, rowWidth: rowWidth };
    } //constructor

    //IKeyboardGeometry:

    createKeys(parentElement) {
        this.derivedImplementation.rows = [];
        const metrics = this.derivedClassConstructorArguments[0];
        while (parentElement.firstChild) parentElement.removeChild(parentElement.lastChild);
        const parseSize = stringValue => {
            if (!stringValue) return { vale: undefined, unit: undefined };
            const size = (/([0-9]*\.?[0-9]*)([a-zA-Z]*)/).exec(stringValue);
            const sizeValue = parseFloat(size[size.length-2]);
            const sizeUnit = size[size.length-1];
            return { value: sizeValue, unit: sizeUnit };
        } //parseSize
        const keySize = (() => {
            return {
                width: parseSize(metrics.keyWidth),
                height: parseSize(metrics.keyHeight)
            };
        })();
        this.derivedImplementation.defineGridTemplates = doFit => {
            const widthUnit = doFit ? "fr" : keySize.width.unit;
            const widthValue = doFit ? 1 : keySize.width.value;
            parentElement.style.gridTemplateColumns = `repeat(${metrics.rowWidth}, ${widthValue}${widthUnit})`;
        }; //this.derivedImplementation.defineGridTemplates
        this.derivedImplementation.fitView = value => {
            const fitWidth = parentElement.offsetWidth / metrics.rowWidth;
            this.derivedImplementation.defineGridTemplates(value);
            if (!(keySize.height.value && keySize.height.unit)) {
                const keyHeight = value ? `${fitWidth}px` : `${keySize.width.value}${keySize.width.unit}`;
                for (let key of parentElement.children)
                    key.style.height = keyHeight;
            }
        } //this.derivedImplementation.fitView
        this.derivedImplementation.fitView(false);
        parentElement.style.display = "grid";
        parentElement.style.overflowX = "auto";
        parentElement.style.width = "100%";
        const borderStyle = `solid ${metrics.keyColors.border} thin`;
        for (let yIndex = 0; yIndex < metrics.rowCount; ++yIndex) {
            this.derivedImplementation.rows[yIndex] = []; //SA???
            for (let xIndex = 0; xIndex < metrics.rowWidth; ++xIndex) {
                const key = document.createElement("div");
                this.derivedImplementation.rows[yIndex][xIndex] = key;
                key.style.borderRadius = "0px"; //SA???
                key.style.paddingLeft = "0.3em";
                key.style.paddingTop = "0.3em";
                key.style.overflow = "hidden";
                key.style.color = metrics.keyColors.label;
                key.style.backgroundColor = metrics.keyColors.background;
                key.style.height = metrics.keyHeight ? metrics.keyHeight : metrics.keyWidth;
                if (yIndex == 0)
                    key.style.borderTop = borderStyle;
                if (xIndex == 0)
                    key.style.borderLeft = borderStyle;
                key.style.borderBottom = borderStyle;
                key.style.borderRight = borderStyle;
                parentElement.appendChild(key);
            } //loop keys
        } //loop rows
        this.derivedImplementation.label = handler => {
            for (let [key, value] of this.keyMap) {
                const result = handler(value.x, value.y);
                if (result == null) { // disabled key mechanism
                    value.keyIndex = null;
                    key.style.backgroundColor = keyColors.disabled;
                } else
                    key.textContent = result;
            } //loop
        }; //this.derivedImplementation.label
        this.derivedImplementation.labelRow = (row, handler) => {
            for (let index = 0; index < this.derivedImplementation.rows[row].length; ++index) {
                const element = this.derivedImplementation.rows[row][index];
                const value = this.keyMap.get(element);
                const result = handler(index);
                if (result == null) { // disabled key mechanism
                    value.keyIndex = null;
                    element.style.backgroundColor = keyColors.disabled;
                } else
                    this.derivedImplementation.rows[row][index].textContent = result;
            } //loop
        }; //this.derivedImplementation.labelRow
        this.derivedImplementation.setTitles = handler => {
            for (let [key, value] of this.derivedImplementation.keyMap) {
                const result = handler(value.x, value.y);
                if (result)
                    key.title = result;
            } //loop
        }; //this.derivedImplementation.setTitles
        this.derivedImplementation.setRowTitles = (row, handler) => {
            for (let index = 0; index < this.derivedImplementation.rows[row].length; ++index) {
                const element = this.derivedImplementation.rows[row][index];
                const value = this.derivedImplementation.keyMap.get(element);
                const result = handler(index);
                if (result)
                    element.title = result;
            } //loop
        }; //this.derivedImplementation.setRowTitles
        return parentElement.children;
    } //IKeyboardGeometry.createKeys
    
    highlightKey(keyElement, keyboardMode) {
        switch (keyboardMode) {
            case keyHightlight.normal: return keyElement.style.backgroundColor = this.derivedImplementation.keyColors.background;
            case keyHightlight.down: return keyElement.style.backgroundColor = this.derivedImplementation.keyColors.hightlight;
            case keyHightlight.chord: return keyElement.style.backgroundColor = this.derivedImplementation.keyColors.chord;
            case keyHightlight.chordRoot: return keyElement.style.backgroundColor = this.derivedImplementation.keyColors.chordRoot;
        } //switch
    } //IKeyboardGeometry.highlightKey
    isTouchKey(parentElement, keyElement) {
        return keyElement && keyElement.parentElement == parentElement;
    } ////IKeyboardGeometry.isTouchKey
    get defaultChord() {} // should return array of indices of keys in default chord
    customKeyHandler(keyElement, keyData, on) {} // return false to stop embedded handling
    
    //IKeyboardGeometry
  
    label(handler) { this.derivedImplementation.label(handler); }
    labelRow(row, handler) { this.derivedImplementation.labelRow(row, handler); }
    setTitles(handler) { this.derivedImplementation.setTitles(handler); }
    setRowTitles(row, handler) { this.derivedImplementation.setRowTitles(row, handler); }

    set fitView(booleanValue) { this.derivedImplementation.fitView(booleanValue); }

} //class GridKeyboard
