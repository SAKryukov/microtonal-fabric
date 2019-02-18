document.body.onload = function () {
    setMultiTouch((element) => { return element.dataset.index; });
    const container = document.querySelector("body section");
    let current = container.firstElementChild;
    while (current) {
        current.dataset.index = true;
        current = current.nextElementSibling;
    } //loop
    const boolUseMouse = document.getElementById("bool-use-mouse");
    const checkMouseOption = function (ev) { ev.preventDefault(); return boolUseMouse.checked; };
};
