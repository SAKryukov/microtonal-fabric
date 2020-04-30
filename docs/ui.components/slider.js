class Slider {

    #implementation = {};

    constructor(properties /* { label, min, max, value, step, indicatorWidth, indicatorSuffix  } */, parent) {
        if (!parent) parent = document.createElement("div");
        if (!properties) properties = {};
        const theParent = parent;
        const closureThis = this;
        theParent.style.display = "grid";
        theParent.style.alignItems = "center";
        theParent.style.gridTemplateColumns = properties.label ? "min-content 1fr min-content" : "1fr min-content";
        let theValue = properties.value ? properties.value : 0;
        const slider = document.createElement("input");
        slider.setAttribute("type", "range");
        if (properties.min) slider.min = properties.min;
        if (properties.max) slider.max = properties.max;
        if (properties.step) slider.step = properties.step;
        const indicator = document.createElement("input");
        indicator.setAttribute("type", "text");
        indicator.onkeydown = event => {
            if (event.key != "Enter") return;
            const value = parseFloat(event.target.value);
            if (isFinite(value))
                closureThis.value = value;
            else
                event.target.value = properties.indicatorSuffix ? closureThis.value + properties.indicatorSuffix : closureThis.value;
        }; //indicator.onkeydown
        const focusedBackgroundColor = window.getComputedStyle(indicator).getPropertyValue("background-color");
        const unfocusedBackgroundColor = "transparent";
        indicator.style.backgroundColor = unfocusedBackgroundColor;
        indicator.onfocus = _ => event.target.style.backgroundColor = focusedBackgroundColor;
        indicator.onblur = event => {
            event.target.style.backgroundColor = unfocusedBackgroundColor;
            event.target.value = properties.indicatorSuffix ? closureThis.value + properties.indicatorSuffix : closureThis.value;
        }; //indicator.onblur
        indicator.style.border = "none";
        indicator.style.textAlign = "right";
        if (properties.indicatorWidth) indicator.style.width = properties.indicatorWidth;
        if (properties.label) {
            const label = document.createElement("label");
            label.style.whiteSpace = "nowrap";
            label.innerHTML = properties.label;
            theParent.appendChild(label);
        } //if label
        theParent.appendChild(slider);
        theParent.appendChild(indicator);
        let handler = null;
        const float = value => value.length == 0 ? 0 : parseFloat(value);
        const mouseToValue = event => {
            if (event.buttons != 1) return;
            event.preventDefault();
            const min = float(event.target.min);
            const max = float(event.target.max);
            const factor = 1.0 * event.offsetX / event.target.offsetWidth;
            this.value =  min + factor  * (max - min);
        }; //mouseToValue
        slider.onmouseenter = mouseToValue;
        slider.onmousemove = mouseToValue;
        slider.onkeydown = event => {
            const sign = event.key == "ArrowLeft" ? -1 : (event.key == "ArrowRight" ? 1 : 0);
            if (!sign) return;
            let factor;
            if (event.ctrlKey && event.shiftKey)
                factor = 1000;
            else if (event.shiftKey)
                factor = 100;
            else if (event.ctrlKey)
                factor = 10;
            else
                return;
            this.value += sign * factor * properties.step;
            event.preventDefault();
        }; //slider.onkeydown
        slider.title = `Ctrl+${String.fromCodePoint(0x2b82)} 10x step, Shift+${String.fromCodePoint(0x2b82)} 100x step, Ctrl+Shift+${String.fromCodePoint(0x2b82)} 1000x step`
        slider.onchange = event => {
            theValue = parseFloat(event.target.value);
            indicator.value = properties.indicatorSuffix ? slider.value + properties.indicatorSuffix : slider.value;
            if (handler) handler(this, theValue);
        }; //slider.onchange
        this.#implementation.setValue = value => {
            theValue = parseFloat(value);
            slider.value = value.toString();
            indicator.value = properties.indicatorSuffix ? slider.value + properties.indicatorSuffix : slider.value;
            if (handler) handler(this, theValue);
        }; //this.setValue
        this.#implementation.getValue = () => theValue;
        this.#implementation.setValue(theValue);
        this.#implementation.setFocus = () => slider.focus();
        this.#implementation.getParent = () => theParent;
        this.#implementation.setHandler = value => handler = value;
        this.#implementation.setDisabled = value => slider.disabled = value;
        this.#implementation.getDisabled = () => slider.disabled;
        this.#implementation.setLabel = aLabel => { if (aLabel && aLabel.htmlFor) slider.id = aLabel.htmlFor; };
    } //constructor

    get value() { return this.#implementation.getValue(); }
    set value(floatValue) { this.#implementation.setValue(floatValue); }
    
    get element() { return this.#implementation.getParent(); }

    focus() { this.#implementation.setFocus(); }

    set onchange(aHandler) { this.#implementation.setHandler(aHandler); } // handler(this, value)

    get disabled() { return this.#implementation.getDisabled(); }
    set disabled(value) { this.#implementation.setDisabled(value); }

    set label(aLabel) { this.#implementation.setLabel(aLabel); }

} //class Slider
