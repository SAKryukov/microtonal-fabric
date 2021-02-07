// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

window.onload = () => {

    const kbd = new CircularKeyboard(document.querySelector("header"));
    const size = 0.113;
    kbd.addTone(1, size);
    kbd.addTone(12/20);
    kbd.addTone(15/14);
    kbd.addTone(10/9);
    kbd.addTone(9/8, size);
    kbd.addTone(8/7);
    kbd.addTone(7/6);
    kbd.addTone(6/5);
    kbd.addTone(5/4, size);
    kbd.addTone(9/7);
    kbd.addTone(21/16);
    kbd.addTone(4/3, size);
    kbd.addTone(7/5);
    kbd.addTone(10/7);
    kbd.addTone(3/2, size);
    kbd.addTone(32/21);
    kbd.addTone(14/9);
    kbd.addTone(8/5);
    kbd.addTone(5/3, size);
    kbd.addTone(12/7);
    kbd.addTone(7/4);
    kbd.addTone(16/9);
    kbd.addTone(9/5);
    kbd.addTone(28/15);
    kbd.addTone(15/8, size);
    kbd.addTone(40/21);
    kbd.addTone(15/8);
    //repeated:
    kbd.addTone(15/8, size);

}; //window.onload
