import MoveShapeAction from "../actions/MoveShapeAction.js";
import HistoryManager from "./HistoryManager.js";

class MoveManager {
    constructor() {
        this.selectManager = null;
        this.pointerPosition = null;
        this.moveAction = null;
    }

    initialize(selectManager) {
        this.selectManager = selectManager;
    }

    onPointerDown(position) {
        this.pointerPosition = position;
        this.moveAction = this.selectManager.Selected.length
            ? new MoveShapeAction(this.selectManager, this.selectManager.Selected)
            : null;
    }

    moveSelectedByKeyboard(deltaX, deltaY) {
        if (this.selectManager.Selected.length === 0 || (deltaX === 0 && deltaY === 0)) {
            return;
        }

        const action = new MoveShapeAction(
            this.selectManager,
            this.selectManager.Selected
        );
        action.moveBy(deltaX, deltaY);
        HistoryManager.recordExecuted(action);
    }

    onPointerMove(position) {
        if (!this.pointerPosition || !this.moveAction) {
            return;
        }

        const deltaX = position.x - this.pointerPosition.x;
        const deltaY = position.y - this.pointerPosition.y;
        if (deltaX !== 0 || deltaY !== 0) {
            this.moveAction.moveBy(deltaX, deltaY);
            this.pointerPosition = position;
        }
    }

    onPointerUp(position) {
        if (!this.pointerPosition) {
            return;
        }

        this.onPointerMove(position);
        if (this.moveAction && (this.moveAction.deltaX !== 0 || this.moveAction.deltaY !== 0)) {
            HistoryManager.recordExecuted(this.moveAction);
        }

        this.pointerPosition = null;
        this.moveAction = null;
    }
}

export default new MoveManager();
