@numbering {
    enable: false
}

{title}Sound Builder, Web Audio Synthesizer

[*Sergey A Kryukov*](https://www.SAKryukov.org){.author}

*In-browser synthesizer creates instruments to be used in musical applications, offers advanced additive and subtractive synthesis techniques*

<!-- <h2>Contents</h2> is not Markdown element, just to avoid adding it to TOC -->
<!-- change style in next line <ul> to <ul style="list-style-type: none"> -->
<!--
For CodeProject, makes sure there are no HTML comments in the area to past!

See: https://www.codeproject.com/script/Articles/ArticleVersion.aspx?waid=277187&aid=1278552&PageFlow=FixedWidth
Original publication:
https://www.codeproject.com/Articles/1278552/Anamorphic-Drawing-for-the-Cheaters


<!-- copy to CodeProject from here ------------------------------------------->

![Sound Builder](main.png){id=picture-main}

<blockquote id="epigraph" class="FQ"><div class="FQA">Epigraph:</div>

<p><i>If something is prohibited but you badly want it, it is&hellip; permitted</i></p>
<dd>Folk wisdom</dd></blockquote>

## Contents{no-toc}

@toc

## Motivation

The main driving force of thе present work is a severe need.

It is related to the repository of my work [Microtonal Music Study using specialized chromatic keyboards and Web Audio API](https://SAKryukov.github.io/microtonal-chromatic-lattice-keyboard).

Two article related to this topic are published as [Musical Study with Isomorphic Computer Keyboard](https://www.codeproject.com/Articles/1201737/Musical-Study-with-Isomorphic-Computer-Keyboard) and [Microtonal Music Study with Chromatic Lattice Keyboard](https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard). Even though first article has nothing to do with microtonal systems, it describes some basic theoretical explanation of the topic.

The second keyboard is _microchromatic_, very innovative, works in a Web browser with the use of [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). Recently, it used my heavily modified fork a third-party open-source library with very serious defects which I don't even want to discuss here. Anyway, it already played its role when the proof of concept goal was more important. These days, I continue research and development and cannot tolerate those defects and insufficient maintainability. But it's very hard or even impossible to find a decent open-source synthesizer satisfying all my requirements, so I've decided to develop my own. In other words, I started the work just because I [badly wanted](#epigraph) to get the result. Recently, I introduced my results to some prominent musicians, specialists in microtonal music, theory and pedagogics, and got very positive feedback. I think the tool is advanced, accurate and interesting enough to share it.

## Advanced features

The tool is a synthesizer synthesizer, or a generator of the instrument instances which can be [exported](#api-export) in a form of an single JSON file, [embedded](#api-embed) in some other JavaScript code and [used](#api-use) for implementation of an in-browser musical instrument based on Web Audio API, or some other tool for generation of music on a Web page. The tool is oriented to both common-practice and [microtonal](https://en.wikipedia.org/wiki/Microtonal_music) or [xenharmonic](https://en.xen.wiki) musical applications.

No part of the code uses any server-site operation, so any part of the code can be played locally on a wide range of devices, even without connection to Internet.

Some features of the tool are somewhat innovating. Overall, it helps to generate near-realistic instrument sound, defining advanced effects in a graphical manner using convenient UI. The user is not required to be able to work with audio nodes, to draw any graphics or to understand Web Audio API. Instead, the procedure of the design of an instrument is based on filling data in several tables, possibly trial-and-error approach with listening to intermediate results of the synthesis.

The procedure of instrument authoring is started from a single oscillator defined be a Fourier spectrum. Such spectrum can be imported from a spectral analyser of an available code sample, but usually additional edition is required. Alternatively, traditional signal waveforms, such as sawtooth or triangle, are also available, but more realistic sounds require Fourier approach.

On top of this the user can define unlimited number of modulators. A modulator can be used for frequency or amplitude modulation, and each of them can be either absolute-frequency or relative-frequency modulator. For absolute modulations, the user can define a fixed frequency for each one, but for relative-frequency modulations the frequency of the modulation signal depends on the fundamental frequency of each tone.

On top of this, the result of synthesis can be shaped using an envelope. Unlike conventional synthesis systems, in addition to a usual volume enveloped, there are three additional kinds of envelope: one for temporary detune, and two for modulations, separately for frequency and amplitude modulation.

On top of this, there is a set of filters with user-defined parameters. Any subset of filters can be included in use or excluded.

Finally, on top of this, there is a gain compensation system.

During the work, the author of an instrument uses a number of interactive tools used to listen to intermediate results. There is a test Jankó -style keyboard, corresponding to standard 88-key piano without one highest tone. The keyboard can be played with a mouse or by all 10 fingers using a touch screen. For both methods of playing, glissando is also possible, which is somewhat not very trivial technical aspect. Another important feature is this: during trial playing, any of the classes of the effects can be temporarily turned on, which is important for comparisons. Also, trial playing can be done with the control of volume, (additional) sustain and transposition. These controls are not parts of a resulting instruments and are designed specifically for the trial playing.

## A Word of Warning and a Disclaimer

Synthesis is such a thing... If you use this tool, please make sure you proceed carefully to protect your musical hearing from considerable shock. In some cases, accidental mistakes in parameters can produce awful almost traumatizing sound. I can see no chance to filter out bad things automatically, besides, it would be unfair.

I cannot assume any responsibility for production of bad or unpleasant sounds; this is a sole responsibility of a user. I only can assure that production of reasonably nice sounds is quite possible. Anyway, I provide a library of some instrument samples.

## Audio Graph

First of all, main design feature is this: all key of the on-screen keyboard should be able to generate sound at the same time. One may ask, why all of them, if we play with only 10 fingers? Simple: this is because of the sustain of an instrument. For example, if we press a sustain pedal of a piano and keep it down, we can, in principle, quickly hit all 88 strings, so at some moment of time all of them can generate sound, no matter how insane it may sound.

To achieve that, we have to dedicate considerable number of nodes to each and every instrument key. These parts of the graph are implemented by an object of a type `Tone`. However, we also minimize the number of those per-key nodes. It can be done by sharing some of our audio effects in another object of the type `Instrument`.

First, let's see what we can share. The set of filters can be shared. Some part of modulations can be shared, but some should be per key. I developed four kinds of modulation. We can apply unlimited number of frequency modulators (FM) and amplitude modulators (AM). Each of those modulators can be either absolute-frequency or relative frequency. All absolute-frequency modulators can be placed in the only `Instrument` and `Tone` instances can share them. But relative-frequency modulators modulate at some frequency different for each of the tones. In the tool, the actual frequency is the fundamental frequency of each tone, simply multiplied by some factor, with fixed modulation depths, individual for each modulators.

Therefore, both `Instrument` and `Tone` are based on the same type named `ModulatorSet`. For the implementation of a set of modulators, it does not matter which role role it plays, absolute-frequency of relative-frequency, implementation is the same.

Another per-tone part of the graph is a set of gain nodes used as targets for _envelopes_. An envelope is a mechanism used to program the dynamic behavior of a tone in its attack and damping. Customary synthesis technology usually implements only the envelope controlling volume, with fixed number of stages. The usual envelope is called [ADSR](https://en.wikipedia.org/wiki/Envelope_(music)) (Attack, Decay, Sustain and Release), but I don't even want to discuss it here, because it cannot satisfy me. Sound Builder has unified system of authoring envelopes of several types which makes possible creation of an envelope with unlimited number of stages, each stage characterized with its time, gain, and a choice of one of three functions. There are four characteristics of a node which can be envelope-programmed: volume, detune, AM and FM.

Now, we are ready to present a graph, starting with a tone part of it. First, let's introduce some graphical conventions.

![Oscillator node](oscillator.png) Oscillator node

![Gain node](gain.png) Gain node

![Envelope](envelope.png) Envelope, gain node with gain controlled by envelope functions

![Modulator set](modulatorSet.png) Modulator set

![Node chain](nodeChain.png) Chain of nodes

![Output mode](output.png) Output node

The graph is shown schematically in two parts, left on right. On left, there is a singleton instance of `Instrument` connected with a set of `Tone` instances show as only one on left. Let's remember that there is an entire set of `Tone` instances, with its own fundamental frequency each. Every `Tone` instance is connected to the instance of the instrument in three ways. An `Instrument` instance supplies two signals from the sets of FM and AM modulators, which are common to all tones, and receives fully-shaped sound signal from each tone, modulated and controlled by the functions of the envelopes.

![Graph](graph.png){id=picture-graph}

There are four kinds of oscillators. First one provides a signal of a fundamental frequency for each tone. Two sets of oscillators in each tone graph supply FM and AM signals of frequencies depending on the fundamental frequency, and two more sets of oscillators supply FM and AM signals of fixed frequencies to all tone graphs.

At the very beginning of the operation, as soon as the entire graph is populated and connected, all oscillators starts and provide their signals permanently, even when no sounds are emitted. The sound signals from the tone graphs are blocked by their gain envelopes. The oscillators stop only when the graph needs to be re-populated according to new instrument data.

Let's first consider the main kind of the oscillator, the one supplying the base of the sound. Naturally, in absolutely all cases, it provides entire spectrum of frequencies based on its fundamental frequency.

## Main Oscillator

This node is created by the Web Audio [constructor](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/OscillatorNode) `OscillatorNode`.

The user selects the spectrum of the node by assigning a value to the property`type`, this is either a string value, "sawtooth", "triangle", or custom. In the case of "custom", this string should not be assigned. Instead, the method [setPeriodicWave](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/setPeriodicWave) is called. In the Sound Builder UI, [it corresponds to the choice "Fourier"](#picture-main).

This call is a working horse of synthesis. The data for the wave is supplied by the instance of `Instrument` and is shared by all tones, because the component of the Fourier spectrum are relative to the fundamental frequency.

In the Sound Builder UI, the spectrum is represented not by an array or complex number, but by an equivalent array of amplitudes and phases, which the user can "draw" by a mouse on a table of sliders. Each slider is an input element with `type="range"` with modified behavior which allowed drawing-like mouse action.

### Wave FFT

Alternative way of entering data is using a separate application "WaveFFT.exe" (WAV file to Fast Fourier Transform). It can load a WAV file, observe its waveform, select a fragment of the the sample sequence (FFT support number of samples equal to natural power of 2, this is supported by the UI), perform FFT, observe resulting spectrum and save this data in the format of Sound Builder instrument data file.

Typically, the data file created with WaveFFT serves as a starting point. Another way to start is to use some sample files downloadable with this article.

This application could be a matter of a separate article. In brief, this is a .NET Core WPF application, so it can be executed on different platforms without rebuild. At present time, it includes Windows, Linux and Mac OS with appropriate [framework installed](https://en.wikipedia.org/wiki/.NET_Core).

![Wave FFT](WaveFFT.png)

## Oscillator Control

With Web Audio API, a node can be connected to another node or an object which is a property of a node, if this object supports the interface [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam). This is a way to modulate the value corresponding to some audio parameter.{id=in-text-how-to-modulate}

[OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/OscillatorNode) has two [a-rate](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam#a-rate) properties, supporting the interface [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam): [frequency](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency) and [detune](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/detune).

Frequency [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam) input can be used for FM, which, optionally, can be enveloped. The same can be done to detune, but modulation of detune would make little sense. Instead, it can modified through an envelope.

## Modulation

Two kinds of modulation are implemented in different ways: FM signal connects to the frequency input of some oscillator, while AF needs to be done on output, to modulate the gain of already generated and frequency-modulated signal.

Therefore, FM signal is connected to an oscillator node frequency [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam), as explained [above](#in-text-how-to-modulate), and AM signal is connected to some gain node.

In both cases, FM and AM signals are connected to some gain node, shown on the [graph](#picture-graph) as "FM Envelope" and "AM Envelope", correspondingly. 

Each of those gain mode receive FM and AM signals from two sources, absolute-frequency modulation signals from the `Instrument` instance and relative-frequency modulation signals from within the same `Tone` instance.

On top of that, let's remember that "FM Envelope" and "AM Envelope" gain nodes are also envelopes. It means that the gain value of these node is kept zero until a performer press down a key. When it happens, an envelope function is applied to the gain, to open signals to output. Let's see how it works.

## Envelopes

The operation of envelopes relies on the functionality of [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam). Each instance of `AudioParam` can be programmed to change the value automatically at future time. When a performer press a key on some instrument keyboard, the gain and some other audio parameters are programmed to implement some dynamics.

Envelope defines a function of time, controlling the value of an `AudioParam` instance. This is a piecewise-smooth function, composed of the function of 3 types: exponential, linear and, with some degree of conventionality, less usable [Heaviside function](https://en.wikipedia.org/wiki/Heaviside_step_function). For each piece, the user adds a line to an envelope table and defines the duration of each step and a target value.

This is the core of the implementation of envelope from "sound/envelope.js":
```{lang=JavaScript}{id=code-envelope}
for (let element of this.#implementation.data) {
    switch (element.type) {
        case this.#implementation.typeHeaviside:
            audioParameter.setValueAtTime(element.gain, currentTime + element.time);
            break;
        case this.#implementation.typeExponential:
            if (element.gain == 0 || element.isLast)
                audioParameter.setTargetAtTime(element.gain, currentTime,  element.time);
            else
                audioParameter.exponentialRampToValueAtTime(element.gain, currentTime + element.time);
            break;
        case this.#implementation.typeLinear:
            audioParameter.linearRampToValueAtTime(element.gain, currentTime + element.time);
            break;
    } //switch
    currentTime += element.time;
}
```

It's important to note, that exponential function is implemented in two different ways: via [setTargetAtTime](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime) or [exponentialRampToValueAtTime](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/linearRampToValueAtTime). First case is used when a target value is zero, the the stage is very last. It is done so, because, by obvious mathematical reasons, target value cannot be zero for the exponent. Then the function represents "infinite" approach of a `AudioParam` value to the target value. Naturally, for the last stage, such behavior represents natural damping or of an instrument sound, or growing of the parameter to the values corresponding to the stabilized sound, zero or not. In both cases, "infinite" exponential behavior is the most suitable.

With Sound Builder, the envelopes can optionally be applied to three characteristics of a sound: volume, detune, FM and AM.

Let's discuss the application of these techniques.

### Volume Envelope

This is the most traditional kind of envelope, which is used, for example, in ADSR. The difference is not only unlimited number of stages. Additional volume envelope characteristic is its dumping sustain. There is no such thing as instant stopping of a sound. It we try to produce such instantaneous stop, electronics not instantaneously, but very quickly, which, naturally, produces ultra-wide spectrum, which is perceived as very unpleasant crackling noise. The same thing can happen due too fast attack. I don't think any timing faster then some 10 ms can be practically used, so the envelope stage times are limited by this maximum duration. Dumping sustain happens when we play, for example, a piano and release a key. But what happens when we keep a key down or use a sustain key?

In this case, the behavior is defined by the last stage of an envelope. We can define essentially two different types of instruments. First type is suitable for the instrument with natural damping, such as piano or bells. For these instruments, the target value of the gain of the last stage should be zero, but the stage itself can be prolonged, say, up to several seconds. If we make this time about 10 milliseconds or few times greater, we can achieve the effect closer to some melodic percussion. The second type can model the instrument of "infinite" sound, such as in wind or bow string instruments. The target gain of the last envelope stage should be maximum, or about maximum value. In this case, the sound is damped only when a performer releases a key.

### Detune Envelope

It is pretty typical that an instrument plays somewhat detuned tone during limited period of time, especially during attack. For example, it happens in loud finger style guitar playing. At the first phase of plucking of the string, it is considerably elongated and hence sounds sharper then the tone it is tuned to. Besides, at first moment, a string can be pressed against the fret stronger. This effect can be achieved by controlling some detune value of the oscillator. Naturally, unlike the case of the volume, the detune value of the last stage should be zero.

Detune envelope is the only envelope not represented on the [audio graph](#picture-graph) as an envelope-controlled gain mode. Its target is the [detune](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/detune) [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam) of each main oscillator of a tone. No gain node is required for this functionality. The master gain of the effect is simply a numerical factor; all target values all envelope stages are multiplied by this factor.

### Modulation Envelopes

Two remaining envelopes are those separately controlling AM and FM, but I don't make distinction between absolute-frequency FM/AM and relative-frequency FM/AM. Instead, one envelope controls all AM and one --- all FM. Let's consider a typical case of such envelope. A tuba or a saxophone, as well as many other wind instruments, show extremely strong vibration when a performer starts to blow a sound, but the vibration becomes barely perceivable as the sound stabilizes. This can be achieved with these two kinds of envelope.

## Filters

Subtractive part of the synthesis is represented by a set of biquadratic low-order filters.
Some filtering is required in most cases.

Filter parameters are filled in in a table with the help of sliders. Each of the provided filter types can be included in the instrument graph, or excluded. In most cases, only one low-pass filter is sufficient.

To learn filter tuning, a good starting point could be [BiquadFilterNode documentation](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode).

## Gain Compensation

Both kinds of design features of the instrument synthesis, additive synthesis based on Fourier spectrum, and subtractive synthesis based of filters, make the final volume of each tone hard to predict. Worst thing is: all tones produce very different subjective levels of volume, depending on the frequency. Overall volume of an instrument also can differ dramatic. Hence, some frequency-dependent gain compensation is badly needed. I've tried a good deal of research using different "clever" functions, but finally ended up with the simplest approach: quadratic spline defined by three points: some low frequency and compensation level for this frequency, some high frequency and compensation level for this frequency and some medium frequency point where the compensation is considered to be equal to 1. Naturally, two quadratic functions are stitched at this point. This simple function has the following benefit: one can compensate for part of the spectrum on right of this point, then, separately, on left part of the spectrum. When left or right part is done, compensation for another part won't spoil previous work.

This procedure requires a table of three parameters: low-frequency and high-frequency compensation and the position of the middle frequency, plus a value for overall compensation factor. Two values for low and high frequencies themselves are not presented in the table, because they rarely, if ever, need to be modified; they correspond to highest of lowers frequencies of a standard 88-key piano. However, they are prescribed in the data files (where the are written based on the code's definition set) and can be modified by some overly smart users. :-)

This is the implementation of this simple spline function:

```{lang=JavaScript}{id=code-envelope}
const compensation = (() =&gt; {
    const compensation = (f) =&gt; {
        const shift = f - this.#implementation.gainCompensation.middleFrequency;
        const g0 = this.#implementation.gainCompensation.lowFrequencyCompensationGain;
        const g1 = this.#implementation.gainCompensation.highFrequencyCompensationGain;
        const f0 = this.#implementation.gainCompensation.lowFrequency;
        const f1 = this.#implementation.gainCompensation.lowFrequency;
        const factor0 = (g0 - 1) / Math.pow(f0 - this.#implementation.gainCompensation.middleFrequency, 2);
        const factor1 = (g1 - 1) / Math.pow(f1 - this.#implementation.gainCompensation.middleFrequency, 2);
        if (shift &lt; 0)
            return 1 + factor0 * Math.pow(shift, 2);
        else                
            return 1 + factor1 * Math.pow(shift, 2);
    } //compensation
    return compensation;
})(); //setupGain
```

The stitching happens at the medium frequency point, at the point of zero derivative, but with a step in second derivative. This imperfect _smoothness_ may sound questionable, but, after some experiments, seems to produce smooth sound, pun unintended ;-).

## Live Play
The application can play at [here](https://SAKryukov.github.io/microtonal-chromatic-lattice-keyboard/SoundBuilder/index.html). Again, no server part and no network is used, so the application can be downloaded and used on a local system.

Most likely, to get started, one may need a set of sample data files, which can be downloaded from this article page.

## Using API and Generated Instruments In Applications

Naturally, Sound Builder doesn't do much if it is not used in other applications. See the instructions in https://SAKryukov.github.io/microtonal-chromatic-lattice-keyboard/SoundBuilder/API.html.

Basically, the user needs to produce a set of desired instruments and test them.

- Produce some set of instruments, test and save them, each instrument is a separate JSON - file;
- Use the element “Instrument List”, button “Load” to load created instruments, “Save” all of them in a single .js file;{id=api-export}
- Include the API, all sound/*.js files in the application;
- Also include .js file generated before;{id=api-embed}
- In the application, create in instance of `Instrument`;
- To apply instrument data, assign `instrumentInstance.data = instrumentList[someIndex]`;
- To play a single sound, call `instrument.play`;{id=api-use}
- Enjoy :-).

Now, let's see how the API looks in detail.

### API

The `Instrument` constructor expects 2 arguments: `constructor(frequencySet, tonalSystem)`.

First of all, one needs to define a set of fundamental frequencies for the generated sounds. This is either an array of frequencies in Hertz units, or an object `{first, last, startingFrequency}`, where `first` is always zero (reserved for advanced features), `last` is the last index of the frequency array, and `startingFrequency` is the lowest absolute frequency in Hertz units (27.5 for standard 88-key piano). Second parameter should specify a tonal system, which is the number of tones in octave. In this case, the tone set will be automatically populated with [Equal Division of the Octave (EDO)](https://en.wikipedia.org/wiki/Equal_temperament) frequencies.

For example:
    
`const piano = new Instrument({ first: 0, last: 87, 25.7 }, 12)` will create a standard 88-key piano tuning, and typical microtonal systems could use 19, 29, 31, 41, etc., for the second argument.

`const perfect = new Instrument([100, 133.333, 150])` will create an instrument with only 3 tones, 100 Hz and two more tones, perfect fourth and perfect fifth in [just intonation](https://en.wikipedia.org/wiki/Just_intonation).

Second parameter, `tonalSystem`, is used even when an array of fixed frequency values --- for the implementation of the property `transposition`. If this argument is not specified, it is assumed to the length of this array.

Method `play(on, index)` starts (if `on==true`) or stops (if `on==false`) the damps of a tone of specified `index`. Starting of damping is never instantaneous, it is defined by the gain envelope and damping sustain parameter. The timing is limited by some minimal values.

Properties: `volume` (0 to 1), `sustain` (time in seconds) and `transposition` (in the units of logarithmic equal divisions of octave, depending on the `tonalSystem` argument of the `Instrument` constructor). The property `frequencies` is read-only, returns the array representing current frequency set.

To include the API, use this code sample:</h2>

```
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="utf-8"/&gt;
    &lt;script src="../sound/definition-set.js"&gt;&lt;/script&gt;
    &lt;script src="../sound/chain-node.js"&gt;&lt;/script&gt;
    &lt;script src="../sound/envelope.js"&gt;&lt;/script&gt;
    &lt;script src="../sound/modulator.js"&gt;&lt;/script&gt;
    &lt;script src="../sound/modulator-set.js"&gt;&lt;/script&gt;
    &lt;script src="../sound/tone.js"&gt;&lt;/script&gt;
    &lt;script src="../sound/instrument.js"&gt;&lt;/script&gt;
    &lt;!-- ... ---&gt;
&lt;/head&gt;

&lt;body&gt;

    &lt;!-- ... ---&gt;

&lt;/body&gt;
&lt;/html&gt;
```


## Compatibility

The tool is tested on a good number of browsers and some different systems.

I found that, at the time of warning there is only one type of browsers with sufficient support of Web Audio API: those based on [V8](https://en.wikipedia.org/wiki/V8_engine) + [Blink](https://en.wikipedia.org/wiki/Blink_(browser_engine)) combination of engines. Good news is: the set if such browsers is pretty wide.

Unfortunately, Mozilla browsers, formally implementing full Web Audio API, produce pretty bad crackling noise which cannot be eliminated, in the situation when the operation of V8 + Blink combination is just fine. For the time being, the application prevents the use of these and some other browsers.

Here is the text of the recommendations which a page shows when a browser cannot cope with the task:

<blockquote id="epigraph" class="FQ">
<p>This application requires JavaScript engine better conforming to the standard.</p><p>Browsers based on V8 engine are recommended, such as Chromium, Chrome, Opera, Vivaldi, Microsoft Edge v. 80.0.361.111 or later, and more…</p>
</blockquote>

By the way, my congratulations to Microsoft people for their virtue of giving up majorly defunct [EdgeHTML](https://en.wikipedia.org/wiki/EdgeHTML) used for [Edge](https://en.wikipedia.org/wiki/Microsoft_Edge) until 2020. :-)

## Credits

[Wave FFT](#heading-wave-fft) uses C# [implementation](http://lomont.org/software/misc/fft/LomontFFT.html) of Fast Fourier Transform by [Chris Lomont](http://lomont.org).

## Conclusions

Enjoy! :-)
<!-- copy to CodeProject to here --------------------------------------------->
