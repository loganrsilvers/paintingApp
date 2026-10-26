import { constrainToSquare } from "./ShapeConstraints.js";
import DrawCircleAction from "../actions/DrawCircleAction.js";
import HistoryManager from "../managers/HistoryManager.js";

class DrawCircleState {

    firstX = null;
    firstY = null;
    lastX = null;
    lastY = null;
    isDrawing = false;

    constructor(stage) {
        this.stage = stage;
    }

    // https://pixijs.download/dev/docs/maths.Circle.html
    onPointerDown(position) {
        // TODO: Create the circle and remember its starting position.
        this.firstX = position.x;
        this.firstY = position.y;
        this.isDrawing = true;

    }

    onPointerMove(position) {
        // TODO: Update the circle while the pointer is down.
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
        // TODO: Set the final circle size and clear any in-progress state.
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

        HistoryManager.execute(
            new DrawCircleAction(
                this.stage,
                { x: this.firstX, y: this.firstY },
                { x: this.lastX, y: this.lastY }
            )
        );
    }
}

export default DrawCircleState;
