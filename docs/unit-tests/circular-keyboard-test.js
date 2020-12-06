// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

window.onload = () => {

    const kbd = new CircularKeyboard(document.querySelector("header"));
    //kbd.addTone(2);
    // kbd.addTone(4/3);
    // kbd.addTone(3/2);
    // kbd.addTone(9/8);
    // kbd.addTone(8/9);
    // kbd.addTone(5/3);
    kbd.addTone(1, 0.1);
    kbd.addTone(9/8);
    kbd.addTone(5/4);
    kbd.addTone(4/3);
    kbd.addTone(3/2);
    kbd.addTone(5/3);
    kbd.addTone(15/8);
};


// const first = kbd.first;
// const last = kbd.last;
// let balance = 0;
// const output = document.querySelector("article");
// kbd.setAction((down, index) => {
//     if (down) ++balance; else --balance;
//     console.log("index: " + index, down);
//     output.textContent = balance.toString();
// });
// const checkBoxFit = document.querySelector("input");
// checkBoxFit.onclick = event => kbd.fitView = event.target.checked;
