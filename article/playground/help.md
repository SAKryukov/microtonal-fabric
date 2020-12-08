@numbering {
    enable: false
}

{title}Microtonal Playground

@toc

## General

Microtone Playground is the in-browser application which provides a way of playing with different thinkable tonal systems. The user uses simple grid keyboard with fixed number and arrangenement of keys. The main method of playing is based on 10-finger touchscreen. In this case all kinds of chords combined with glissando can be played. Without a touchscreen, it can be played with a mouse/trackball.

## Tones

The user creates a tonal system by defining frequencies for all or some keys. Frequences are put in an array representing rows, each row being an array of row keys. Any sizes of arrays are allowed --- redundant data will be ignored, and missing data will be filled with disabled keys.

Array elements representing frequencies for the keys are defined as a polymorphic set, so the elements can be of several differnet types: fixed frequency, interval from a base note, fixed frequency or interval with a custom label, or repeat object.

### Fixed frequency

Fixed frequency is a floating-point or integer number, representing frequency in Hertz.

### Interval

The intervals are defined by the calls to the functions `interval(numerator, denonimator)`, where `numerator` and `denonimator` are positive integer numbers representing a rational number `numerator/denonimator`. Interval is the element of a free Abelian group with the multiplicative group operation.

### Frequency Element with a Custom label

Such elements take on of the forms: `{ label: "label", interval: interval(numerator, denonimator)}` or `{ label: "label", frequency: number}`. These forms allow to provide a custom label with an interval or a fixed frequency object. If a label is not defined, is an empty string or this property with the name `label` is not of a `String` type, it renders the corresponding key disabled. Likewise, a key is disabled when the frequency is zero or not defined, or an interval is not defined.

### Repeat

The special object `repeat` is used to mark the row array for repetition of the previous elements. It works only if the `repeat` object is the last element of an array, otherwise it renders corresponding key disabled. The repetition works in the following way: all the elements before the element `repeat` are copied to fill in the complete row in a repeating patterns. The labels are simply copied, but the repeated frequencies are transposed to the next octave per each repetition.

### Invalid Array Elements

Array elements of the types not listed above render corresponding part of the keys disabled. Other cases when the key is disabled are described above.