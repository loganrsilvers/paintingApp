
class HistoryManager {
    constructor() {
        this.history = [];
        this.undoStack = [];
    }

    execute(action) {
        this.#validateAction(action);
        action.execute();
        this.history.push(action);
    }

    undo() {
        const action = this.history[this.history.length - 1];
        if (!action) {
            return;
        }

        action.undo();
        this.history.pop();
        this.undoStack.push(action);
    }

    redo() {
        const action = this.undoStack[this.undoStack.length - 1];
        if (!action) {
            return;
        }

        action.redo();
        this.undoStack.pop();
        this.history.push(action);
    }

    #validateAction(action) {
        for (const method of ["execute", "undo", "redo"]) {
            if (typeof action?.[method] !== "function") {
                throw new TypeError(`History action must implement ${method}().`);
            }
        }
    }
}

export default new HistoryManager();