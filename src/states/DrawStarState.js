import { constrainToSquare } from "./ShapeConstraints.js";
import DrawStarAction from "../actions/DrawStarAction.js";
import HistoryManager from "../managers/HistoryManager.js";

class DrawStarState {

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
        // TODO: Create the star and remember its starting position.
        this.firstX = position.x;
        this.firstY = position.y;
        this.isDrawing = true;
    }

    onPointerMove(position) {
        // TODO: Update the star size while the pointer is down.
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
        if (!this.isDrawing) return;

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
            new DrawStarAction(
                this.stage,
                { x: this.firstX, y: this.firstY },
                { x: this.lastX, y: this.lastY },
                this.colorState.fillColor,
                this.colorState.strokeColor,
                this.colorState.strokeWidth
            )
        );
    }

}

export default DrawStarState;
