# paintingApp
node.js painting application

pixie.js (can be used to build games)
adArcade
npm run build
//inspect element on {npx vite preview //// npm run dev} to debug
graphics class
https://pixijs.com/8.x/guides/components/scene-objects/graphics/graphics-fill 

main.js contains tools 
managers/ToolsManager.js connects to id="tool-panel" in index.html
.rect .circle .lineStyle .drawStar

xml - <sender>tove<sender>
json - sender:tove

### goals 4 week 1: 
- draw shapes based on what state you are in (onPointerDown or onPointerUp or pointerMove (click and drag)) at the location that pointer is down (if pointer is down on div id="pixie-container")
- use states (state pattern ((design patterns)))
- ((factory patterns, observer pattern, singleton principle - export default))
- drawCircle drawLine drawStar etc 
* shapes stored in Container (pixie.js) class (and constantly add children to)
- include link to repo in canvas

## week 1: takeaways
![week1 screenshot](readmeIMGs/week1.png)

- added 4 state classes :: circle, rect, line, star 
- added `DrawManager` keeps track of the current drawing state
- `inputManager` already has onPointerUp, onPointerDown, onPointerMove so i didnt need to add those again ,,, they r used in the states a lot (possible TD??)
- 4 the star.........
        - the outer radius is the distance from the center to the tip (onPointerMove)
        - the inner radius is the distance from the center to the little divots between the tips. 
            - /// smaller inner radius = deeper divots (currently set 0.45)

#### week 1 feedback:
- "" maybe even put in a hotkey to hold shift that will force a perfectly scaled 1:1 length width shape instead of distorted
- "" manipulate the scale. star.scale.x star.scale.y or star.scale.set(x,y) so its not the same proportions every time
- maybe add patterns..?

### updates from feedback:: 
![week1.1 screenshot](readmeIMGs/week1-1.png)