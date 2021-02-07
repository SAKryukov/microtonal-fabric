// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const setupGainCompensation = controls => {

    controls.tables.compensation.middleFrequencyReset.onclick = () => 
        controls.tables.compensation.middleFrequency.value = defaultInstrument.gainCompensation.middleFrequency;

    controls.tables.compensation.lowFrequencyCompensationGainReset.onclick = () =>
        controls.tables.compensation.lowFrequencyCompensationGain.value = defaultInstrument.gainCompensation.lowFrequencyCompensationGain;

    controls.tables.compensation.highFrequencyCompensationGainReset.onclick = () =>
        controls.tables.compensation.highFrequencyCompensationGain.value = defaultInstrument.gainCompensation.highFrequencyCompensationGain;

}; //setupGainCompensation