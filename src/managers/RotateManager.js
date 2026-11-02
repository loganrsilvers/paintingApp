import RotateShapeAction from "../actions/RotateShapeAction.js";
import HistoryManager from "./HistoryManager.js";
import Utils from "./Utils.js";

class RotateManager {
    constructor() {
        this.selectManager = null;
        this.pointerAngle = null;
        this.rotationAction = null;
    }

    initialize(selectManager) {
        this.selectManager = selectManager;
    }

    onPointerDown(position) {
        const shapes = this.selectManager.Selected;
        if (shapes.length === 0) {
            this.pointerAngle = null;
            this.rotationAction = null;
            return;
        }

        const center = this.selectManager.getSelectionCenter(shapes);
        if (!center || (position.x === center.x && position.y === center.y)) {
            this.pointerAngle = null;
            this.rotationAction = null;
            return;
        }

        this.pointerAngle = Utils.angleBetweenPoints(center, position);
        this.rotationAction = new RotateShapeAction(
            this.selectManager,
            shapes,
            center
        );
    }

    onPointerMove(position) {
        if (this.pointerAngle === null || !this.rotationAction) {
            return;
        }

        const center = this.rotationAction.center;
        const nextAngle = Utils.angleBetweenPoints(center, position);
        const delta = Utils.angleDelta(this.pointerAngle, nextAngle);
        if (delta !== 0) {
            this.rotationAction.rotateBy(delta);
            this.pointerAngle = nextAngle;
        }
    }

    onPointerUp(position) {
        if (this.rotationAction) {
            this.onPointerMove(position);
            if (this.rotationAction.rotation !== 0) {
                this.rotationAction.complete();
                HistoryManager.recordExecuted(this.rotationAction);
            }
        }

        this.pointerAngle = null;
        this.rotationAction = null;
    }
}

export default new RotateManager();
