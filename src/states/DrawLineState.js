import { constrainLineAngle } from "./ShapeConstraints.js";
import DrawLineAction from "../actions/DrawLineAction.js";
import DrawRadialAction from "../actions/DrawRadialAction.js";
import HistoryManager from "../managers/HistoryManager.js";
import { getRandomSize, isClickPlacement } from "./ClickPlacement.js";

class DrawLineState {

    firstX = null;
    firstY = null;
    lastX = null;
    lastY = null;
    isDrawing = false;

    constructor(stage, colorState, drawingOptions = { radialEffect: false }) {
        this.stage = stage;
        this.colorState = colorState;
        this.drawingOptions = drawingOptions;
    }

    onPointerDown(position) {
        // TODO: Create the line and remember its starting position.
        this.firstX = position.x;
        this.firstY = position.y;
        this.isDrawing = true;
    }

    onPointerMove(position) {
        // TODO: Update the line endpoint while the pointer is down.
        if (this.isDrawing) {
            const endPosition = position.shiftKey
                ? constrainLineAngle(
                    { x: this.firstX, y: this.firstY },
                    position
                )
                : position;
            this.lastX = endPosition.x;
            this.lastY = endPosition.y;
        }
    }

    onPointerUp(position) {
        // TODO: Set the final line endpoint and clear any in-progress state.
        if (!this.isDrawing) {
            return;
        }

        const endPosition = position.shiftKey
            ? constrainLineAngle(
                { x: this.firstX, y: this.firstY },
                position
            )
            : position;
        this.lastX = endPosition.x;
        this.lastY = endPosition.y;
        this.isDrawing = false;

        const isClick = isClickPlacement(
            { x: this.firstX, y: this.firstY },
            position
        );
        const size = isClick ? getRandomSize() : 0;
        const start = isClick
            ? { x: position.x - size / 2, y: position.y }
            : { x: this.firstX, y: this.firstY };
        const end = isClick
            ? { x: position.x + size / 2, y: position.y }
            : { x: this.lastX, y: this.lastY };
        const strokeColor = this.drawingOptions.rainbowEnabled
            ? this.drawingOptions.getRainbowColor()
            : this.colorState.strokeColor;
        const action = new DrawLineAction(
            this.stage,
            start,
            end,
            strokeColor,
            this.colorState.strokeWidth
        );
        HistoryManager.execute(
            this.drawingOptions.radialEffect
                ? new DrawRadialAction(action)
                : action
        );
        if (isClick) {
            this.drawingOptions.onClickPlacement?.();
        }
    }
}

export default DrawLineState;
