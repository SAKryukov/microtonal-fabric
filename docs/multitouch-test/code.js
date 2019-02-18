document.body.onload = function () {

    let useMouse = false;
    const boolUseMouse = document.getElementById("bool-use-mouse");
    boolUseMouse.onclick = checkMouseOption = (ev) => { useMouse = ev.target.checked; }; 

    const turn = (target, touch, on) => {
        if (on) {
            target.style.backgroundColor = "red";
            if (touch)
                target.textContent = target.dataset.index + ": " + touch.radiusX * touch.radiusY;     
        } else {
            target.style.backgroundColor = "yellow";
            target.textContent = target.dataset.index;     
        } //if
    }; //turn

    setMultiTouch(
        (element) => { return element.dataset.index; }, //elementSelector
        (element, touch, on) => { turn(element, touch, on); } //elementHandler
    );

    const container = document.querySelector("body section");
    let current = container.firstElementChild;
    while (current) {
        current.dataset.index = current.textContent;
        current.onmouseenter = (ev) => {
            ev.preventDefault();
            if (!useMouse) return;
            if (ev.buttons == 1)
                turn(ev.target, null, true);
        } //current.onmouseenter
        current.onmouseleave = (ev) => {
            ev.preventDefault();
            if (!useMouse) return;
            turn(ev.target, null, false);
        } //current.onmouseleave
        current.onmousedown = (ev) => {
            ev.preventDefault();
            if (!useMouse) return;
            if (ev.buttons == 1)
                turn(ev.target, null, true);
        } //current.onmouseenter
        current.onmouseup = (ev) => {
            ev.preventDefault();
            if (!useMouse) return;
            turn(ev.target, null, false);
        } //current.onmouseleave
        current = current.nextElementSibling;
    } //loop

}; //document.body.onload
