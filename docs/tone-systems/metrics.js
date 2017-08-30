const toneSystemMetrics = {
    just: {
        noteCount: 7,
        degreeMap: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6 }
    },
    tet12: {
        noteCount: 12,
        flat: -1,
        sharp: +1,
        degreeMap: { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 9: 14, 11: 17, 13: 21 }
    },
    tet19: {
        noteCount: 19,
        flat: -1,
        sharp: +1,
        degreeMap: { 1: 0, 2: 3, 3: 6, 4: 8, 5: 11, 6: 14, 7: 17, 8: 19, 9: 22, 11: 27, 13: 33 }
    },
    tet31: {
        noteCount: 31,
        flat: -2,
        sharp: +2,
        doubleFlat: -4,
        doubleSharp: +4,
        degreeMap: { 1: 0, 2: 5, 3: 10, 4: 13, 5: 18, 6: 23, 7: 28, 8: 31, 9: 36, 11: 44, 13: 54 }
    }
};