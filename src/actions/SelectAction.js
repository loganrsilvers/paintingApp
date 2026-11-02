class SelectAction {
    constructor(selectManager, shape) {
        this.selectManager = selectManager;
        this.shape = shape;
    }

    execute() {
        this.selectManager.addSelected(this.shape);
    }
}

export default SelectAction;
