document.body.onload = function () {

    let useMouse = false;
    const boolUseMouse = document.getElementById("bool-use-mouse");
    boolUseMouse.onclick = checkMouseOption = (ev) => { useMouse = ev.target.checked; }; 

    const turn = (target, on) => {
        if (on)
            target.style.backgroundColor = "red";
        else
            target.style.backgroundColor = "yellow";
    }; //turn

    setMultiTouch(
        (element) => { return element.dataset.index; }, //elementSelector
        (element, on) => { turn(element, on); } //elementHandler
    );

    const container = document.querySelector("body section");
    let current = container.firstElementChild;
    while (current) {
        current.dataset.index = true;
        current.onmouseenter = (ev) => {
            ev.preventDefault();
            if (!useMouse) return;
            if (ev.buttons == 1)
                turn(ev.target, true);
        } //current.onmouseenter
        current.onmouseleave = (ev) => {
            ev.preventDefault();
            if (!useMouse) return;
            turn(ev.target, false);
        } //current.onmouseleave
        current.onmousedown = (ev) => {
            ev.preventDefault();
            if (!useMouse) return;
            if (ev.buttons == 1)
                turn(ev.target, true);
        } //current.onmouseenter
        current.onmouseup = (ev) => {
            ev.preventDefault();
            if (!useMouse) return;
            turn(ev.target, false);
        } //current.onmouseleave
        current = current.nextElementSibling;
    } //loop    

}; //document.body.onload
