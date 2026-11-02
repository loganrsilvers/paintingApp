import DeleteShapeAction from "../actions/DeleteShapeAction.js";
import HistoryManager from "./HistoryManager.js";

class DeleteManager {
    constructor() {
        this.selectManager = null;
    }

    initialize(selectManager) {
        this.selectManager = selectManager;
    }

    deleteSelected() {
        if (!this.selectManager?.Selected.length) {
            return;
        }

        HistoryManager.execute(
            new DeleteShapeAction(
                this.selectManager,
                this.selectManager.Selected
            )
        );
    }
}

export default new DeleteManager();
