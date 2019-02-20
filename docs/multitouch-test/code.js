document.body.onload = function () {

    let useMouse = false;
    const boolUseMouse = document.getElementById("bool-use-mouse");
    boolUseMouse.onclick = checkMouseOption = (ev) => { useMouse = ev.target.checked; }; 

    const output = document.querySelector("textarea");
    const turn = (target, touch, on) => {
        if (on) {
            output.textContent = "";
            target.style.backgroundColor = "red";
            if (touch)
                target.textContent = target.dataset.index + ": " + Math.pow(touch.radiusX * touch.radiusY, 2).toPrecision(3);
        } else {
            target.style.backgroundColor = "yellow";
            target.textContent = target.dataset.index;     
        } //if
    }; //turn
    const handleVolume = (target, touch) => {
        if (!touch) return;
        const value = Math.pow(touch.radiusX * touch.radiusY, 2).toPrecision(3);
        target.textContent = target.dataset.index + ": " + value;
        output.textContent += "Volume change: " + value + "\n";
        output.scrollTop = output.scrollHeight;
    }; //handleVolume

    setMultiTouch(
        (element) => { return element.dataset.index; }, //elementSelector
        (element, touch, on) => { turn(element, touch, on); }, //elementHandler
        (element, touch) => { handleVolume(element, touch); } //sameElementHandler
    );

    const container = document.querySelector("body section");
    let current = container.firstElementChild;

    onHandler = (ev) => {
        ev.preventDefault();
        if (!useMouse) return;
        if (ev.buttons == 1)
            turn(ev.target, null, true);
    } //onHandler
    offHandler = (ev) => {
        ev.preventDefault();
        if (!useMouse) return;
        turn(ev.target, null, false);
    } //offHandler

    while (current) {
        current.dataset.index = current.textContent;
        current.onmouseenter = onHandler;
        current.onmouseleave = offHandler;
        current.onmousedown = onHandler;
        current.onmouseup = offHandler;
        current = current.nextElementSibling;
    } //loop

}; //document.body.onload
