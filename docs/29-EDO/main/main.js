"use strict";

window.onload = () => {
    
    (function Initialize() {
        const initializerControls = findInitializerControls();
        initializerControls.initializerButton.focus();
        if (initializationController.badJavaScriptEngine()) return;
        initializationController.initialize(
            initializerControls.hidden,
            initializerControls.initializerButton,
            initializerControls.initializer,
            startApplication
        );    
    })(); //Initialize

    function startApplication() {

        const controls = findControls();

        controls.version.textContent = definitionSet.version;

        const keyboards = [];
        (function setupKeyboards() {
            let index = 0;
            for (let svg of controls.keyboards)
                keyboards.push(new Keyboard(svg, definitionSet.keyboardOptions, definitionSet.temperament.defaultChords[index++]));
        })(); //setupKeyboards

        let activeInstrumentIndex = 0;
        let instrument;
        const setupInstrument = keyboardIndex => {
            activeInstrumentIndex = keyboardIndex;
            const temperament = definitionSet.temperament;
            const instrumentIndex = controls.instrument.selectedIndex >=0 ? controls.instrument.selectedIndex : 0;
            let startingFrequency = temperament.startingFrequencies[keyboardIndex];
            instrument = new Instrument(keyboards[keyboardIndex].first, keyboards[keyboardIndex].last, startingFrequency, temperament.system);
            instrument.data = instrumentList[instrumentIndex];
            for (let aKeyboard of keyboards)
                aKeyboard.hide();
            keyboards[keyboardIndex].show();
        } //setupInstrument
        setupInstrument(0);

        controls.keyboardLayout.onchange = event => {
            setupInstrument(event.target.selectedIndex);
        }; //controls.keyboardLayout.onchange

        const playHandler = (index, on) => { instrument.play(on, index); };
        for (let aKeyboard of keyboards)
            aKeyboard.keyHandler = playHandler;
        instrument.data = instrumentList[0];
        for (let index in instrumentList) {
            const instrument = instrumentList[index];
            const option = document.createElement("option");
            if (index == 0) option.selected = true;
            option.textContent = instrument.header.instrumentName;
            controls.instrument.appendChild(option);
        } //loop
        controls.instrument.onchange = event => { instrument.data = instrumentList[event.target.selectedIndex]; };

        controls.playControl.volume.onchange = (self, value) => instrument.volume = value;
        controls.playControl.sustain.onchange = (self, value) => instrument.sustain = value;
        controls.playControl.clearChord.onclick = _ => { keyboards[activeInstrumentIndex].clearChord(); }

        (function setupModeKeyboardModeControl() {
            const setKeyboardMode = (mode, toView) => {
                keyboards[activeInstrumentIndex].mode = mode;
                controls.playControl.clearChord.disabled = mode == keyboardMode.chord;
                if (!toView) return;
                switch (mode) {
                    case keyboardMode.normal: return controls.playMode.normal.checked = true;
                    case keyboardMode.chord: return controls.playMode.chord.checked = true;
                    case keyboardMode.chordRootSet:
                    case keyboardMode.chordSet: return controls.playMode.chordSet.checked = true;
                } //switch
            } //setKeyboardMode
            const keyboardModeChangedHandler = (event, mode) => { if (event.target.checked) setKeyboardMode(mode); }
            controls.playMode.normal.onchange = event => { keyboardModeChangedHandler(event, keyboardMode.normal); }
            controls.playMode.chord.onchange = event => { keyboardModeChangedHandler(event, keyboardMode.chord); }
            controls.playMode.chordSet.onchange = event => { keyboardModeChangedHandler(event, keyboardMode.chordSet); }
            const windowUpDownKeyHandler = (event, down) => {
                if (event.repeat) return;
                const isControl = event.key == "Control";
                const isShift = event.key == "Shift";
                if (!(isControl || isShift)) return;
                let mode;
                if (isShift) {
                    if (event.ctrlKey)
                        mode = down ? keyboardMode.chordSet | keyboardMode.chordRootSet : keyboardMode.chord;
                    else
                        mode = down ? keyboardMode.chordSet : keyboardMode.normal;
                } else if (isControl) {
                    if (event.shiftKey)
                        mode = down ? keyboardMode.chordSet | keyboardMode.chordRootSet : keyboardMode.chordSet;
                    else
                        mode = down ? keyboardMode.chord : keyboardMode.normal;
                } //if
                setKeyboardMode(mode, true);
            }; //windowUpDownKeyHandler
            window.onkeydown = event => { windowUpDownKeyHandler(event, true); }
            window.onkeyup = event => { windowUpDownKeyHandler(event, false); }
        })();
    
    } //startApplication

};
