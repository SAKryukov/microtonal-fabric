// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

const durationTimingChoice = {
    relativeToCurrentDuration: 0,
    fixed: 1,
    legato: 2,
};
const durationTimingChoiceDefault = durationTimingChoice.relativeToCurrentDuration;
const durationTimingChoiceNames = [ "Relative to current duration", "Fixed, ms", "Legato" ];

const what = www => www[0];
const where = www => www[1];
const when = www => www[2];
const setTime = (www, newValue) => www[2] = newValue;

const rhythmizationTransform = (population, showException) => {

    const throwBadPattern = () => { throw new Error("Invalid rhythmic pattern. Default (uniform) pattern is used."); };
    const throwBadDuration = () => { throw new Error("Invalid duration"); };
    const populateArray = (array, source) => array.push.apply(array, source);
    const populateArrayTo = (array, source, max) => {
        while (array.length < max)
            populateArray(array, source);
        array.splice(max);
    }; //populateArrayTo

    const buildRhythmicPattern = pattern => {
        try {
            let firstBeatSize = null;
            let sameBeatSize = true;
            pattern = pattern.trim();
            if (!pattern.match(/^[0-9\s]+$/)) throwBadPattern();
            const beats = pattern.match(/[^\s]+/g);
            if (beats.length < 1) throwBadPattern();
            const result = [];
            for (let beat of beats) {
                const beatSize = parseInt(beat);    
                if (beatSize === 0) throwBadPattern();
                if (firstBeatSize == null)
                    firstBeatSize = beatSize;
                if (sameBeatSize && beatSize != firstBeatSize)
                    sameBeatSize = false;
                result.push(beatSize);
            } //loop
            return sameBeatSize ? [] : result;
        } catch (ex) {
            showException(ex);
            return [];
        } //exception
    }; //buildRhythmicPattern

    const analyzeSequence = (subSequence, sequenceMap) => {
        const orderedSet = (() => {
            const result = [];
            for (let element of subSequence) {
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
        return orderedSet;
    }; //analyzeSequence

    const getSequenceMetrics = sequence => {
        let timeFirst = Number.POSITIVE_INFINITY;
        let timeLast = 0;
        let pressCount = 0;
        let maxDuration = -1;
        let durationSum = 0;
        let minDuration = Number.POSITIVE_INFINITY;
        for (let element of sequence) {
            if (!element.up) continue;
            if (!what(element.www)) continue;
            if (timeFirst > when(element.www)) timeFirst = when(element.www);
            if (timeLast < when(element.up.www)) timeLast = when(element.up.www);
            const duration = when(element.up.www) - when(element.www);
            if (duration < minDuration) minDuration = duration;
            if (duration > maxDuration) maxDuration = duration;
            durationSum += duration;
            pressCount++;
        } //loop
        return { timeFirst: timeFirst, timeLast: timeLast, pressCount: pressCount,
                 minDuration: minDuration, maxDuration: maxDuration,
                 durationSum: durationSum, totalDuration: timeLast - timeFirst };
    }; //getSequenceMetrics

    const doRhythmization = (subSequence, sequenceMap, rhythmicPattern, customBeatSize) => {
        const pattern = buildRhythmicPattern(rhythmicPattern);
        if (pattern.length < 1)
            pattern.push(1);
        const beatSize = parseInt(customBeatSize);
        const orderedSet = analyzeSequence(subSequence, sequenceMap);
        const metrics = getSequenceMetrics(orderedSet);
        if (!metrics.pressCount) return;
        if (!metrics.timeLast) return;
        if (!isFinite(metrics.timeFirst)) return;
        const durationSequence = [];
        populateArrayTo(durationSequence, pattern, metrics.pressCount);
        const beatCount = durationSequence.reduce(
            (accumulator, currentValue) => accumulator + currentValue, 0);
        const period = !!beatSize ? beatSize : metrics.totalDuration / beatCount;
        let index = 0;
        let lastTime = metrics.timeFirst;
        for (let element of orderedSet) {
            if (!element.up) continue;
            if (!what(element.www)) continue;
            const downTime = lastTime;
            const upTime = lastTime + period * durationSequence[index];
            lastTime = upTime;
            setTime(element.www, Math.round(downTime));
            setTime(element.up.www, Math.round(upTime));
            population.setOptionWww(element.element, element.www);
            population.setOptionWww(element.up.element, element.up.www);
            ++index;
        } //loop
    }; //doRhythmization

    const adjustDuration = (subSequence, sequenceMap, durationString, timing) => {
        const duration = timing == durationTimingChoice.fixed ? parseInt(durationString) : parseFloat(durationString);
        if (!duration && timing != durationTimingChoice.legato)
            try {
                throwBadDuration();
            } catch(ex) { showException(ex); }
        const orderedSet = analyzeSequence(subSequence, sequenceMap);
        const metrics = getSequenceMetrics(orderedSet);
        if (!metrics.pressCount) return;
        if (!metrics.timeLast) return;
        if (!isFinite(metrics.timeFirst)) return;
        let previousElement = null;
        for (let element of orderedSet) {
            if (!element.up) continue;
            if (!what(element.www)) continue;
            if (previousElement && timing == durationTimingChoice.legato) {
                setTime(previousElement.up.www, when(element.www));
                population.setOptionWww(previousElement.up.element, previousElement.up.www);
            } else {
                const downTime = when(element.www);
                const upTime = when(element.up.www);
                const currentDuration = upTime - downTime;
                    let effectiveDuration = null;
                switch (timing) {
                    case durationTimingChoice.fixed: effectiveDuration = duration; break;
                    case durationTimingChoice.relativeToCurrentDuration:
                        effectiveDuration = currentDuration * duration;
                    default: effectiveDuration = null;
                } //switch
                if (effectiveDuration) {
                    setTime(element.up.www, Math.round(downTime + effectiveDuration));
                    population.setOptionWww(element.up.element, element.up.www);    
                } //if
            } //if
            previousElement = element;
        } //loop
    }; //adjustDuration
    
    return { doRhythmization: doRhythmization, adjustDuration: adjustDuration };

}; //rhythmizationTransform
