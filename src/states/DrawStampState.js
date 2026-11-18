import { constrainToSquare } from "./ShapeConstraints.js";
import DrawStampAction from "../actions/DrawStampAction.js";
import DrawRadialAction from "../actions/DrawRadialAction.js";
import HistoryManager from "../managers/HistoryManager.js";
import {
    getCenteredPlacement,
    isClickPlacement
} from "./ClickPlacement.js";

class DrawStampState {
    firstX = null;
    firstY = null;
    lastX = null;
    lastY = null;
    isDrawing = false;

    constructor(stage, stamp, drawingOptions = { radialEffect: false }) {
        this.stage = stage;
        this.stamp = stamp;
        this.drawingOptions = drawingOptions;
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

        const isClick = isClickPlacement(
            { x: this.firstX, y: this.firstY },
            position
        );
        const dimensions = this.stamp.texture.orig;
        const { start, end } = isClick
            ? getCenteredPlacement(
                position,
                dimensions.width,
                dimensions.height
            )
            : {
                start: { x: this.firstX, y: this.firstY },
                end: { x: this.lastX, y: this.lastY }
            };
        const action = new DrawStampAction(
            this.stage,
            start,
            end,
            this.stamp
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

export default DrawStampState;
