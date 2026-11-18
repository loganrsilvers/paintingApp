import { constrainToSquare } from "./ShapeConstraints.js";
import DrawRectAction from "../actions/DrawRectAction.js";
import DrawRadialAction from "../actions/DrawRadialAction.js";
import HistoryManager from "../managers/HistoryManager.js";
import {
    getCenteredPlacement,
    isClickPlacement
} from "./ClickPlacement.js";

class DrawRectState {

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
        // TODO: Create the rectangle and remember its starting position.
        this.firstX = position.x;
        this.firstY = position.y;
        this.isDrawing = true;
    }

    onPointerMove(position) {
        // TODO: Update the rectangle while the pointer is down.
        if (this.isDrawing) {
            const endPosition = position.shiftKey
                ? constrainToSquare(
                    { x: this.firstX, y: this.firstY },
                    position
                )
                : position;
            this.lastX = endPosition.x;
            this.lastY = endPosition.y;
        }
    }

    onPointerUp(position) {
        // TODO: Set the final rectangle size and clear any in-progress state.
        if (!this.isDrawing) {
            return;
        }

        const endPosition = position.shiftKey
            ? constrainToSquare(
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
        const { start, end } = isClick
            ? getCenteredPlacement(position)
            : {
                start: { x: this.firstX, y: this.firstY },
                end: { x: this.lastX, y: this.lastY }
            };
        const fillColor = this.drawingOptions.rainbowEnabled
                ? this.drawingOptions.getRainbowColor()
            : this.colorState.fillColor;
        const action = new DrawRectAction(
            this.stage,
            start,
            end,
            fillColor,
            this.colorState.strokeColor,
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

export default DrawRectState;
