## Microtonal Chromatic Lattice Keyboard — see [Life Demo](https://sakryukov.github.io/microtonal-chromatic-lattice-keyboard)

This project ***under development*** offers a musical keyboard of a special structure in the form of [lattice](https://en.wikipedia.org/wiki/Lattice_%28group%29) resembling computer keyboard. This *rank-two* structure offers certain benefits over traditional *sequentially-structured* keyboards and is especially suitable for [microtonal music](https://en.wikipedia.org/wiki/Microtonal_music). In its use, the keyboard is highly suggestive of the fundamental principles of music harmony. The tone mapping is based on the [Wicki-Hayden layout](https://en.wikipedia.org/wiki/Wicki-Hayden_note_layout), but the geometry is different: it is simpler; and its symmetry matches the symmetry of the tone system more closely.

The software is a pure in-browser application using [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). It continues the work at the similar keyboard (not microtonal) for Windows and .NET: [Musical Study with Isomorphic Computer Keyboard](https://www.codeproject.com/Articles/1201737/Musical-Study-with-Isomorphic-Computer-Keyboard).

### Supported [Tone Systems](https://en.wikipedia.org/wiki/Musical_tuning):
- [Just Intonation](https://en.wikipedia.org/wiki/Just_intonation) (only presented on the [chromatic-circle](https://en.wikipedia.org/wiki/Chromatic_circle) keyboard)
- [Common-practice](https://en.wikipedia.org/wiki/Common_practice_period) [12-TET](https://en.wikipedia.org/wiki/Equal_temperament)
- [19-TET](https://en.wikipedia.org/wiki/19_equal_temperament)
- [31-TET](https://en.wikipedia.org/wiki/31_equal_temperament)

### Features:
- For three chromatic tone systems, the same keyboard is used; the choice of tone system can be changed dynamically
- Side-by-side comparison of the sound of tones and chords in different tone systems
- Choice of 5 instruments
- Chord generation
- Optional chord visualization

### Life Demo and Source Code

All source code and development is in the directory "docs", which is the source of the product [Web site](https://sakryukov.github.io/microtonal-chromatic-lattice-keyboard).

### Known Compatibility Issues

- Mozilla SeaMonkey: physical keyboard operation of the [keyboard application](https://sakryukov.github.io/microtonal-chromatic-lattice-keyboard/keyboard/keyboard.html) does not work and is disabled (in particular, central green area of the keyboard is not shown). It all works on Firefox though.
- Microsoft: did not even try. IE of any version cannot be supported at all, but latest Microsoft Edge is said to support all required APIs.

Fully supported: Chrome, Opera, Firefox.
 
### Acknowledgments

The application uses 5 JavaScript audio font files developed by [Srgy Surkv (Surikov)](https://github.com/surikov) and offered in his [webaudiofontdata](https://github.com/surikov/webaudiofontdata) project. The core functionality of the player is also based on the project [webaudiofont](https://github.com/surikov/webaudiofont) of the same author, but is heavily modified and upgraded with different feature, as in its current form the code is not suitable for the application. The quality of the audio fonts is also not fully satisfying, so the fonts need replacement or improvements. 
