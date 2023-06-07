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

- [Musical Study with Isomorphic Computer Keyboard](https://www.codeproject.com/Articles/1201737/Musical-Study-with-Isomorphic-Computer-Keyboard)
- [Microtonal Music Study with Chromatic Lattice Keyboard](https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard)
- [Sound Builder, Web Audio Synthesizer](https://www.codeproject.com/Articles/5268512/Sound-Builder)
- [Multitouch Support for Ten-Finger Playing](https://www.codeproject.com/Articles/5362252/Multitouch-Support)
- Present article

The last four articles are devoted to the project named [Microtonal Fabric](https://github.com/SAKryukov/microtonal-fabric), a  microtonal music platform based on [WebAudio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). It is a framework for building universal or customized microtonal musical keyboard instruments, microtonal experiments and computing, music study, and teaching music lessons with possible remote options. The platform provides several applications executed in a Web browser using shared JavaScript components.

See also [my page](https://en.xen.wiki/w/Sergey_A_Kryukov) at the microtonal community Web site [Xenharmonic Wiki](https://en.xen.wiki). In addition to the Microtonal Fabric links, there are some useful links on different microtonal topics and personalities.

Most of the Microtonal Fabric applications allow the user to play music in a browser. If a multitouch screen is available, the user can play with ten fingers. The required features of the multitouch interface are not as trivial as they may seem at first glance. The present article explains the problem and the solution. It shows how the multitouch behavior is abstracted from the other part of the code, reused, and utilized by different types of on-screen keyboards.

## Live Play


## Conclusions


<!-- copy to CodeProject to here --------------------------------------------->
