import { constrainLineAngle } from "./ShapeConstraints.js";
import DrawLineAction from "../actions/DrawLineAction.js";
import HistoryManager from "../managers/HistoryManager.js";

class DrawLineState {

    firstX = null;
    firstY = null;
    lastX = null;
    lastY = null;
    isDrawing = false;

    constructor(stage, colorState) {
        this.stage = stage;
        this.colorState = colorState;
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

        HistoryManager.execute(
            new DrawLineAction(
                this.stage,
                { x: this.firstX, y: this.firstY },
                { x: this.lastX, y: this.lastY },
                this.colorState.strokeColor,
                this.colorState.strokeWidth
            )
        );
    }
}

export default DrawLineState;
