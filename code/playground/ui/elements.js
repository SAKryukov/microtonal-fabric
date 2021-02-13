const findElements = () => {
    const elements = {
        initialization: {
            startButton: document.querySelector("body > section > button"),
            startButtonParent: document.querySelector("body > section"),
            hiddenControls: document.querySelectorAll("main > section, header, main > article, main > details"),
        },
        keyboardParent: document.querySelector("#keyboard"),
        instrumentSelector: document.querySelector("#instrument"),
        recorder: {
            record: new TwoStateButton(document.querySelector("#recorder > section:first-of-type > button:first-of-type")),
            playSequence: document.querySelector("#recorder > section:first-of-type > button:last-of-type"),
            toClipboard: document.querySelector("#recorder > section:last-of-type > button:first-of-type"),
            fromClipboard: document.querySelector("#recorder > section:last-of-type > button:last-of-type"),
        },
        keyboardControl: {
            fit: new TwoStateButton(document.querySelector("#keyboard-control > button:first-child")),
            hightlight: new TwoStateButton(document.querySelector("#keyboard-control > button:nth-child(2)")),
            reset: document.querySelector("#keyboard-control > button:last-of-type"),
        },
        playControl: {
            volumeLabel: document.querySelector("#volume-control label"),
            volume: new Slider( { value: 0.4, min: 0, max: 1, step: 0.01, indicatorWidth: definitionSet.indicatorWidth },
                document.querySelector("#slider-volume")),
            sustainEnableButton: new TwoStateButton(document.querySelector("#sound-control button:first-of-type")),
            sustain: new Slider( { value: 0, min: 0, max: 10, step: 0.1, indicatorWidth: definitionSet.indicatorWidth, indicatorSuffix: " s" }, document.querySelector("#slider-sustain")),
            transpositionLabel: document.querySelector("#sound-control label:last-of-type"),
            transposition: new Slider( { value: 0, min: -100, max: 100, step: 1, indicatorWidth: definitionSet.indicatorWidth},
                document.querySelector("#slider-transposition")),
        },
        initialize: function () {
            this.recorder.record.isDown = false;
            this.playControl.sustainEnableButton.isDown = false;
        }
    }; //elements
    elements.initialize();
    return elements;    
}; //findElements
