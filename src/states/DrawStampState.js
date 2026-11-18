import { constrainToSquare } from "./ShapeConstraints.js";
import DrawStampAction from "../actions/DrawStampAction.js";
import HistoryManager from "../managers/HistoryManager.js";

class DrawStampState {
    firstX = null;
    firstY = null;
    lastX = null;
    lastY = null;
    isDrawing = false;

    constructor(stage, stamp) {
        this.stage = stage;
        this.stamp = stamp;
    }

    onPointerDown(position) {
        this.firstX = position.x;
        this.firstY = position.y;
        this.lastX = position.x;
        this.lastY = position.y;
        this.isDrawing = true;
    }

    onPointerMove(position) {
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
    }

    onPointerUp(position) {
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
            new DrawStampAction(
                this.stage,
                { x: this.firstX, y: this.firstY },
                { x: this.lastX, y: this.lastY },
                this.stamp
            )
        );
    }
}

export default DrawStampState;
