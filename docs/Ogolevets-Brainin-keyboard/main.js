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

        const keyboards = [];
        for (let svg of controls.keyboards)
            keyboards.push(new Keyboard(svg));

        const temperament = (() => {
            const system = 29;
            const faOgolevets = 800 * Math.pow(2, -68/system);
            const startBrainin = 800 * Math.pow(2, -40/system);
            let instrument;
            return {
                system: system,
                startingFrequencies: [
                    faOgolevets,
                    startBrainin
            ]};
        })(); //temperament
        const setupInstrument = keyboardIndex => {
            instrument = new Instrument(
                keyboards[keyboardIndex].first, keyboards[keyboardIndex].last,
                temperament.startingFrequencies[keyboardIndex], temperament.system);
            const instrumentIndex = controls.instrument.selectedIndex >=0 ? controls.instrument.selectedIndex : 0;
            instrument.data = instrumentList[instrumentIndex];
            for (let aKeyboard of keyboards)
                aKeyboard.hide();
            keyboards[keyboardIndex].show();
        } //setupInstrument
        setupInstrument(0);

        controls.keyboardLayout.onchange = event => {
            setupInstrument(event.target.selectedIndex);
        }; //controls.keyboardLayout.onchange

        const playHandler = (index, on) => {
            instrument.play(on, index);
        }
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
        controls.instrument.onchange = event => {
            instrument.data = instrumentList[event.target.selectedIndex];
        };

        controls.playControl.volume.onchange = (self, value) => instrument.volume = value;
        controls.playControl.sustain.onchange = (self, value) => instrument.sustain = value;
    
    } //startApplication

};
