import ScaleShapeAction from "../actions/ScaleShapeAction.js";
import HistoryManager from "./HistoryManager.js";

class ScaleManager {
    constructor() {
        this.selectManager = null;
        this.pointerPosition = null;
        this.scaleAction = null;
        this.scaleRate = 0.01;
    }

    initialize(selectManager) {
        this.selectManager = selectManager;
    }

    onPointerDown(position) {
        this.pointerPosition = position;
        this.scaleAction = this.selectManager.Selected.length
            ? new ScaleShapeAction(this.selectManager, this.selectManager.Selected)
            : null;
    }

    onPointerMove(position) {
        if (!this.pointerPosition || !this.scaleAction) {
            return;
        }

        const deltaX = (position.x - this.pointerPosition.x) * this.scaleRate;
        const deltaY = (position.y - this.pointerPosition.y) * this.scaleRate;
        if (deltaX !== 0 || deltaY !== 0) {
            this.scaleAction.scaleBy(deltaX, deltaY);
            this.pointerPosition = position;
        }
    }

    onPointerUp(position) {
        if (!this.pointerPosition) {
            return;
        }

        this.onPointerMove(position);
        if (this.scaleAction) {
            this.scaleAction.complete();
            const changed = this.scaleAction.before.some((state, index) => {
                const after = this.scaleAction.after[index];
                return (
                    state.scaleX !== after.scaleX ||
                    state.scaleY !== after.scaleY
                );
            });
            if (changed) {
                HistoryManager.recordExecuted(this.scaleAction);
            }
        }

        this.pointerPosition = null;
        this.scaleAction = null;
    }
}

export default new ScaleManager();
