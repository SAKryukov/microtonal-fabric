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
