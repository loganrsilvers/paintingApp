import InputManager from "./InputManager.js";
import DrawCircleState from "../states/DrawCircleState.js";
import DrawRectState from "../states/DrawRectState.js";
import DrawLineState from "../states/DrawLineState.js";
import DrawStarState from "../states/DrawStarState.js";

class DrawManager {
    constructor() {
        this.app = null;
        this.currentState = null;
        this.initialized = false;
    }

    initialize(app) {
        if (this.initialized) {
            return;
        }

        this.app = app;
        this.initialized = true;

        InputManager.PointerDownEvent.addListener((position) => {
            this.currentState?.onPointerDown(position);
        });

        InputManager.PointerMoveEvent.addListener((position) => {
            this.currentState?.onPointerMove(position);
        });

        InputManager.PointerUpEvent.addListener((position) => {
            this.currentState?.onPointerUp(position);
        });
    }

    setState(state) {
        this.currentState = state;
    }

    selectCircle() {
        this.setState(new DrawCircleState(this.app.stage));
    }

    selectRectangle() {
        this.setState(new DrawRectState(this.app.stage));
    }

    selectLine() {
        this.setState(new DrawLineState(this.app.stage));
    }

    selectStar() {
        this.setState(new DrawStarState(this.app.stage));
    }

}

export default new DrawManager();