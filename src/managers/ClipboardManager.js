import CloneShapesAction from "../actions/CloneShapesAction.js";
import ShapeCloner from "./ShapeCloner.js";
import HistoryManager from "./HistoryManager.js";

class ClipboardManager {
    constructor() {
        this.selectManager = null;
        this.shapes = [];
        this.pasteCount = 0;
    }

    initialize(selectManager) {
        this.selectManager = selectManager;
    }

    copySelected() {
        this.shapes = this.selectManager.Selected.map((shape) =>
            ShapeCloner.clone(shape)
        );
        this.pasteCount = 0;
    }

    paste() {
        if (this.shapes.length === 0) {
            return;
        }

        this.pasteCount += 1;
        HistoryManager.execute(
            new CloneShapesAction(this.selectManager, this.shapes, {
                x: 20 * this.pasteCount,
                y: 20 * this.pasteCount
            })
        );
    }
}

export default new ClipboardManager();
