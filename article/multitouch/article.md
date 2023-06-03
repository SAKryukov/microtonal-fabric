@numbering {
    enable: false
}

{title}Multitouch Support for Ten-Finger Playing and More

[*Sergey A Kryukov*](https://www.SAKryukov.org)

Microtonal Fabric uses multitouch screen support for the musical keyboards.

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
- Present article

Last three articles are devoted to the project named [Microtonal FabrMicrotonal Fabricic](https://en.xen.wiki/w/Sergey_A_Kryukov#Microtonal_Fabric), a  microtonal music platform based on [WebAudio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). It is a framework for building universal or customized microtonal musical keyboard instruments, microtonal experiments and computing, music study, and teaching music lessons with possible remote options. The platform provides several applications executed in a Web browser using shared JavaScript components.

Most of the Microtonal Fabric applications allowes the user to play music in a browser. If a multitouch screen is available, the user can play with ten fingers. The required features of the multitouch interface are not so trivial as it may seem at first glance. The present article explains the problem, the solution. It shows how the multitouch behavior is abstracted from the other part of the code, reused, and utilized by different types of on-screeen keyboards.

In the approach discussed, the application of the present multitouch solution is not limited to musical keyboards. The view model of the keyboard lools like a collection of HTML or SVG elemets with two states: "activated" (down) or "deactivated" (up). The states can be modified by the user or by software in many different ways. First, let's consider the entire problem.

## Keyboard Keys are not Like Buttons!

So, why the multitouch control of the keyboard presents some problem. Well, it would be not a problem at all, but inertia of thinking could lead us in a wrong direction.

## Microtonal Fabric Applications Using Multitouch Control

<table>
<tr><th>Application</th><th>Source code</th><th>Live play</th></tr>
<tr><td>Multi-EDO</td><td>./Multi-EDO</td><td><a href="https://sakryukov.github.io/microtonal-fabric/code/Multi-EDO">Multi-EDO</a></td></tr>
<tr><td>29-EDO</td><td>./29-EDO</td><td><a href="https://sakryukov.github.io/microtonal-fabric/code/29-EDO">29-EDO</a></td></tr>
<tr><td>Microtonal Playground</td><td>./playground</td><td>
    <a href="https://sakryukov.github.io/microtonal-fabric/code/playground?user.data">Aura's Diatonic Scales</a><br/>
    <a href="https://sakryukov.github.io/microtonal-fabric/code/playground?custom/12-EDO.user.data">Common-practice 12-EDO</a><br/>
    <a href="https://sakryukov.github.io/microtonal-fabric/code/playground?custom/shruti.user.data">Shruti Scales</a><br/>
    <a href="https://sakryukov.github.io/microtonal-fabric/code/playground?custom/chinese.user.data">Traditional Chinese Tonal System</a><br/>
    <a href="https://sakryukov.github.io/microtonal-fabric/code/playground?custom/customized.user.data"></a>Microtonal Playground Customization Demo<br/>
</td></tr>
<tr><td>Kite Giedraitis<br/>(under development)</td><td>./Kite.Giedraitis</td><td>https://sakryukov.github.io/microtonal-fabric/code/Kite.Giedraitis</td></tr>
</table>

## Implementation

The idea is: we need a separate unit abstracted from the set of UI elements representing the keyboard. We are going to set some [touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) to the singl HTML or SVG control representing the entire contols. These events should be interpreted by some events that may or may not related to the koeboard keys. To pull the information on the keys from the user, we are going to use *inversion of control*.

### Multitouch

The function `setMultiTouch` assumes the following UI model of the multitouch sensitive area: a `container` HTML or SVG element containing one or more HTML or SVG child elements, they can be direct or indirect children.

The function accepts four input arguments, `container` and three handlers:

- `container`: HTML or SVG handling multitouch events
- `elementSelector`: this hander `element => bool` selects relevant children of the `contaner`, if this handler returns `false`, the event is ignored. Essentially, this handler is used by the user code to define the HTML or SVG elements to be interpreted as keys of some keyboard represented by the `container`.
- `elementHandler`: this handler `(element, Touch touchObject, bool on) => undefined` is used to implement the main functionality, for example, produce sounds in response to the keyboard events; the handler accepts `element`, a touch object, and a Boolean `on` argument showing if this is an on of off action. Basically, this handler calls a general semantic handler which can be triggered in different way, for example, through a keyboard or a mouse. Essentially, it implements the action triggered when a keyboard key, represented by `element` is activated or deactiveted, depending on the value of `on`. 

"ui.components/multitouch.js":

```{lang=JavaScript}{id=code-multitouch}
"use strict";

const setMultiTouch = (
    container,
    elementSelector, // element =&gt; bool
    elementHandler,  // (element, Touch touchObject, bool on) =&gt; undefined
    sameElementHandler, // (element, Touch touchObject) =&gt;
                        // undefined:
                        //     handles move in the area of the same element
) =&gt; {

    if (!container) container = document;

    const assignEvent = (element, name, handler) =&gt; {
        element.addEventListener(name, handler, {
            passive: false, capture: true
        });
    };
    const assignTouchStart = (element, handler) =&gt; {
        assignEvent(element, "touchstart", handler);
    };
    const assignTouchMove = (element, handler) =&gt; {
        assignEvent(element, "touchmove", handler);
    };
    const assignTouchEnd = (element, handler) =&gt; {
        assignEvent(element, "touchend", handler);
    };

    if (!elementSelector)
        return {
            assignTouchStart: assignTouchStart,
            assignTouchMove: assignTouchMove,
            dynamicAlgorithm: (touch, volumeDivider) =&gt; {
                   return Math.pow(touch.radiusX * touch.radiusY, 2) /
                    volumeDivider;
            }};

    const isGoodElement = element =&gt; element && elementSelector(element); 
    const elementDictionary = {};
    
    const addRemoveElement = (touch, element, doAdd) =&gt; {
        if (isGoodElement(element) && elementHandler)
            elementHandler(element, touch, doAdd);
        if (doAdd)
            elementDictionary[touch.identifier] = element;
        else
            delete elementDictionary[touch.identifier];
    }; //addRemoveElement

    assignTouchStart(container, ev =&gt; {
        ev.preventDefault();
        if (ev.changedTouches.length &lt; 1) return;
        const touch = ev.changedTouches[ev.changedTouches.length - 1];
        const element =
            document.elementFromPoint(touch.clientX, touch.clientY);
        addRemoveElement(touch, element, true);    
    }); //assignTouchStart
    
    assignTouchMove(container, ev =&gt; {
        ev.preventDefault();
        for (let touch of ev.touches) {
            let element =
                document.elementFromPoint(touch.clientX, touch.clientY);
            const goodElement = isGoodElement(element); 
            const touchElement = elementDictionary[touch.identifier];
            if (goodElement && touchElement) {
                if (element == touchElement) {
                    if (sameElementHandler)
                        sameElementHandler(element, touch)
                        continue;
                    } //if same
                addRemoveElement(touch, touchElement, false);            
                addRemoveElement(touch, element, true);
            } else {
                if (goodElement)
                    addRemoveElement(touch, element, goodElement);
                else
                    addRemoveElement(touch, touchElement, goodElement);
            } //if    
        } //loop
    }); //assignTouchMove
    
    assignTouchEnd(container, ev =&gt; {
        ev.preventDefault();
        for (let touch of ev.changedTouches) {
            const element =
                document.elementFromPoint(touch.clientX, touch.clientY);
            addRemoveElement(touch, element, false);
        } //loop
    }); //assignTouchEnd

};
```

### Usage Examples

"29-EDO/ui/keyboard.js":

```{lang=JavaScript}{id=code-29-edo}
setMultiTouch(
    element,
    element => element.constructor == SVGRectElement,
    (element, _, on) =&gt; handler(element, on));
```

"Kite.Giedraitis/ui/keyboard.js":

```{lang=JavaScript}{id=code-round}
setMultiTouch(
    svg.element,
    element => element.constructor == SVGCircleElement, 
    (element, _, on) =&gt; handler(element, on));
```

"Multi-EDO/keyboard-handler.js":

```{lang=JavaScript}{id=code-dictionary}
setMultiTouch(
    definitionSet.elements.keyboard,
    (element) => { return element.dataset.multiTouchTarget; },
    (element, touch, on) => {
        const volume = 1;
        element.key.activate(element.key, false, on, volume);
    } //elementHandler
);
```
"ui.components/abstract-keyboard.js"

```{lang=JavaScript}{id=code-abstract-keyboard}
setMultiTouch(
    parentElement,
    keyElement => this.isTouchKey(parentElement, keyElement),
    (keyElement, _, on) => handler(keyElement, on));
```
### Abstract Keyboard

`IInterface` (agnostic/interfaces.js") &#x25C1;&#x2014; `IKeyboardGeometry` ("ui.components\abstract-keyboard.js")

`VirtualKeyboard` ("ui.components\abstract-keyboard.js") &#x25C1;&#x2500; `GridKeyboard` ("ui.components\grid-keyboard.js") &#x25C1;― `PlaygroungKeyboard` ("playground\ui\playground-keyboard.js")

"ui.components\abstract-keyboard.js":

```{lang=JavaScript}{id=code-ikeyboardgeometry}
class IKeyboardGeometry extends IInterface {
    createKeys(parentElement) {}
    createCustomKeyData(keyElement, index) {}
    highlightKey(keyElement, keyboardMode) {}
    isTouchKey(parentElement, keyElement) {} // for touch interface
    get defaultChord() {} // should return array of indices of keys in default chord
    customKeyHandler(keyElement, keyData, on) {} // return false to stop embedded handling
}
```

### Using Extra Data

## Conclusions

<!-- copy to CodeProject to here --------------------------------------------->
