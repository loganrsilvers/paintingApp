import InputManager from "./InputManager.js";
import DrawCircleState from "../states/DrawCircleState.js";
import DrawRectState from "../states/DrawRectState.js";
import DrawLineState from "../states/DrawLineState.js";
import DrawStarState from "../states/DrawStarState.js";

class DrawManager {
    constructor() {
        this.app = null;
        this.colorState = null;
        this.currentState = null;
        this.initialized = false;
    }

    initialize(app, colorState) {
        if (this.initialized) {
            return;
        }

        this.app = app;
        this.colorState = colorState;
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
        this.setState(new DrawCircleState(this.app.stage, this.colorState));
    }

    selectRectangle() {
        this.setState(new DrawRectState(this.app.stage, this.colorState));
    }

    selectLine() {
        this.setState(new DrawLineState(this.app.stage, this.colorState));
    }

    selectStar() {
        this.setState(new DrawStarState(this.app.stage, this.colorState));
    }

}

export default new DrawManager();