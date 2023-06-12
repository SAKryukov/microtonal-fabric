@numbering {
    enable: false
}

{title}Microtonal Playground

[*Sergey A Kryukov*](https://www.SAKryukov.org)

Microtonal Playground is a Microtonal Fabric application for experimenting with various musical tonal systems without programming

Microtonal Playground is the in-browser application which provides a way of playing with different thinkable tonal systems. The user uses simple grid keyboard with fixed number and arrangenement of keys. The main method of playing is based on 10-finger touchscreen. In this case all kinds of chords combined with glissando can be played. Without a touchscreen, it can be played with a mouse/touchpad.

<!-- <h2>Contents</h2> is not Markdown element, just to avoid adding it to TOC -->
<!-- change style in next line <ul> to <ul style="list-style-type: none"> -->
<!--
For CodeProject, makes sure there are no HTML comments in the area to past!


266D ♭music flat sign
266E ♮ music natural sign
266F ♯ music sharp sign
¹²
C &mdash; D♭² &mdash; Db &mdash; C♯ &mdash; C♯² &mdash; D 

--> 

---

Download Microtonal Fabric source code — 284 KB

<!-- copy to CodeProject from here ------------------------------------------->

<p id="image-title">

![keyboards](main.png)

</p>

## Contents{no-toc}

@toc

## Introduction

This is the fourth article of the series dedicated to musical study with on-screen keyboards, including microtonal ones:

1. *[Musical Study with Isomorphic Computer Keyboard](https://www.codeproject.com/Articles/1201737/Musical-Study-with-Isomorphic-Computer-Keyboard)*
2. *[Microtonal Music Study with Chromatic Lattice Keyboard](https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard)*
3. *[Sound Builder, Web Audio Synthesizer](https://www.codeproject.com/Articles/5268512/Sound-Builder)*
4. *[Multitouch Support for Ten-Finger Playing](https://www.codeproject.com/Articles/5362252/Multitouch-Support)*
5. *Present article*


The last four articles are devoted to the project named [Microtonal Fabric](https://github.com/SAKryukov/microtonal-fabric), a  microtonal music platform based on [WebAudio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). It is a framework for building universal or customized microtonal musical keyboard instruments, microtonal experiments and computing, music study, and teaching music lessons with possible remote options. The platform provides several applications executed in a Web browser using shared JavaScript components.

See also [my page](https://en.xen.wiki/w/Sergey_A_Kryukov) at the microtonal community Web site [Xenharmonic Wiki](https://en.xen.wiki). In addition to the Microtonal Fabric links, there are some useful links on different microtonal topics and personalities.

Most of the Microtonal Fabric applications allow the user to play music in a browser. If a multitouch screen is available, the user can play with ten fingers. The required features of the multitouch interface are not as trivial as they may seem at first glance. The present article explains the problem and the solution. It shows how the multitouch behavior is abstracted from the other part of the code, reused, and utilized by different types of on-screen keyboards.

## Live Play

Four tonal systems and keyboards are provided and come with the application. To play them, one won't need to download Microtonal Fabric and define anything. The user can play them right a Web browser, using *Live Play* URLs listed below:

+ [Aura's Diatonic Scales](https://sakryukov.github.io/microtonal-fabric/code/playground) (default) 
+ [Natural diatonic scales in 12-EDO](https://sakryukov.github.io/microtonal-fabric/code/playground/index.html?custom/12-EDO.user.data)
+ [Shruti scales](https://sakryukov.github.io/microtonal-fabric/code/playground/custom/shruti.html)
+ [Chinese scales](https://sakryukov.github.io/microtonal-fabric/code/playground/custom/chinese.html)
+ [Demo](https://sakryukov.github.io/microtonal-fabric/code/playground/custom/demo.html), this keyboard is used to demonstrate the features of the interpreter of the user data.

Let's take a close look at these predefined tonal systems and keyboards.

## Predefined Systems

### Aura's Diatonic Scales

The default keyboard represents very intereting Aura's Diatonic Scales invented by [Dawson Berry](https://en.xen.wiki/w/Dawson_Berry), a composer and music theorist, a member of our community of microtonalists [Xenharmonic Wiki](https://en.xen.wiki). He is also known as *Aura*. Aura provides the background for his system of diatonic scales in his [article](https://en.xen.wiki/w/User:Aura/Aura%27s_Diatonic_Scales).

This is one of the "natural" tonal systems based on purely rational intervals, that is, rational numbers, representing frequency ratio values. As I tried to [explain in my first article on the topic](https://www.codeproject.com/Articles/1201737/Musical-Study-with-Isomorphic-Computer-Keyboard#heading-rational-and-irrational-numbers), the rational interval lies in the very nature of music, pitch perception, and the natural sense of harmony. No wonder, the systems and theory based on rational intervals lie in the very heart of microtonal music theory.

Each mode row covers four octaves plus one [degree](https://en.wikipedia.org/wiki/Degree_(music)) of a corresponding scale higher then four octaves, depending on a particular mode.

### Natural diatonic scales in 12-EDO

C D E F G A B ???

This keyboard implements the [common-practice](https://en.wikipedia.org/wiki/Common_practice_period) tonal system. Unlike traditional piano keyboard, the rows of this keyboard
represent [modern Western modes](https://en.wikipedia.org/wiki/Mode_(music)#Modern_modes): Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, and Locrian.

This keyboard is not so suitable for using *[chromatic](Chromaticism)* techniques. However, for each more, the required flatterned or sharpened notes can be borrowed from the row of another mode. [Harmonic modulation]() typical for traditional Western music can be easily achieved with the combination of using different mode rows with the *Transposition* control provided by the application, available in most Microtonal Fabric applications. Note that proper transposition is defined by setting the `tones.transpositionUnits` value of 12.

Each mode row covers four octaves plus one 12-EDO semitone.

### Shruti scales

### Chinese scales

### Demo

### Credits

I'm much grateful to [Xenharmonic Wiki](https://en.xen.wiki) members [Dawson Berry](https://en.xen.wiki/w/Dawson_Berry) a.k.a. *Aura*, and [Flora Canou](https://en.xen.wiki/w/User:FloraC) for trying out Microtonal Fabric, the present application, and useful discussion. Dawson Berry validated my implementation of his Aura's Diatonic Scales, and Flora Canou validated my implementation of the Chinese system, she also checked up my [pinyin](https://en.wikipedia.org/wiki/Pinyin) spelling of the words used to label the keyboard keys. Both colleagues found my mistakes and corrected me.

## Conclusions


<!-- copy to CodeProject to here --------------------------------------------->
