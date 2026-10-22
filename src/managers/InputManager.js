import { Rectangle } from "pixi.js";
import { Event } from "../Event.js";

class InputManager {

    #mouseDown = false;
    
    constructor() {
        this.app = null;
        this.initialized = false;
        this.mouseDown = false;
        
        this.PointerDownEvent = new Event();
        this.PointerMoveEvent = new Event();
        this.PointerUpEvent = new Event();        
    }

    initialize(app) {
        if (this.initialized) {
            return;
        }

        this.app = app;
        this.initialized = true;        
        
        this.setupEvents();
    }

    setupEvents() {
        this.app.stage.eventMode = "static";

        this.app.stage.hitArea = new Rectangle(
            0,
            0,
            this.app.screen.width,
            this.app.screen.height
        );
        
        this.app.stage.on("pointerdown", (event) => {
            this.onPointerDown(event);
            this.#mouseDown = true;
        });

        this.app.stage.on("pointermove", (event) => {
            this.onPointerMove(event);
        });

        this.app.stage.on("pointerup", (event) => {
            this.onPointerUp(event);
            this.#mouseDown = false;
        });
    }

    onPointerDown(event) {
        console.log(event.global.x, event.global.y);
        this.PointerDownEvent.invoke({x:event.global.x,y:event.global.y});
    }

    onPointerMove(event) {
        this.PointerMoveEvent.invoke({
            x: event.global.x,
            y: event.global.y,
            shiftKey: event.shiftKey
        });
    }

    onPointerUp(event) {
        this.PointerUpEvent.invoke({
            x: event.global.x,
            y: event.global.y,
            shiftKey: event.shiftKey
        });
    }
    
    getIsMouseDown() {
        return this.#mouseDown;
    }

}

export default new InputManager();