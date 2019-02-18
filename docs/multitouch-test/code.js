document.body.onload = function () {

    let useMouse = false;
    const boolUseMouse = document.getElementById("bool-use-mouse");
    boolUseMouse.onclick = checkMouseOption = (ev) => { ev.preventDefault(); useMouse = ev.target.checked; }; 

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
        current = current.nextElementSibling;
    } //loop    

}; //document.body.onload
