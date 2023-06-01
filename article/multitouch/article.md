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

## Implementation

[Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

### Multitouch

The function `setMultiTouch` assumes the following UI model of the multitouch sensitive area: a `container` HTML or SVG element containing one or more HTML or SVG child elements, they can be direct or indirect children.

The function accepts four input arguments, `container` and three handlers:

- `container`: HTML or SVG handling multitouch events
- `elementSelector`: this hander `element =&gt; bool` selects relevant children of the `contaner`, if this handler returns `false`, the event is ignored
- `elementHandler`: this is the handler used to implement the main functionality, for example, produce sounds in response to the keyboard events; the handler accepts `element`, a touch object, and a Boolean `on` argument showing if this is an on of off action.

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

## Microtonal Fabric Applications Using Multitouch Control

<table>
<tr><th>Application</th><th>Source code</th><th>Live play</th></tr>
<tr><td>Multi-EDO</td><td>Multi-EDO</td><td><a href="https://sakryukov.github.io/microtonal-fabric/code/Multi-EDO">Multi-EDO</a></td></tr>
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

## Usage Examples

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
    (keyElement, _, on) => { handler(keyElement, on); });
```

<!-- copy to CodeProject to here --------------------------------------------->
