// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard"use strict";

const keyboardHandler = (function populate(comparer) {

    let soundAction = null; // soundAction: function(object, octave, tone, doStart)
    let chordSoundAction = null; // chordSoundAction: function(chord, doStart), where chord is and array of: {object, octave: element.octave, tone: element.tone}
    const setSoundActions = function (soundActionInstance, chordSoundActionInstance) {
        soundAction = soundActionInstance;
        chordSoundAction = chordSoundActionInstance;
    }; //setSoundActions

    (function setupComparer() {
        comparer.chordSet = { count: 0 };
        comparer.addChord = function(id, chordActivator) {
            if (comparer.chordSet.hasOwnProperty(id)) return;
            comparer.chordSet[id] = chordActivator;
            comparer.chordSet.count++;
            comparer.refresh(true);
        }; //comparer.addChord
        comparer.removeChord = function(id) {
            if (!comparer.chordSet.hasOwnProperty(id)) return;
            delete comparer.chordSet[id];
            comparer.chordSet.count--;
            comparer.refresh(comparer.chordSet.count > 0);
        }; //comparer.addChord
    })();

    const populateKeyboard = function (keyboard, chordActivator, toneSet) {

        chordActivator.chord = { count: 0 };

        const octaveGroups = [];
        for (let node of keyboard.childNodes) {
            if (node.constructor != SVGGElement) continue;
            let circleCount = 0;
            for (let circle of node.childNodes)
                if (circle.constructor == SVGCircleElement)
                    circleCount++;
            if (circleCount > 5) {
                const octave = [];
                for (let circle of node.childNodes)
                    if (circle.constructor == SVGCircleElement)
                        octave.push(circle);
                octaveGroups.push(octave);
            } //if
        } //loop counting

        const getKeyChordKey = function (key) { return key.octave | (key.note << 8); };
        const keyStates = { none: 0, sound: 1, chord: 2 };
        const setKeyState = function (key, value) {
            if (value == keyStates.sound)
                key.style.fill = definitionSet.highlightSound;
            else if (value == keyStates.chord)
                key.style.fill = definitionSet.highlightChordNote;
            else
                key.style.fill = definitionSet.highlightDefault;
            if (soundAction) {
                if (key.state == keyStates.sound && value == keyStates.none)
                    soundAction(key, key.octave, key.tone, false);
                else if (key.state == keyStates.none && value == keyStates.sound)
                    soundAction(key, key.octave, key.tone, true);
            } //soundAction
            key.state = value;
            const chordKeyKey = getKeyChordKey(key);
            if (value == keyStates.chord) {
                key.isInChord = true;
                chordActivator.chord[chordKeyKey] = key;
                chordActivator.chord.count++;
                chordActivator.setVisibility(chordActivator, true);
            } else {
                if (key.isInChord) {
                    key.isInChord = false;
                    delete chordActivator.chord[chordKeyKey];
                    chordActivator.chord.count--;
                } //if
                if (chordActivator.chord.count < 1)
                    chordActivator.setVisibility(chordActivator, false);
            } //if
        }; //setKeyState

        keyboard.setChordNode = function(octave, note, doSet) {
            const newState = doSet ? keyStates.chord : keyStates.none;
            setKeyState(octaveGroups[octaveGroups.length - octave - 1][octaveGroups[0].length - note - 1], newState);
        } //keyboard.setChordNode
        keyboard.clearChord = function() {
            const chordClone = Object.assign({}, chordActivator.chord);
            for (let index in chordClone) {
                const chordElement = chordClone[index];
                if (chordElement.constructor == Number) continue;
                setKeyState(chordElement, keyStates.none);
            } //loop chordClone
        } //keyboard.clearChord

        let octaveNumber = octaveGroups.length - 1;
        for (let octaveGroup of octaveGroups) {
            let currentNote = octaveGroup.length - 1;
            for (let circle of octaveGroup) {
                circle.state = keyStates.none;
                circle.octave = octaveNumber;
                circle.note = currentNote--;
                if (toneSet)
                    circle.tone = Math.log2(toneSet[circle.note]);
                else
                    circle.tone = circle.note / octaveGroup.length;
                circle.tone *= 12; // in Web Audio Font system, tones are expressed in 12-TET semitones
                circle.clearChord = function () { keyboard.clearChord(); };
                circle.activate = function (key, prefixed, doActivate) {
                    if (doActivate) {
                        if (prefixed) {
                            if (key.state == keyStates.chord)
                                setKeyState(key, keyStates.none);
                            else
                                setKeyState(key, keyStates.chord);
                        } else if (key.state != keyStates.chord)
                            setKeyState(key, keyStates.sound);
                    } else {
                        if (!prefixed && key.state == keyStates.sound) {
                            setKeyState(key, keyStates.none);
                        } //if prefixed
                    } //if activation/deactivation
                }; //circle.activate
                circle.onmouseenter = function (event) {
                    if (event.buttons == 1)
                        event.target.activate(event.target, event.shiftKey, true);
                    return false;
                };
                circle.onmouseleave = function (event) {
                    event.target.activate(event.target, event.shiftKey, false);
                    return false;
                };
                circle.onmousedown = function (event) {
                    if (event.button == 0)
                        event.target.activate(event.target, event.shiftKey, true);
                    else
                        event.target.activate(event.target, event.shiftKey, false);
                    return false;
                };
                circle.onmouseup = function (event) {
                    if (event.button == 0)
                        event.target.activate(event.target, event.shiftKey, false);
                    return false;
                };
                circle.ondblclick = function (event) {
                    if (event.button == 0)
                        event.target.clearChord();
                    return false;
                };
            } //loop
            octaveNumber--;
        } //loop octaveGroups

        const triggerChordSoundAction = function (chordOwner, doActivate) {
            if (!chordOwner.chord) return;
            if (chordSoundAction) {
                const exposeChord = [];
                for (let index in chordOwner.chord) {
                    const element = chordOwner.chord[index];
                    if (element.constructor == Number) continue;
                    exposeChord.push({ object: element, octave: element.octave, tone: element.tone });
                } //loop
                chordSoundAction(exposeChord, doActivate);
            } //if
        }; //triggerChordSoundAction

        chordActivator.activate = function (key, doActivate) {
            triggerChordSoundAction(chordActivator, doActivate);
            if (doActivate)
                key.style.fill = definitionSet.highlightChord;
            else
                key.style.fill = definitionSet.highlightDefault;
        } //chordActivator.activate
        chordActivator.setVisibility = function (activator, value) {
            if (value) {
                comparer.addChord(activator.id, activator);
                activator.style.visibility = "visible";
            } else {
                comparer.removeChord(activator.id);
                activator.style.visibility = "hidden";
            } //if
        } //chordActivator.setVisibility
        chordActivator.setVisibility(chordActivator, false);
        chordActivator.onmouseenter = function (event) {
            if (event.buttons == 1)
                event.target.activate(event.target, true);
            return false;
        };
        chordActivator.onmouseleave = function (event) {
            event.target.activate(event.target, false);
            return false;
        };
        chordActivator.onmousedown = function (event) {
            if (event.button == 0)
                event.target.activate(event.target, true);
            else
                event.target.activate(event.target, false);
            return false;
        };
        chordActivator.onmouseup = function (event) {
            if (event.button == 0)
                event.target.activate(event.target, false);
            return false;
        };

    }; //populateKeyboard

    for (let keyboard of elements.keyboardSet)
        populateKeyboard(keyboard.keyboard, keyboard.chordActivator, keyboard.tones);

    return { soundActionSetter: setSoundActions };

})(comparer);