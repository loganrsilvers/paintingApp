import GroupShapesAction from "../actions/GroupShapesAction.js";
import UngroupShapesAction from "../actions/UngroupShapesAction.js";
import HistoryManager from "./HistoryManager.js";

class GroupManager {
    constructor() {
        this.selectManager = null;
    }

    initialize(selectManager) {
        this.selectManager = selectManager;
    }

    groupSelected() {
        const shapes = this.selectManager.Selected.filter(
            (shape) => shape.parent === this.selectManager.artworkLayer,
        );
        if (shapes.length < 2) {
            return;
        }

        HistoryManager.execute(
            new GroupShapesAction(this.selectManager, shapes),
        );
    }

    ungroupSelected() {
        const groups = this.selectManager.Selected.filter(
            (shape) =>
                shape.isShapeGroup &&
                shape.parent === this.selectManager.artworkLayer &&
                shape.children.length > 0,
        );
        if (groups.length === 0) {
            return;
        }

        HistoryManager.execute(
            new UngroupShapesAction(this.selectManager, groups),
        );
    }
}

export default new GroupManager();
