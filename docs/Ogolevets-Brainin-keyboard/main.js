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

        const keyboard = new Keyboard(controls);
        // A: key 68, 110/220/440/880 Hz
        // F: 43.65353 ?
        // F: 87.30706 ?
        const fa = 800 * Math.pow(2, -68/29);
        const instrument = new Instrument(keyboard.first, keyboard.last, fa, 29);
        const playHandler = (index, on) => {
            instrument.play(on, index);
            //alert(index);
        }
        keyboard.keyHandler = playHandler;
        
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
