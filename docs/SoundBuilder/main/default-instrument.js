const defaultInstrument = {
    compensationGain: 0.7,
    oscillator: {
        type: "Fourier",
        Fourier: [
            {
                harmonic: 1,
                amplitude: 81.5,
                phase: 42.26086956521738
            },
            {
                harmonic: 2,
                amplitude: 98.85222381635582,
                phase: 17.739130434782595
            },
            {
                harmonic: 3,
                amplitude: 97.41750358680056,
                phase: -3.1304347826086882
            },
            {
                harmonic: 4,
                amplitude: 95.1219512195122,
                phase: -28.69565217391306
            }
        ]
    },
    gainEnvelope: {
        stages: [],
        dampingSustain: 0.02
    },
    detuneEnvelope: {
        stages: [],
        dampingSustain: 0.02
    },
    frequencyModulation: {
        absoluteFrequency: {
            masterDepth: 1,
            modes: []
        },
        relativeFrequency: {
            masterDepth: 1,
            modes: []
        },
        envelope: {
            stages: [],
            dampingSustain: 0.02
        }
    },
    amplitudeModulation: {
        absoluteFrequency: {
            masterDepth: 1,
            modes: []
        },
        relativeFrequency: {
            masterDepth: 1,
            modes: []
        },
        envelope: {
            stages: [],
            dampingSustain: 0.02
        }
    },
    filter: [
        {
            present: true,
            index: 0,
            type: "lowpass",
            frequency: 350,
            Q: 1
        },
        {
            present: false,
            index: 1,
            type: "highpass",
            frequency: 350,
            Q: 1
        },
        {
            present: false,
            index: 2,
            type: "bandpass",
            frequency: 350,
            Q: 1
        },
        {
            present: false,
            index: 3,
            type: "lowshelf",
            frequency: 350,
            gain: 1
        },
        {
            present: false,
            index: 4,
            type: "highshelf",
            frequency: 350,
            gain: 1
        },
        {
            present: false,
            index: 5,
            type: "peaking",
            frequency: 350,
            Q: 1,
            gain: 1
        },
        {
            present: false,
            index: 6,
            type: "notch",
            frequency: 350,
            Q: 1
        },
        {
            present: false,
            index: 7,
            type: "allpass",
            frequency: 350,
            Q: 1
        }
    ]
}