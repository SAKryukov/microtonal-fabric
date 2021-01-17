// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

const rhythmizationTimingChoice = {
    averageDuration: 0,
    keepDuration: 1,
    maximumDuration: 2,
    customDuration: 3,
    customLegato: 4,
    legato: 5};
const rhythmizationTimingChoiceDefault = rhythmizationTimingChoice.customLegato;
const rhythmizationTimingChoiceNames = [ "Average duration", "Keep original durations", "Maximum duration" , "Custom duration using Time", "Legato using Time", "Legato" ];

const what = www => www[0];
const where = www => www[1];
const when = www => www[2];

const rhythmizationTransform = (
    pattern, rhythmizationChoice, customDurationValue,
    subSequence,
    population, showException, sequenceMap) => {

    const throwBadPattern = () => { throw new Error("Invalid rhythmic pattern. Default (uniform) pattern is used."); };

    const patternValue = (pattern => {
        try {
            let firstBeatSize = null;
            let sameBeatSize = true;
            pattern = pattern.trim();
            if (!pattern.match(/^[0-9s]+$/)) throwBadPattern();
            const beats = pattern.match(/[^ ]+/g);
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
    })(pattern); //patternValue

    const uniformBeatSize = patternValue.length < 2;
    let reducedPattern = patternValue;
    if (!uniformBeatSize)
        reducedPattern = (pattern => {
            return pattern
            //SA???
        })(patternValue); //reducedPattern

    let customDuration = null;
    const rhythmizationTiming = rhythmizationChoice;
    if (rhythmizationTiming == rhythmizationTimingChoice.customDuration || rhythmizationTimingChoice.customLegato) {
        customDuration = parseInt(customDurationValue);
        if (!customDuration || isNaN(customDuration))
            return showException(new Error(`Invalid custom duration: ${customDurationValue}`));
    } //if customDuration
    
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
        const period = rhythmizationTiming == rhythmizationTimingChoice.customLegato ?
            customDuration
            :
            Math.round((timeLast - timeFirst) / pressCount);

            let duration = null;
        if (rhythmizationTiming == rhythmizationTimingChoice.customDuration || rhythmizationTiming == rhythmizationTimingChoice.customLegato)
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

}; //rhythmizationTransform
