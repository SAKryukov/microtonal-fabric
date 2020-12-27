// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

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
