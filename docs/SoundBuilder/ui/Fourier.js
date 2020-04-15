class FourierTable extends VariableTable {

    #derivedImplementation = {};

    constructor(element, typeSelector) {
        super(element);
        this.#derivedImplementation.typeSelector = typeSelector;
        typeSelector.onchange = ev => {
            element.style.visibility = ev.target.selectedIndex ? "collapse" : "visible";
            if (this.onchangeHandler) this.onchangeHandler(this, ev.target.selectedIndex);
        }; //typeSelector.onchange
    } //constructor

    onHeadersCreated(headers) {
        const buttonName = headers.dataset.buttonName;
        const addButton = (index) => {
            const button = document.createElement("button");
            button.textContent = buttonName;
            headers.children[index].appendChild(button);
            return button;
        }; //addButton
        const amplitudeResetter = addButton(1);
        const phaseResetter = addButton(2);
        amplitudeResetter.onclick = ev => {
            for (let index = this.metrics.rowFirst; index <= this.metrics.rowLast; ++index)
                this.getMapValue(this.getCell(index, 1)).value = 0;
        }; //amplitudeResetter.onclick
        phaseResetter.onclick = ev => {
            for (let index = this.metrics.rowFirst; index <= this.metrics.rowLast; ++index)
                this.getMapValue(this.getCell(index, 2)).value = -180 + index * 360/(this.metrics.rowLast - this.metrics.rowFirst);
        }; //phaseResetter.onclick
    } //onHeadersCreated

    fillNewCell(cell, row, column) {
        switch (column) {
            case 1:
                const sliderAmplitude = new Slider({ min: 0, max: 100, step: 0.1, indicatorWidth: "2.8em" });
                sliderAmplitude.onchange = (ptr, value) => { if (this.onchangeHandler) this.onchangeHandler(ptr, value); };
                this.setMapValue(cell, sliderAmplitude);
                return sliderAmplitude.element;
            case 2:
                const sliderPhase = new Slider({ value: 0, min: -180, max: +180, step: 0.1, indicatorWidth: "3.5em", indicatorSuffix: String.fromCodePoint(0xB0)  });
                sliderPhase.onchange = (ptr, value) => { if (this.onchangeHandler) this.onchangeHandler(ptr, value); }
                this.setMapValue(cell, sliderPhase);
                return sliderPhase.element;
            default: // 0:
                return row.toString();
        }
    } //fillNewCellHTML
    
    onRowRemoved(row) {
        for (let index = this.metrics.rowFirst; index <= this.metrics.rowLast; ++index)
            this.getCell(index, 0).textContent = `${index + 1}`;
    } //onRowRemoved

    get data() {
        const oscillator = { type: this.#derivedImplementation.typeSelector.value, Fourier: [] };
        let zero = true;
        for (let index = this.metrics.rowFirst; index <= this.metrics.rowLast; ++index) {
            const harmonic = parseInt(this.getCell(index, 0).textContent);
            const amplitude = this.getMapValue(this.getCell(index, 1)).value;
            if (amplitude > 0) zero = false;
            const phase = this.getMapValue(this.getCell(index, 2)).value;
            oscillator.Fourier.push({ harmonic: harmonic, amplitude: amplitude, phase: phase });
        } //loop
        if (zero) oscillator.Fourier = [];
        return oscillator;
    } //get values

    set data(oscillator) {
        if (!oscillator) return;
        this.#derivedImplementation.typeSelector.value = oscillator.type;
        const values = oscillator.Fourier;
        for (let index = 0; index < values.length; ++index) {
            if (index > this.metrics.rowLast)
                this.addRow();
            this.getMapValue(this.getCell(index, 1)).value = values[index].amplitude;
            this.getMapValue(this.getCell(index, 2)).value = values[index].phase;
        } //loop    
    } //set data

} //class FourierTable
