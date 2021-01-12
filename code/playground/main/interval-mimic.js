// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

"use strict";

class Interval {

   constructor (numerator, denominator) {
      if (!denominator) denominator = 1;
      this.stringValue = `${numerator}/${denominator}`;
      this.real = numerator/denominator;
   } //constructor

   toString() { return this.stringValue; }
   toReal() { return this.real; }

} //class Interval

const interval = (aNumerator, aDenominator) => new Interval(aNumerator, aDenominator);
