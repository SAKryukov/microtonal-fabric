"use strict";

const repeat = true;

const tones = {
    base: 220, //Hz
    rows: [
        [ new Interval(1, 1), new Interval(3/4), repeat ],
        [ 220, 110, new Interval(12/200), {label: "asas", frequency: 32}],
        [],
        [], 
    ], 
};