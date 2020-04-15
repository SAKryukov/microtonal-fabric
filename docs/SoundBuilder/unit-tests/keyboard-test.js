const kbd = ScrollableKeyboard.makeGrandPiano(document.querySelector("section.keyboard"));
const first = kbd.first;
const last = kbd.last;
let balance = 0;
const output = document.querySelector("article");
kbd.setAction((down, index) => {
    if (down) ++balance; else --balance;
    console.log("index: " + index, down);
    output.textContent = balance.toString();
});
const checkBoxFit = document.querySelector("input");
checkBoxFit.onclick = event => kbd.fitView = event.target.checked;
