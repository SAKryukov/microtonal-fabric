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
        const keyboard = new Keyboard(controls.keyboard, controls.keyArray);
        // A: key 68, 110/220/440/880 Hz        // F: 43.65353 ?
        // F: 87.30706 ?
        const faOgolevets = 800 * Math.pow(2, -68/29);
        const startBrainin = 800 * Math.pow(2, -40/29);
        let instrument;
        const startingFrequecies = [
            faOgolevets,
            startBrainin
        ]
        const setupInstrument = keyboardIndex => {
            instrument = new Instrument(keyboards[keyboardIndex].first, keyboards[keyboardIndex].last, startingFrequecies[keyboardIndex], 29);
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
            //alert(index);
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
