import InputManager from "./InputManager.js";
import DrawCircleState from "../states/DrawCircleState.js";
import DrawRectState from "../states/DrawRectState.js";
import DrawLineState from "../states/DrawLineState.js";
import DrawStarState from "../states/DrawStarState.js";
import SelectState from "../states/SelectState.js";
import SelectManager from "./SelectManager.js";
import MoveManager from "./MoveManager.js";
import ScaleManager from "./ScaleManager.js";
import RotateManager from "./RotateManager.js";

class DrawManager {
    constructor() {
        this.app = null;
        this.colorState = null;
        this.currentState = null;
        this.artworkLayer = null;
        this.initialized = false;
    }

    initialize(app, colorState, artworkLayer) {
        if (this.initialized) {
            return;
        }

        this.app = app;
        this.colorState = colorState;
        this.artworkLayer = artworkLayer;
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
        this.setState(new DrawCircleState(this.artworkLayer, this.colorState));
    }

    selectRectangle() {
        this.setState(new DrawRectState(this.artworkLayer, this.colorState));
    }

    selectLine() {
        this.setState(new DrawLineState(this.artworkLayer, this.colorState));
    }

    selectStar() {
        this.setState(new DrawStarState(this.artworkLayer, this.colorState));
    }

    selectTool() {
        this.setState(new SelectState(SelectManager));
    }

    selectMoveTool() {
        this.setState(MoveManager);
    }

    selectScaleTool() {
        this.setState(ScaleManager);
    }

    selectRotateTool() {
        this.setState(RotateManager);
    }

}

export default new DrawManager();