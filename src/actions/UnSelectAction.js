class UnSelectAction {
    constructor(selectManager) {
        this.selectManager = selectManager;
    }

    execute() {
        this.selectManager.clearSelected();
    }
}

export default UnSelectAction;
