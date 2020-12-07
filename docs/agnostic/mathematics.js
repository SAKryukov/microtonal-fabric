// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Mathematics: factorization, Abelian group of rational numbers and harmonic (based on rational numbers) musical intervals
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

class PrimeSet extends Set {
    #max = 3;
    constructor(maxValue) {
        super();
        if (!maxValue || maxValue < this.#max) maxValue = this.#max;
        this.add(2);
        this.max = maxValue;
    } //constructor
    get max() { return this.#max; }
    set max(value) {
        for (let candidate = this.#max; candidate <= value; ++candidate) {
            let found = false;
            this.forEach(element => {
                if (candidate % element == 0) {
                    found = true;
                    return;
                } //if
            }); //primes.forEach
            if (!found) {
                this.add(candidate);
                this.#max = candidate;
            } //if
        } //loop
    } //set max
} //class PrimeSet

class FactorizedNumber {
    #implementation = { map: new Map(), max: 0 };
    static primeSet = undefined;
    constructor (value, primeSet) {
        const addValue = (value, power) => {
            if (!power) power = 1;
            const repeats = this.#implementation.map.get(value);
            const existingValue = repeats ? repeats : 0;
            this.#implementation.map.set(value, existingValue + power);
        } //addValue
        this.#implementation.multiply = another => {
            if (another.constructor == this.constructor || another.constructor == FactorizedNumber)
                for (let [key, value] of another.#implementation.map)
                    addValue(key, value);
            else if (another.constructor == Number)
                this.#implementation.multiply(new this.constructor(another));
        }; //this.#implementation.multiply
        if (value && value.constructor == this.constructor) { //clone
            this.#implementation.map = new Map(value.#implementation.map);
            this.#implementation.max = value.#implementation.max;
            return;
        } // if clone
        if (!primeSet)
            primeSet = FactorizedNumber.primeSet;
        if (!primeSet)
            primeSet = new PrimeSet(value + 1);
        else
            if (primeSet.max < value)
                primeSet.max = value + 1;
        FactorizedNumber.primeSet = primeSet;
        const variablePrimeSet = new Set(FactorizedNumber.primeSet);
        const factorizationStep = (value, primes) => {
            primes.forEach(element => {
                if (value % element == 0) {
                    value /= element;
                    addValue(element);
                } else
                    primes.delete(element);
            }); //primeSet.forEach
            return value;
        }; //factorizationStep
        while (value > 1)
            value = factorizationStep(value, variablePrimeSet);
    } //constructor
    multiply(another) { this.#implementation.multiply(another); }
    reduce(denominator) {
        const setPower = (map, key, power) => {
            if (power < 1)
                map.delete(key);
            else
                map.set(key, power);
        }; //setPower
        for (let [key, value] of denominator.#implementation.map) {
            const power = this.#implementation.map.get(key);
            if (!power) continue;
            let min = power;
            if (value < min) min = value;
            setPower(this.#implementation.map, key, power - min);
            setPower(denominator.#implementation.map, key, value - min);
        } //loop
    } //reduce
    toString() {
        const result = [];
        for (let [key, value] of this.#implementation.map)
            for(let index = 0; index < value; ++index)
                result.push(key.toString());
        return result.join("*");
    } //toString
    toNumber() {
        let result = 1;
        for (let [key, value] of this.#implementation.map)
            for(let index = 0; index < value; ++index)
                result *= key;
        return result;
    } //toNumber
} //class FactorizedNumber

class RationalNumber {
    #implementation = {};
    constructor (numerator, denominator) {
        if (numerator && numerator.constructor == this.constructor && !denominator) { // clone:
            this.#implementation.numerator = new FactorizedNumber(numerator.#implementation.numerator); //clone
            this.#implementation.denominator = new FactorizedNumber(numerator.#implementation.denominator); //clone
        } else { //factorize:
            if (!denominator) denominator = 1;
            this.#implementation.numerator = new FactorizedNumber(numerator);
            this.#implementation.denominator = new FactorizedNumber(denominator, FactorizedNumber.primeSet);
            this.#implementation.numerator.reduce(this.#implementation.denominator);    
        } //if
    } //constructor
    multiply(another) {
        if (another.constructor == Number)
            another = new this.constructor(another, 1);
        const result = new this.constructor(this);
        result.#implementation.numerator.multiply(another.#implementation.numerator);
        result.#implementation.denominator.multiply(another.#implementation.denominator);
        result.#implementation.numerator.reduce(result.#implementation.denominator);
        return result;
    } //multiply
    divide(another) {
        if (another.constructor == Number)
            another = new this.constructor(another, 1);
        const result = new this.constructor(this);
        result.#implementation.numerator.multiply(another.#implementation.denominator);
        result.#implementation.denominator.multiply(another.#implementation.numerator);
        result.#implementation.numerator.reduce(result.#implementation.denominator);
        return result;
    } //divide
    get numerator() { return this.#implementation.numerator; }
    get denominator() { return this.#implementation.denominator; }
    toReal() { return this.#implementation.numerator.toNumber() / this.#implementation.denominator.toNumber(); }
    toString() { return `${this.#implementation.numerator.toNumber()}/${this.#implementation.denominator.toNumber()}`; }
} //class RationalNumber

class Interval extends RationalNumber {
    normalize() { // to fit in octave
        const real = this.toReal();
        if (1 <= real && real < 2) return this;
        let result = new Interval(this);
        while (true) {
            const real = result.toReal();
            if (1 <= real && real < 2) return result;
            if (real < 1)
                result = result.multiply(2);
            else if (real >= 2)
                result = result.divide(2);
        };
    } //normalize
} //class Interval

const interval = (numerator, denominator) => new Interval(numerator, denominator);
