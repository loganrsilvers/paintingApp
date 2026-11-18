import InputManager from "./InputManager.js";
import DrawCircleState from "../states/DrawCircleState.js";
import DrawRectState from "../states/DrawRectState.js";
import DrawLineState from "../states/DrawLineState.js";
import DrawStarState from "../states/DrawStarState.js";
import DrawStampState from "../states/DrawStampState.js";
import DrawAsciiState from "../states/DrawAsciiState.js";
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
        this.drawingOptions = {
            radialEffect: false,
            rainbowEnabled: false,
            palette: [],
            lastRainbowColor: null,
            getRainbowColor: () => this.getRainbowColor(),
            onClickPlacement: () => this.selectTool()
        };
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

    setRadialEffect(enabled) {
        this.drawingOptions.radialEffect = enabled;
    }

    setRainbowPalette(palette) {
        this.drawingOptions.palette = palette.map(({ value }) => value);
    }

    setRainbowEnabled(enabled) {
        this.drawingOptions.rainbowEnabled = enabled;
    }

    getRainbowColor() {
        const colors = this.drawingOptions.palette;
        if (colors.length === 0) {
            throw new Error("The color palette must be initialized before rainbow drawing.");
        }

        const previousColor = this.drawingOptions.lastRainbowColor;
        const availableColors = colors.filter(
            (color) => color !== previousColor
        );
        const choices = availableColors.length > 0 ? availableColors : colors;
        const color = choices[
            Math.floor(Math.random() * choices.length)
        ];
        this.drawingOptions.lastRainbowColor = color;
        return color;
    }

    selectCircle() {
        this.setState(new DrawCircleState(
            this.artworkLayer,
            this.colorState,
            this.drawingOptions
        ));
    }

    selectRectangle() {
        this.setState(new DrawRectState(
            this.artworkLayer,
            this.colorState,
            this.drawingOptions
        ));
    }

    selectLine() {
        this.setState(new DrawLineState(
            this.artworkLayer,
            this.colorState,
            this.drawingOptions
        ));
    }

    selectStar() {
        this.setState(new DrawStarState(
            this.artworkLayer,
            this.colorState,
            this.drawingOptions
        ));
    }

    selectStamp(stamp) {
        this.setState(new DrawStampState(
            this.artworkLayer,
            stamp,
            this.drawingOptions
        ));
    }

    selectAsciiBrush(pattern) {
        this.setState(new DrawAsciiState(
            this.artworkLayer,
            pattern,
            this.colorState,
            this.drawingOptions,
            this.app.screen
        ));
    }

    selectTool() {
        this.setState(new SelectState(SelectManager));
        if (this.app?.canvas) {
            this.app.canvas.style.cursor = "default";
        }
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