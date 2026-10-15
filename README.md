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

todo for next week: 
- draw shapes based on what state you are in (onPointerDown or onPointerUp or pointerMove (click and drag)) at the location that pointer is down (if pointer is down on div id="pixie-container")
- use states (state pattern ((design patterns)))
- ((factory patterns, observer pattern, singleton principle - export default))
- drawCircle drawLine drawStar etc 
* shapes stored in Container (pixie.js) class (and constantly add children to)
- include link to repo in canvas